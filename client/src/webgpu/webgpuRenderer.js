
import vertexShaderCode from "./shaders/vertexShader.wgsl?raw";
import fragmentShaderCode from "./shaders/fragmentShader.wgsl?raw";

export async function initWebGPURenderer(canvas, onStatus = () => {}) {
  if (!navigator.gpu) {
    onStatus("WEBGPU NOT SUPPORTED");
    return null;
  }

  let device;
  let animationFrame = 0;
  let destroyed = false;
  let activeMode = 0;
  let mouseX = 0.5;
  let mouseY = 0.5;
  let startTime = performance.now();

  try {
    onStatus("REQUESTING GPU");

    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      onStatus("GPU ADAPTER UNAVAILABLE");
      return null;
    }

    device = await adapter.requestDevice();

    const context = canvas.getContext("webgpu");

    if (!context) {
      onStatus("WEBGPU CONTEXT UNAVAILABLE");
      device.destroy();
      return null;
    }

    const format = navigator.gpu.getPreferredCanvasFormat();

    const vertexModule = device.createShaderModule({
      label: "FUTRONA Vertex Shader",
      code: vertexShaderCode,
    });

    const fragmentModule = device.createShaderModule({
      label: "FUTRONA Fragment Shader",
      code: fragmentShaderCode,
    });

    const uniformBuffer = device.createBuffer({
      label: "FUTRONA Render Uniforms",
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const pipeline = device.createRenderPipeline({
      label: "FUTRONA WebGPU Pipeline",
      layout: "auto",
      vertex: {
        module: vertexModule,
        entryPoint: "vertexMain",
      },
      fragment: {
        module: fragmentModule,
        entryPoint: "fragmentMain",
        targets: [{ format }],
      },
      primitive: {
        topology: "triangle-list",
      },
    });

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: uniformBuffer },
        },
      ],
    });

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      const width = Math.max(1, Math.round(rect.width * pixelRatio));
      const height = Math.max(1, Math.round(rect.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.configure({
        device,
        format,
        alphaMode: "opaque",
      });
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();

      mouseX = (event.clientX - rect.left) / rect.width;
      mouseY = 1 - (event.clientY - rect.top) / rect.height;
    };

    canvas.addEventListener("pointermove", handlePointerMove);

    const render = (now) => {
      if (destroyed) return;

      const elapsed = (now - startTime) / 1000;

      device.queue.writeBuffer(
        uniformBuffer,
        0,
        new Float32Array([
          canvas.width,
          canvas.height,
          elapsed,
          activeMode,
          mouseX,
          mouseY,
          0,
          0,
        ])
      );

      const encoder = device.createCommandEncoder();

      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0.02, g: 0.025, b: 0.05, a: 1 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });

      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(3);
      pass.end();

      device.queue.submit([encoder.finish()]);

      animationFrame = requestAnimationFrame(render);
    };

    onStatus("WEBGPU / LIVE");
    animationFrame = requestAnimationFrame(render);

    return {
      setMode(mode) {
        activeMode = Math.max(0, Math.min(2, Number(mode) || 0));
      },

      destroy() {
        destroyed = true;
        cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        canvas.removeEventListener("pointermove", handlePointerMove);
        context.unconfigure();
        uniformBuffer.destroy();
        device.destroy();
      },
    };
  } catch (error) {
    console.error("FUTRONA WebGPU initialization failed:", error);

    if (device) {
      device.destroy();
    }

    onStatus("WEBGPU INITIALIZATION FAILED");
    return null;
  }
}
