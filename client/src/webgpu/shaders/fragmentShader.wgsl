
struct Uniforms {
  resolution: vec2<f32>,
  time: f32,
  mode: f32,
  mouse: vec2<f32>,
  padding: vec2<f32>,
};

@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

fn hash21(p: vec2<f32>) -> f32 {
  return fract(
    sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453
  );
}

@fragment
fn fragmentMain(
  @location(0) uv: vec2<f32>
) -> @location(0) vec4<f32> {
  let resolution = max(uniforms.resolution, vec2<f32>(1.0));
  let aspect = resolution.x / resolution.y;

  let centered = (uv - vec2<f32>(0.5))
    * vec2<f32>(aspect, 1.0);

  let time = uniforms.time;
  let mouse = (
    uniforms.mouse - vec2<f32>(0.5)
  ) * vec2<f32>(aspect, 1.0);

  let distanceFromMouse = distance(centered, mouse);
  let glow = exp(-distanceFromMouse * 5.0);

  var color = vec3<f32>(0.015, 0.02, 0.05);

  if (uniforms.mode < 0.5) {
    // Experiment 1: flowing wave field.
    let wave = sin(
      centered.x * 12.0
      + sin(centered.y * 8.0 + time) * 2.0
      - time * 1.5
    );

    let lines = exp(-abs(wave - centered.y * 8.0) * 3.0);

    color += vec3<f32>(0.12, 0.22, 0.65) * lines;
    color += vec3<f32>(0.18, 0.45, 1.0) * glow * 0.6;
  } else if (uniforms.mode < 1.5) {
    // Experiment 2: animated particle-like field.
    let grid = uv * vec2<f32>(48.0 * aspect, 48.0);
    let cell = floor(grid);
    let local = fract(grid) - vec2<f32>(0.5);

    let seed = hash21(cell);
    let drift = sin(time * 1.3 + seed * 6.28) * 0.16;
    let point = local - vec2<f32>(drift, 0.0);

    let radius = 0.08 + seed * 0.12;
    let particle = 1.0 - smoothstep(
      radius,
      radius + 0.035,
      length(point)
    );

    color += vec3<f32>(0.22, 0.35, 0.95) * particle;
    color += vec3<f32>(0.25, 0.55, 1.0) * glow * 0.45;
  } else {
    // Experiment 3: geometric rendering field.
    let angle = atan2(centered.y, centered.x);
    let radius = length(centered);

    let rings = abs(fract(radius * 14.0 - time * 0.25) - 0.5);
    let ringGlow = 1.0 - smoothstep(0.02, 0.08, rings);

    let spokes = abs(sin(angle * 12.0 + time * 0.2));
    let spokeGlow = 1.0 - smoothstep(0.0, 0.08, spokes);

    color += vec3<f32>(0.18, 0.3, 0.85) * ringGlow * 0.65;
    color += vec3<f32>(0.35, 0.45, 1.0) * spokeGlow * 0.22;
    color += vec3<f32>(0.2, 0.35, 1.0) * glow * 0.4;
  }

  return vec4<f32>(color, 1.0);
}
