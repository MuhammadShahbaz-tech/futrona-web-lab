
export function initWebGLFallback(canvas, onStatus = () => { }) {
  const gl =
    canvas.getContext("webgl2", {
      alpha: false,
      antialias: true,
    }) ||
    canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
    });

  if (!gl) {
    onStatus("WEBGL FALLBACK UNAVAILABLE");
    return null;
  }

  let animationFrame = 0;
  let destroyed = false;
  let activeMode = 0;
  let mouseX = 0.5;
  let mouseY = 0.5;
  const startTime = performance.now();

  const isWebGL2 =
    typeof WebGL2RenderingContext !== "undefined" &&
    gl instanceof WebGL2RenderingContext;

  const vertexShaderSource = isWebGL2
    ? `#version 300 es
       in vec2 aPosition;
       out vec2 vUv;

       void main() {
         vUv = aPosition * 0.5 + 0.5;
         gl_Position = vec4(aPosition, 0.0, 1.0);
       }`
    : `attribute vec2 aPosition;
       varying vec2 vUv;

       void main() {
         vUv = aPosition * 0.5 + 0.5;
         gl_Position = vec4(aPosition, 0.0, 1.0);
       }`;

  const fragmentBody = `
    precision highp float;

    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uMode;
    uniform vec2 uMouse;

    ${isWebGL2 ? "in vec2 vUv; out vec4 outColor;" : "varying vec2 vUv;"}

    float hash21(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec2 resolution = max(uResolution, vec2(1.0));
      float aspect = resolution.x / resolution.y;

      vec2 centered = (vUv - 0.5) * vec2(aspect, 1.0);
      vec2 mouse = (uMouse - 0.5) * vec2(aspect, 1.0);

      float distanceFromMouse = distance(centered, mouse);
      float glow = exp(-distanceFromMouse * 5.0);

      vec3 color = vec3(0.015, 0.02, 0.05);

      if (uMode < 0.5) {
        float wave = sin(
          centered.x * 12.0 +
          sin(centered.y * 8.0 + uTime) * 2.0 -
          uTime * 1.5
        );

        float lines = exp(-abs(wave - centered.y * 8.0) * 3.0);

        color += vec3(0.12, 0.22, 0.65) * lines;
        color += vec3(0.18, 0.45, 1.0) * glow * 0.6;
      } else if (uMode < 1.5) {
        vec2 grid = vUv * vec2(48.0 * aspect, 48.0);
        vec2 cell = floor(grid);
        vec2 local = fract(grid) - 0.5;

        float seed = hash21(cell);
        float drift = sin(uTime * 1.3 + seed * 6.28) * 0.16;
        vec2 point = local - vec2(drift, 0.0);

        float radius = 0.08 + seed * 0.12;
        float particle = 1.0 - smoothstep(
          radius,
          radius + 0.035,
          length(point)
        );

        color += vec3(0.22, 0.35, 0.95) * particle;
        color += vec3(0.25, 0.55, 1.0) * glow * 0.45;
      
      } else if (uMode < 2.5) {
        // Existing render pipeline: animated rings
        float angle = atan(centered.y, centered.x);
        float radius = length(centered);

        float rings = abs(fract(radius * 14.0 - uTime * 0.25) - 0.5);
        float ringGlow = 1.0 - smoothstep(0.02, 0.08, rings);

        float spokes = abs(sin(angle * 12.0 + uTime * 0.2));
        float spokeGlow = 1.0 - smoothstep(0.0, 0.08, spokes);

        color += vec3(0.18, 0.3, 0.85) * ringGlow * 0.65;
        color += vec3(0.35, 0.45, 1.0) * spokeGlow * 0.22;
        color += vec3(0.2, 0.35, 1.0) * glow * 0.4;

      } else if (uMode < 3.5) {
        // New experiment: ENERGY WAVES
        for (int i = 0; i < 7; i++) {
          float layer = float(i);
          float x = centered.x * 2.4 + layer * 0.28;

          float wave =
            sin(x * 3.0 - uTime * (0.7 + layer * 0.08))
            * 0.12
            + sin(x * 5.0 + uTime * 0.55 + layer)
            * 0.045;

          float lineDistance = abs(centered.y - wave);
          float line = exp(-lineDistance * 70.0);
          float halo = exp(-lineDistance * 12.0);

          vec3 waveColor = mix(
            vec3(0.05, 0.25, 0.95),
            vec3(0.1, 0.9, 1.0),
            float(i) / 6.0
          );

          color += waveColor * line * 0.75;
          color += waveColor * halo * 0.12;
        }

        // Cursor glow and local wave disturbance
        float cursorInfluence = exp(-distanceFromMouse * 9.0);
        float cursorWave = exp(
          -abs(centered.y - sin(centered.x * 8.0 - uTime) * 0.12)
          * 22.0
        );

        color += vec3(0.1, 0.65, 1.0) * cursorInfluence * 0.75;
        color += vec3(0.15, 0.5, 1.0) * cursorWave * cursorInfluence * 0.8;

      } else {
        // New experiment: CURSOR FIELD
        float cursorInfluence = exp(-distanceFromMouse * 7.0);

        float fieldWave = sin(
          centered.x * 18.0
          + sin(centered.y * 12.0 + uTime) * 2.0
          - uTime * 1.8
        );

        float fieldLines = exp(
          -abs(fieldWave - centered.y * 12.0) * 2.5
        );

        float rippleDistance = distanceFromMouse;
        float ripple = abs(
          fract(rippleDistance * 12.0 - uTime * 0.8) - 0.5
        );

        float rippleGlow = 1.0 - smoothstep(0.02, 0.12, ripple);
        rippleGlow *= exp(-rippleDistance * 2.5);

        color += vec3(0.08, 0.2, 0.6) * fieldLines * 0.65;
        color += vec3(0.05, 0.7, 1.0) * cursorInfluence * 0.9;
        color += vec3(0.1, 0.45, 1.0) * rippleGlow * 0.8;
      }


      ${isWebGL2 ? "outColor = vec4(color, 1.0);" : "gl_FragColor = vec4(color, 1.0);"}
    }
  `;

  const fragmentShaderSource = isWebGL2
    ? `#version 300 es\n${fragmentBody}`
    : fragmentBody;

  const createShader = (type, source) => {
    const shader = gl.createShader(type);

    if (!shader) {
      throw new Error("Could not create WebGL shader.");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || "WebGL shader compilation failed.");
    }

    return shader;
  };

  let program;
  let buffer;

  try {
    const vertexShader = createShader(
      gl.VERTEX_SHADER,
      vertexShaderSource
    );

    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    program = gl.createProgram();

    if (!program) {
      throw new Error("Could not create WebGL program.");
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(
        gl.getProgramInfoLog(program) || "WebGL program linking failed."
      );
    }

    buffer = gl.createBuffer();

    if (!buffer) {
      throw new Error("Could not create WebGL buffer.");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const modeLocation = gl.getUniformLocation(program, "uMode");
    const mouseLocation = gl.getUniformLocation(program, "uMouse");

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      const width = Math.max(1, Math.round(rect.width * pixelRatio));
      const height = Math.max(1, Math.round(rect.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        mouseX = (event.clientX - rect.left) / rect.width;
        mouseY = (event.clientY - rect.top) / rect.height;
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);

    const render = (now) => {
      if (destroyed) return;

      resizeCanvas();

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (now - startTime) / 1000);
      gl.uniform1f(modeLocation, activeMode);
      gl.uniform2f(mouseLocation, mouseX, mouseY);

      gl.clearColor(0.015, 0.02, 0.05, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      animationFrame = requestAnimationFrame(render);
    };

    onStatus("WEBGL FALLBACK / LIVE");
    animationFrame = requestAnimationFrame(render);

    return {
      setMode(mode) {
        activeMode = Math.max(0, Math.min(4, Number(mode) || 0));
      },

      destroy() {
        destroyed = true;
        cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        canvas.removeEventListener("pointermove", handlePointerMove);

        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
      },
    };
  } catch (error) {
    console.error("FUTRONA WebGL fallback failed:", error);

    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);

    onStatus("WEBGL FALLBACK FAILED");
    return null;
  }
}
