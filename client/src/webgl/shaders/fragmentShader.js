const fragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    vec2 centered = uv - 0.5;

    float distanceFromCenter = length(centered);

    float wave = sin(
      distanceFromCenter * 18.0 -
      u_time * 2.0
    );

    float glow = 0.5 + 0.5 * wave;

    float fade = 1.0 - smoothstep(
      0.0,
      0.75,
      distanceFromCenter
    );

    float value = glow * fade;

    vec3 color = vec3(value);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default fragmentShader;