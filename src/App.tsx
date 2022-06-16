import { useEffect, useRef } from "react";
import "./App.css";
import { initBuffers } from "./buffer";
import { drawScene } from "./renderer";
import { initShaderProgram } from "./shader";

// Vertex shader program
const vsSource: string = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
}
`;

// Fragment shader program
const fsSource: string = `
varying lowp vec4 vColor;

void main() {
  gl_FragColor = vColor;
}
`;

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
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (shaderProgram === null) {
      console.error("Failed to initialize shader program.");
      return;
    }

    // Store attribute and uniform locations
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
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
      },
    };

    // Initialize buffers
    const buffers = initBuffers(gl);

    let then = 0;

    // Draw the scene repeatedly
    const render = (now: DOMHighResTimeStamp) => {
      now *= 0.001; // convert to seconds
      const deltaTime = now - then;
      then = now;

      drawScene(gl, programInfo, buffers, deltaTime);

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
