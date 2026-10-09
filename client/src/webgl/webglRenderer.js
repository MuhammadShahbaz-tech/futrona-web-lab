
import vertexShaderSource from "./shaders/vertexShader.js";
import fragmentShaderSource from "./shaders/fragmentShader.js";

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("WebGL shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

const createProgram = (gl, vertexShaderObject, fragmentShaderObject) => {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShaderObject);
  gl.attachShader(program, fragmentShaderObject);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("WebGL program error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
};

const webglRenderer = (canvas, mode = 0) => {
  const gl =
    canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl");

  if (!gl) {
    console.error("WebGL is not supported.");
    return;
  }

  const vertexShaderObject = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
  );

  const fragmentShaderObject = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  if (!vertexShaderObject || !fragmentShaderObject) {
    if (vertexShaderObject) gl.deleteShader(vertexShaderObject);
    if (fragmentShaderObject) gl.deleteShader(fragmentShaderObject);
    return;
  }

  const program = createProgram(
    gl,
    vertexShaderObject,
    fragmentShaderObject
  );

  if (!program) {
    gl.deleteShader(vertexShaderObject);
    gl.deleteShader(fragmentShaderObject);
    return;
  }

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const timeLocation = gl.getUniformLocation(program, "u_time");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const mouseLocation = gl.getUniformLocation(program, "u_mouse");
  const modeLocation = gl.getUniformLocation(program, "u_mode");

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]),
    gl.STATIC_DRAW
  );

  let pixelRatio = 1;
  let mouseX = 0;
  let mouseY = 0;

  const resize = () => {
    pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    canvas.width = Math.round(
      canvas.clientWidth * pixelRatio
    );

    canvas.height = Math.round(
      canvas.clientHeight * pixelRatio
    );

    gl.viewport(
      0,
      0,
      canvas.width,
      canvas.height
    );

    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;
  };

  const handlePointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();

    mouseX = (event.clientX - rect.left) * pixelRatio;
    mouseY = (rect.bottom - event.clientY) * pixelRatio;
  };

  const handlePointerLeave = () => {
    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;
  };

  resize();

  window.addEventListener("resize", resize);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerleave", handlePointerLeave);

  const startTime = performance.now();
  let animationFrame;

  const render = (currentTime) => {
    const elapsed = (currentTime - startTime) / 1000;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.uniform1f(timeLocation, elapsed);
    gl.uniform1f(modeLocation, mode);
    gl.uniform2f(
      resolutionLocation,
      canvas.width,
      canvas.height
    );
    gl.uniform2f(mouseLocation, mouseX, mouseY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animationFrame = requestAnimationFrame(render);
  };

  animationFrame = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(animationFrame);

    window.removeEventListener("resize", resize);
    canvas.removeEventListener("pointermove", handlePointerMove);
    canvas.removeEventListener("pointerleave", handlePointerLeave);

    gl.deleteBuffer(positionBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShaderObject);
    gl.deleteShader(fragmentShaderObject);
  };
};

export default webglRenderer;
