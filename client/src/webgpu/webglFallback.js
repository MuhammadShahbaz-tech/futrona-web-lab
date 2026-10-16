
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

    // Mandelbulb distance estimator
          float fractalDE(vec3 p) {
              vec3 z = p;
              float dr = 1.0;
              float r = 0.0;

              for (int i = 0; i < 7; i++) {
                  r = length(z);

                  if (r > 4.0) break;

                  float theta = acos(
                      clamp(z.z / max(r, 0.0001), -1.0, 1.0)
                  );

                  float phi = atan(z.y, z.x);

                  float power = 7.0;

                  dr = pow(max(r, 0.0001), power - 1.0)
                      * power * dr + 1.0;

                  float zr = pow(max(r, 0.0001), power);

                  theta *= power;
                  phi *= power;

                  z = zr * vec3(
                      sin(theta) * cos(phi),
                      sin(theta) * sin(phi),
                      cos(theta)
                  );

                  z += p;
              }

              return 0.5 * log(max(r, 0.0001))
                  * r / max(dr, 0.0001);
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

      } else if (uMode < 5.5){
        
        // 05 — PARTICLE VORTEX

        vec2 vortexCenter = mouse;
        vec2 delta = centered - vortexCenter;

        float radius = length(delta);
        float angle = atan(delta.y, delta.x);

        // Swirling motion around the cursor
        float swirl = angle
            - uTime * 1.2
            - 1.8 / (radius + 0.15);

        // Multiple spiral arms
        float spiralPattern = sin(
            swirl * 5.0
            + radius * 24.0
            - uTime * 0.8
        );

        float spiral = exp(-abs(spiralPattern) * 5.0);
        spiral *= exp(-radius * 1.4);

        // Procedural particle grid
        vec2 grid = centered * 42.0;
        vec2 cell = floor(grid);
        vec2 local = fract(grid) - 0.5;

        float seed = hash21(cell);
        float particleAngle = seed * 6.2831853;

        float particleRadius = length(local);
        float particleDrift = uTime * (0.5 + seed);

        vec2 particleOffset = vec2(
            cos(particleAngle + particleDrift),
            sin(particleAngle + particleDrift)
        ) * 0.18;

        vec2 particlePos = local - particleOffset;

        float particleSize = 0.045 + seed * 0.07;

        float particle = 1.0 - smoothstep(
            particleSize,
            particleSize + 0.025,
            length(particlePos)
        );

        // Brightness fades toward the outer edges
        float particleFade = exp(-radius * 1.5);

        // Glowing vortex core
        float core = exp(-radius * 20.0);
        float halo = exp(-radius * 5.0);

        // Cursor interaction
        float cursorGlow = exp(-length(delta) * 8.0);

        color += vec3(0.04, 0.12, 0.4)
            * spiral * 0.55;

        color += vec3(0.08, 0.4, 1.0)
            * spiral * 0.65;

        color += vec3(0.15, 0.65, 1.0)
            * particle * particleFade * 1.2;

        color += vec3(0.05, 0.45, 1.0)
            * halo * 0.65;

        color += vec3(0.4, 0.9, 1.0)
            * core;

        color += vec3(0.1, 0.5, 1.0)
            * cursorGlow * 0.25;
}

      //  }  else if (uMode < 5.5) {
      //   // 06 — PLASMA FIELD

      //   // Animated coordinates
      //   vec2 plasmaUV = centered * 3.0;

      //   float time = uTime * 0.45;

      //   // Layered flowing plasma patterns
      //   float plasmaA = sin(
      //     plasmaUV.x * 2.2
      //     + sin(plasmaUV.y * 1.8 + time) * 1.5
      //     - time
      //   );

      //   float plasmaB = sin(
      //     plasmaUV.y * 2.8
      //     - sin(plasmaUV.x * 1.6 - time * 1.2) * 1.4
      //     + time * 0.7
      //   );

      //   float plasmaC = sin(
      //     (plasmaUV.x + plasmaUV.y) * 1.8
      //     + time
      //   );

      //   // Combine the plasma layers
      //   float plasmaPattern =
      //     (plasmaA + plasmaB + plasmaC) / 3.0;

      //   // Bright filaments and soft surrounding glow
      //   float plasmaFilament = exp(
      //     -abs(plasmaPattern) * 5.0
      //   );

      //   float plasmaGlow = exp(
      //     -abs(plasmaPattern) * 1.5
      //   );

      //   // Blue-to-cyan color transition
      //   float colorMix = smoothstep(
      //     -0.65,
      //     0.65,
      //     plasmaPattern
      //   );

      //   vec3 plasmaColor = mix(
      //     vec3(0.025, 0.08, 0.45),
      //     vec3(0.05, 0.85, 1.0),
      //     colorMix
      //   );

      //   // Cursor interaction
      //   float plasmaCursor = exp(
      //     -distanceFromMouse * 4.5
      //   );

      //   // Add the plasma light
      //   color += plasmaColor
      //     * plasmaFilament * 0.85;

      //   color += plasmaColor
      //     * plasmaGlow * 0.18;

      //   color += vec3(0.08, 0.45, 1.0)
      //     * plasmaCursor * 0.35;
      // } else if (uMode < 5.5) {
       
      //   // 07 — ELECTRIC LIGHTNING

      //   vec2 lightningUV = centered;
      //   float lightningTime = uTime * 1.4;

      //   // Main branching lightning path
      //   float mainPath =
      //     sin(lightningUV.x * 8.0 + lightningTime) * 0.12
      //     + sin(lightningUV.x * 19.0 - lightningTime * 1.7) * 0.045
      //     + sin(lightningUV.x * 37.0 + lightningTime * 0.8) * 0.018;

      //   float mainDistance = abs(lightningUV.y - mainPath);
      //   float mainBolt = exp(-mainDistance * 95.0);
      //   float mainGlow = exp(-mainDistance * 18.0);

      //   // Secondary electric branches
      //   float branchAPath =
      //     mainPath
      //     + sin(lightningUV.x * 15.0 + lightningTime * 1.8) * 0.16;

      //   float branchADistance = abs(lightningUV.y - branchAPath);
      //   float branchA = exp(-branchADistance * 75.0)
      //     * smoothstep(-0.8, 0.2, lightningUV.x)
      //     * (1.0 - smoothstep(0.15, 0.8, lightningUV.x));

      //   float branchBPath =
      //     mainPath
      //     - sin(lightningUV.x * 12.0 - lightningTime) * 0.13;

      //   float branchBDistance = abs(lightningUV.y - branchBPath);
      //   float branchB = exp(-branchBDistance * 85.0)
      //     * smoothstep(-0.7, 0.1, lightningUV.x)
      //     * (1.0 - smoothstep(0.25, 0.85, lightningUV.x));

      //   // Electric flicker
      //   float flicker = 0.72 + 0.28 * sin(uTime * 17.0);
      //   float flash = 0.85 + 0.15 * sin(uTime * 31.0);

      //   // Mouse-generated electric glow
      //   float mouseDistance = distance(centered, mouse);
      //   float electricAura = exp(-mouseDistance * 5.0);

      //   // Layered blue and cyan electricity
      //   color += vec3(0.025, 0.12, 0.8)
      //     * mainGlow * flicker * 0.8;

      //   color += vec3(0.05, 0.45, 1.0)
      //     * (mainGlow + branchA * 0.4 + branchB * 0.4) * 0.55;

      //   color += vec3(0.45, 0.85, 1.0)
      //     * (mainBolt + branchA * 0.65 + branchB * 0.65)
      //     * flicker;

      //   color += vec3(0.8, 0.95, 1.0)
      //     * mainBolt * flash;

      //   color += vec3(0.08, 0.45, 1.0)
      //     * electricAura * 0.35;

      //  }
    // } else if (uMode < 6.5) {
    
    //     // 11 — NEURAL WORMHOLE

    //     // Center coordinates around the mouse-reactive portal
    //     vec2 wormholeUV = centered;
    //     vec2 portalDelta = wormholeUV - mouse;

    //     float portalRadius = length(portalDelta);
    //     float portalAngle = atan(portalDelta.y, portalDelta.x);

    //     float time = uTime * 0.45;

    //     // Twist space around the wormhole
    //     float safeRadius = max(portalRadius, 0.08);
    //     float twist = 0.8 / safeRadius;

    //     vec2 twistedUV = vec2(
    //       cos(twist) * portalDelta.x - sin(twist) * portalDelta.y,
    //       sin(twist) * portalDelta.x + cos(twist) * portalDelta.y
    //     );

    //     // Polar tunnel coordinates
    //     float radius = max(length(twistedUV), 0.025);
    //     float tunnelDepth = 1.0 / radius;
    //     float tunnelAngle = atan(twistedUV.y, twistedUV.x);

    //     // Animated wireframe grid
    //     float radialGrid = abs(
    //       fract(tunnelDepth * 0.32 - time * 0.65) - 0.5
    //     );

    //     float radialLines = 1.0 - smoothstep(
    //       0.035, 0.12, radialGrid
    //     );

    //     float angularGrid = abs(
    //       sin(tunnelAngle * 18.0 + time * 0.8)
    //     );

    //     float angularLines = 1.0 - smoothstep(
    //       0.0, 0.12, angularGrid
    //     );

    //     // Perspective wireframe intensity
    //     float wireframe = max(
    //       radialLines,
    //       angularLines * 0.7
    //     );

    //     float depthFade = exp(-radius * 1.8);
    //     float tunnelGlow = exp(-portalRadius * 3.0);

    //     // Animated energy flowing through the tunnel
    //     float energyFlow = 0.5 + 0.5 * sin(
    //       tunnelDepth * 1.8 - time * 4.0
    //       + sin(tunnelAngle * 3.0) * 1.2
    //     );

    //     // Mouse-reactive ripple
    //     float ripple = sin(
    //       portalRadius * 32.0 - uTime * 5.0
    //     );

    //     float rippleGlow = exp(-portalRadius * 4.0)
    //       * (0.5 + 0.5 * ripple);

    //     // Layered futuristic colors
    //     vec3 wormholeColor = mix(
    //       vec3(0.015, 0.035, 0.16),
    //       vec3(0.02, 0.8, 1.0),
    //       clamp(wireframe * depthFade, 0.0, 1.0)
    //     );

    //     color += wormholeColor
    //       * wireframe * depthFade * 1.4;

    //     color += vec3(0.08, 0.3, 1.0)
    //       * wireframe * energyFlow * depthFade * 0.65;

    //     color += vec3(0.05, 0.65, 1.0)
    //       * tunnelGlow * 0.18;

    //     color += vec3(0.15, 0.8, 1.0)
    //       * rippleGlow * 0.45;

    //     // Bright central portal core
    //     float portalCore = exp(-portalRadius * 16.0);

    //     color += vec3(0.12, 0.4, 1.0)
    //       * portalCore * 0.75;


      //  } else if (uMode < 7.5) {

      // //  15 — CYBERNETIC WAVE SURFACE

      //   vec2 cyberUV = centered;
      //   float cyberTime = uTime * 0.65;

      //   // Mouse interaction
      //   vec2 cyberDelta = cyberUV - mouse;
      //   float cyberDistance = length(cyberDelta);
      //   float cyberInfluence = exp(-cyberDistance * 3.5);

      //   // Layered surface waves
      //   float waveA = sin(cyberUV.x * 5.0 + cyberTime);
      //   float waveB = cos(cyberUV.y * 7.0 - cyberTime * 0.8);
      //   float waveC = sin(
      //       (cyberUV.x + cyberUV.y) * 9.0 - cyberTime * 1.4
      //   );
      //   float waveD = cos(
      //       length(cyberUV - mouse) * 12.0 - cyberTime * 2.5
      //   );

      //   float surfaceHeight =
      //       waveA * 0.13 +
      //       waveB * 0.10 +
      //       waveC * 0.055 +
      //       waveD * cyberInfluence * 0.16;

      //   // Simulated perspective
      //   float perspective = 1.0 / (
      //       1.25 + max(cyberUV.y + 0.8, 0.0) * 0.7
      //   );

      //   vec2 surfaceUV = vec2(
      //       cyberUV.x * perspective,
      //       (cyberUV.y + surfaceHeight * 1.6) * perspective
      //   );

      //   // Wireframe grid
      //   float gridScale = 32.0;

      //   vec2 gridUV = surfaceUV * gridScale;

      //   float gridX = abs(fract(gridUV.x) - 0.5);
      //   float gridY = abs(fract(gridUV.y) - 0.5);

      //   float lineX = 1.0 - smoothstep(0.035, 0.09, gridX);
      //   float lineY = 1.0 - smoothstep(0.035, 0.09, gridY);

      //   float wireframe = max(lineX, lineY);

      //   // Glowing energy ridges
      //   float ridgePattern = sin(
      //       surfaceHeight * 38.0 -
      //       cyberTime * 2.0
      //   );

      //   float ridges = exp(-abs(ridgePattern) * 5.0);

      //   // Wave crest highlights
      //   float crest = smoothstep(
      //       0.10,
      //       0.22,
      //       surfaceHeight
      //   );

      //   // Distance-based depth fade
      //   float depthFade = exp(-abs(cyberUV.y + 0.15) * 0.65);

      //   // Neon palette
      //   vec3 deepSpace = vec3(0.005, 0.012, 0.045);
      //   vec3 blueEnergy = vec3(0.015, 0.12, 0.65);
      //   vec3 cyanEnergy = vec3(0.0, 0.85, 1.0);

      //   float heightMix = clamp(
      //       0.45 + surfaceHeight * 2.2,
      //       0.0,
      //       1.0
      //   );

      //   vec3 surfaceColor = mix(
      //       deepSpace,
      //       blueEnergy,
      //       heightMix
      //   );

      //   surfaceColor = mix(
      //       surfaceColor,
      //       cyanEnergy,
      //       clamp(ridges * 0.65 + crest * 0.3, 0.0, 1.0)
      //   );

      //   // Compose the holographic surface
      //   color += surfaceColor * wireframe * depthFade * 1.5;

      //   color += cyanEnergy
      //       * ridges
      //       * wireframe
      //       * depthFade
      //       * 0.35;

      //   // Cursor energy pulse
      //   color += cyanEnergy
      //       * cyberInfluence
      //       * (0.2 + abs(waveD) * 0.45);

      //   // Ambient surface glow
      //   color += blueEnergy
      //       * exp(-abs(surfaceHeight) * 8.0)
      //       * depthFade
      //       * 0.12;
      //     }
      
      //   } else if (uMode < 6.5) {
      //  // 21 — FRACTAL DIMENSION

      //     vec2 uv = centered * 1.4;
      //     float t = uTime * 0.22;

      //     // Camera setup
      //     vec3 ro = vec3(
      //         0.0,
      //         0.0,
      //         -4.2
      //     );

      //     vec3 rd = normalize(
      //         vec3(uv, 1.7)
      //     );

      //     // Mouse-controlled camera rotation
      //     float mouseX = (uMouse.x - 0.5) * 1.2;
      //     float mouseY = (uMouse.y - 0.5) * 1.2;

      //     float ax = t + mouseY;
      //     float ay = t * 0.7 + mouseX;

      //     mat2 rotX = mat2(
      //         cos(ax), -sin(ax),
      //         sin(ax),  cos(ax)
      //     );

      //     mat2 rotY = mat2(
      //         cos(ay), -sin(ay),
      //         sin(ay),  cos(ay)
      //     );

      //     ro.xy *= rotY;
      //     ro.yz *= rotX;

      //     rd.xy *= rotY;
      //     rd.yz *= rotX;          

      //     // Ray marching
      //     float distanceTravelled = 0.0;
      //     float hit = 0.0;
      //     vec3 hitPosition = vec3(0.0);

      //     for (int i = 0; i < 72; i++) {
      //         vec3 p = ro + rd * distanceTravelled;

      //         float d = fractalDE(p);

      //         if (d < 0.0015) {
      //             hit = 1.0;
      //             hitPosition = p;
      //             break;
      //         }

      //         distanceTravelled += d * 0.8;

      //         if (distanceTravelled > 9.0) break;
      //     }

      //     // Neon fractal shading
      //     if (hit > 0.5) {
      //         vec2 e = vec2(0.001, 0.0);

      //         float dx = fractalDE(hitPosition + e.xyy)
      //             - fractalDE(hitPosition - e.xyy);

      //         float dy = fractalDE(hitPosition + e.yxy)
      //             - fractalDE(hitPosition - e.yxy);

      //         float dz = fractalDE(hitPosition + e.yyx)
      //             - fractalDE(hitPosition - e.yyx);

      //         vec3 normal = normalize(vec3(dx, dy, dz));

      //         vec3 lightDir = normalize(
      //             vec3(-0.5, 0.8, -0.7)
      //         );

      //         float diffuse = max(
      //             dot(normal, lightDir),
      //             0.0
      //         );

      //         float edgeGlow = pow(
      //             1.0 - max(dot(normal, -rd), 0.0),
      //             2.5
      //         );

      //         float detail = 0.5 + 0.5 * sin(
      //             length(hitPosition) * 18.0
      //             + atan(hitPosition.y, hitPosition.x) * 5.0
      //         );

      //         vec3 violet = vec3(0.35, 0.04, 0.95);
      //         vec3 cyan = vec3(0.0, 0.8, 1.0);

      //         vec3 fractalColor = mix(
      //             violet,
      //             cyan,
      //             detail
      //         );

      //         fractalColor *= exp(-distanceTravelled * 0.08);

      //         color += fractalColor * (
      //             0.2 + diffuse * 0.8
      //         );

      //         color += cyan * edgeGlow * 0.9;
      //     }

      //     // Ambient cosmic glow
      //     float glow = exp(-length(uv) * 1.8);

      //     color += vec3(0.08, 0.025, 0.25) * glow * 0.2;
      //  }
 

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
