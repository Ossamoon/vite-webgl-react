export const initBuffers = (gl: WebGLRenderingContext) => {
  // Create position buffer
  const positions = [
    // Front face
    ...[-1.0, -1.0, 1.0],
    ...[1.0, -1.0, 1.0],
    ...[1.0, 1.0, 1.0],
    ...[-1.0, 1.0, 1.0],

    // Back face
    ...[-1.0, -1.0, -1.0],
    ...[-1.0, 1.0, -1.0],
    ...[1.0, 1.0, -1.0],
    ...[1.0, -1.0, -1.0],

    // Top face
    ...[-1.0, 1.0, -1.0],
    ...[-1.0, 1.0, 1.0],
    ...[1.0, 1.0, 1.0],
    ...[1.0, 1.0, -1.0],

    // Bottom face
    ...[-1.0, -1.0, -1.0],
    ...[1.0, -1.0, -1.0],
    ...[1.0, -1.0, 1.0],
    ...[-1.0, -1.0, 1.0],

    // Right face
    ...[1.0, -1.0, -1.0],
    ...[1.0, 1.0, -1.0],
    ...[1.0, 1.0, 1.0],
    ...[1.0, -1.0, 1.0],

    // Left face
    ...[-1.0, -1.0, -1.0],
    ...[-1.0, -1.0, 1.0],
    ...[-1.0, 1.0, 1.0],
    ...[-1.0, 1.0, -1.0],
  ];

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Create color buffer
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.
  let colors: number[] = [];
  for (const c of faceColors) {
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Build the element array
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  const indices = [
    ...[...[0, 1, 2], ...[0, 2, 3]], // front
    ...[...[4, 5, 6], ...[4, 6, 7]], // back
    ...[...[8, 9, 10], ...[8, 10, 11]], // top
    ...[...[12, 13, 14], ...[12, 14, 15]], // bottom
    ...[...[16, 17, 18], ...[16, 18, 19]], // right
    ...[...[20, 21, 22], ...[20, 22, 23]], // left
  ];

  // Now send the element array to GL
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
};
