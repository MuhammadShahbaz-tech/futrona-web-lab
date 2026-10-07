import vertexShaderSource from "./shaders/vertexShader.js";
import fragmentShaderSource from "./shaders/fragmentShader.js";

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "WebGL shader error:",
      gl.getShaderInfoLog(shader)
    );

    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

const createProgram = (
  gl,
  vertexShaderObject,
  fragmentShaderObject
) => {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShaderObject);
  gl.attachShader(program, fragmentShaderObject);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "WebGL program error:",
      gl.getProgramInfoLog(program)
    );

    gl.deleteProgram(program);
    return null;
  }

  return program;
};

const webglRenderer = (canvas) => {
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
    return;
  }

  const program = createProgram(
    gl,
    vertexShaderObject,
    fragmentShaderObject
  );

  if (!program) {
    return;
  }

  const positionLocation = gl.getAttribLocation(
    program,
    "a_position"
  );

  const timeLocation = gl.getUniformLocation(
    program,
    "u_time"
  );

  const resolutionLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    positionBuffer
  );

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]),
    gl.STATIC_DRAW
  );

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    gl.viewport(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  resize();

  window.addEventListener("resize", resize);

  const startTime = performance.now();

  let animationFrame;

  const render = (currentTime) => {
    const elapsed =
      (currentTime - startTime) / 1000;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      positionBuffer
    );

    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.uniform1f(
      timeLocation,
      elapsed
    );

    gl.uniform2f(
      resolutionLocation,
      canvas.width,
      canvas.height
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      6
    );

    animationFrame =
      requestAnimationFrame(render);
  };

  animationFrame =
    requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(animationFrame);

    window.removeEventListener(
      "resize",
      resize
    );

    gl.deleteBuffer(positionBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShaderObject);
    gl.deleteShader(fragmentShaderObject);
  };
};

export default webglRenderer;