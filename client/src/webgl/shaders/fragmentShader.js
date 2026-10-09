
const fragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform float u_mode;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 centered = uv - 0.5;
    vec2 mouse = u_mouse / u_resolution.xy;

    float time = u_time;
    float value = 0.0;

    if (u_mode < 0.5) {
      // MODE 1: SHADER SPACE
      float d = length(centered);

      float mouseDistance = distance(uv, mouse);

      float mouseInfluence =
        1.0 - smoothstep(0.0, 0.30, mouseDistance);

      float ringPhase = d * 55.0 - time * 2.0;

      float rings = 0.5 + 0.5 * sin(ringPhase);

      float ringLines = smoothstep(
        0.82,
        0.98,
        rings
      );

      float ringFade =
        1.0 - smoothstep(0.05, 0.72, d);

      float ripplePhase =
        mouseDistance * 45.0 - time * 2.5;

      float ripple = 0.5 + 0.5 * sin(ripplePhase);

      float pointerRings =
        smoothstep(0.88, 0.99, ripple) *
        mouseInfluence;

      value = ringLines * ringFade;
      value = max(value, pointerRings * 0.65);

    } else if (u_mode < 1.5) {
      // MODE 2: LIQUID FIELD
      float mouseDistance = distance(uv, mouse);

      float influence =
        1.0 - smoothstep(0.0, 0.65, mouseDistance);

      float distortion =
        sin(uv.x * 12.0 + time * 1.2) *
        cos(uv.y * 10.0 - time);

      float liquidWave = sin(
        length(centered) * 22.0
        + distortion * 2.0
        + influence * 5.0
        - time * 2.0
      );

      value = 0.5 + 0.5 * liquidWave;
      value *= 0.25 + 0.75 * influence;

      value += 0.15 * (
        0.5 + 0.5 * sin(distortion * 5.0 - time)
      );

    } else {
      // MODE 3: PARTICLE GRID
      vec2 grid = uv * vec2(42.0, 24.0);
      vec2 cell = fract(grid) - 0.5;
      vec2 cellId = floor(grid);

      float mouseDistance = distance(uv, mouse);
      float influence =
        1.0 - smoothstep(0.0, 0.5, mouseDistance);

      float phase = sin(
        time * 2.0 +
        cellId.x * 0.25 +
        cellId.y * 0.2
      );

      float radius = 0.055 + 0.035 * phase;
      radius += influence * 0.045;

      float dotShape = 1.0 - smoothstep(
        radius,
        radius + 0.025,
        length(cell)
      );

      value = dotShape * (0.45 + 0.55 * (0.5 + 0.5 * phase));
    }

    value = clamp(value, 0.0, 1.0);

    vec3 color = vec3(value);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default fragmentShader;
