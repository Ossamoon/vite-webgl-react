import { useEffect, useRef } from "react";
import "./App.css";
import { initBuffers } from "./buffer";
import { drawScene } from "./renderer";
import { initShaderProgram } from "./shader";
import { loadTexture } from "./texture";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      console.error("Ref of canvas element is null.");
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    const gl: WebGLRenderingContext | null = canvas.getContext("webgl");

    if (gl === null) {
      alert(
        "Unable to initialize WebGL. Your browser or machine may not support it."
      );
      console.error("Failed to get canvas context of WebGL.");
      return;
    }

    // Initialize shader program
    const shaderProgram = initShaderProgram(gl);
    if (shaderProgram === null) {
      console.error("Failed to initialize shader program.");
      return;
    }

    // Store attribute and uniform locations
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram,
          "uProjectionMatrix"
        ),
        modelViewMatrix: gl.getUniformLocation(
          shaderProgram,
          "uModelViewMatrix"
        ),
        uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
      },
    };

    // Initialize buffers
    const buffers = initBuffers(gl);

    // Load texture
    const texture = loadTexture(gl, "/image.jpg");

    // Draw the scene repeatedly
    let then = 0;
    const render = (now: DOMHighResTimeStamp) => {
      now *= 0.001; // convert to seconds
      const deltaTime = now - then;
      then = now;

      drawScene(gl, programInfo, buffers, texture, deltaTime);

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}

export default App;
