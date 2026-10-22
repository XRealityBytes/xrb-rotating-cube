import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferAttribute,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { sceneConfig as config } from './config';

export interface CubeScene {
  setPlaying(playing: boolean): void;
  setSpeed(multiplier: number): void;
  reset(): void;
  dispose(): void;
}

interface CubeSceneOptions {
  playing: boolean;
  onContextLost(): void;
  onContextRestored(): void;
}

/** Owns all rendering resources. UI state stays in main.ts. */
export function createCubeScene(
  canvas: HTMLCanvasElement,
  viewport: HTMLElement,
  options: CubeSceneOptions,
): CubeScene {
  const context = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });

  if (!context) {
    throw new Error('WebGL 2 is unavailable in this browser.');
  }

  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = config.renderer.exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const camera = new PerspectiveCamera(
    config.camera.fieldOfView,
    1,
    config.camera.near,
    config.camera.far,
  );
  const baseCameraPosition = new Vector3(
    config.camera.position.x,
    config.camera.position.y,
    config.camera.position.z,
  );
  const cameraTarget = new Vector3(
    config.camera.target.x,
    config.camera.target.y,
    config.camera.target.z,
  );

  // Generate studio reflections locally, with no image downloads or external services.
  function createEnvironment() {
    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    const target = pmrem.fromScene(room, 0.04);
    room.dispose();
    pmrem.dispose();
    return target;
  }
  let environmentTarget = createEnvironment();
  scene.environment = environmentTarget.texture;

  const geometry = new BoxGeometry(
    config.cube.size,
    config.cube.size,
    config.cube.size,
    config.cube.subdivisions,
    config.cube.subdivisions,
    config.cube.subdivisions,
  );
  const cubePositions = geometry.getAttribute('position');
  const cubeNormals = geometry.getAttribute('normal');
  if (!(cubePositions instanceof BufferAttribute) || !(cubeNormals instanceof BufferAttribute)) {
    throw new Error('The shape geometry requires editable position and normal buffers.');
  }
  const surfaceVertex = new Vector3();
  const roundedCenter = new Vector3();
  const surfaceNormal = new Vector3();
  const innerHalfSize = config.cube.size / 2 - config.cube.cornerRadius;

  for (let index = 0; index < cubePositions.count; index += 1) {
    surfaceVertex.fromBufferAttribute(cubePositions, index);
    roundedCenter.copy(surfaceVertex).clampScalar(-innerHalfSize, innerHalfSize);
    surfaceNormal.copy(surfaceVertex).sub(roundedCenter).normalize();
    surfaceVertex.copy(roundedCenter).addScaledVector(surfaceNormal, config.cube.cornerRadius);
    cubePositions.setXYZ(index, surfaceVertex.x, surfaceVertex.y, surfaceVertex.z);
    cubeNormals.setXYZ(index, surfaceNormal.x, surfaceNormal.y, surfaceNormal.z);
  }

  const basePositions = Float32Array.from(cubePositions.array);
  const baseNormals = Float32Array.from(cubeNormals.array);
  const spherePositions = new Float32Array(cubePositions.count * 3);
  const sphereNormals = new Float32Array(cubePositions.count * 3);
  const sphereVertex = new Vector3();

  cubePositions.setUsage(DynamicDrawUsage);
  cubeNormals.setUsage(DynamicDrawUsage);

  for (let index = 0; index < cubePositions.count; index += 1) {
    sphereVertex.fromBufferAttribute(cubePositions, index).normalize();
    const offset = index * 3;
    sphereNormals[offset] = sphereVertex.x;
    sphereNormals[offset + 1] = sphereVertex.y;
    sphereNormals[offset + 2] = sphereVertex.z;
    spherePositions[offset] = sphereVertex.x * config.morph.sphereRadius;
    spherePositions[offset + 1] = sphereVertex.y * config.morph.sphereRadius;
    spherePositions[offset + 2] = sphereVertex.z * config.morph.sphereRadius;
  }

  const material = new MeshPhysicalMaterial({
    color: config.cube.color,
    metalness: config.cube.metalness,
    roughness: config.cube.roughness,
    clearcoat: config.cube.clearcoat,
    clearcoatRoughness: config.cube.clearcoatRoughness,
    iridescence: config.cube.iridescence,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [180, 420],
    envMapIntensity: config.cube.environmentIntensity,
  });
  const cube = new Mesh(geometry, material);
  const morphColors = config.morph.colors.map((color) => new Color(color));
  const currentColor = new Color();
  cube.castShadow = true;
  cube.rotation.set(
    config.cube.initialRotation.x,
    config.cube.initialRotation.y,
    config.cube.initialRotation.z,
  );
  scene.add(cube);

  const { hemisphere } = config.lighting;
  scene.add(new HemisphereLight(hemisphere.skyColor, hemisphere.groundColor, hemisphere.intensity));

  const lights = [config.lighting.key, config.lighting.cyan, config.lighting.violet].map(
    (lightConfig, index) => {
      const light = new DirectionalLight(lightConfig.color, lightConfig.intensity);
      light.position.set(lightConfig.position.x, lightConfig.position.y, lightConfig.position.z);
      if (index === 0) {
        light.castShadow = true;
        light.shadow.mapSize.set(config.lighting.shadow.mapSize, config.lighting.shadow.mapSize);
        light.shadow.camera.left = -4;
        light.shadow.camera.right = 4;
        light.shadow.camera.top = 4;
        light.shadow.camera.bottom = -4;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 20;
        light.shadow.normalBias = 0.025;
      }
      scene.add(light);
      return light;
    },
  );

  const floorGeometry = new PlaneGeometry(30, 30);
  const floorMaterial = new ShadowMaterial({ opacity: config.lighting.shadow.opacity });
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = config.lighting.shadow.floorY;
  floor.receiveShadow = true;
  scene.add(floor);

  let playing = options.playing;
  let speed = config.rotation.defaultSpeed;
  let frameId: number | null = null;
  let lastTime: number | null = null;
  let disposed = false;
  let contextLost = false;
  let animationElapsed = 0;

  function updateMorph(): void {
    const cycleProgress =
      (animationElapsed % config.morph.cycleDurationSeconds) / config.morph.cycleDurationSeconds;
    // Cosine easing arrives at both shapes with zero velocity before reversing direction.
    const morphAmount = 0.5 - 0.5 * Math.cos(cycleProgress * Math.PI * 2);

    for (let offset = 0; offset < basePositions.length; offset += 1) {
      const basePosition = basePositions[offset] ?? 0;
      const spherePosition = spherePositions[offset] ?? 0;
      const baseNormal = baseNormals[offset] ?? 0;
      const sphereNormal = sphereNormals[offset] ?? 0;
      cubePositions.array[offset] = basePosition + (spherePosition - basePosition) * morphAmount;
      cubeNormals.array[offset] = baseNormal + (sphereNormal - baseNormal) * morphAmount;
    }
    cubePositions.needsUpdate = true;
    cubeNormals.needsUpdate = true;

    const colorProgress = cycleProgress * morphColors.length;
    const colorIndex = Math.floor(colorProgress) % morphColors.length;
    const nextColorIndex = (colorIndex + 1) % morphColors.length;
    const color = morphColors[colorIndex];
    const nextColor = morphColors[nextColorIndex];
    if (!color || !nextColor) return;
    currentColor.lerpColors(color, nextColor, colorProgress - Math.floor(colorProgress));
    material.color.copy(currentColor);
  }

  function requestFrame(): void {
    if (frameId === null && !disposed && !contextLost && !document.hidden) {
      frameId = window.requestAnimationFrame(renderFrame);
    }
  }

  function renderFrame(time: number): void {
    frameId = null;
    if (disposed || contextLost || document.hidden) return;

    if (playing && lastTime !== null) {
      const delta = Math.min((time - lastTime) / 1000, config.renderer.maxFrameDeltaSeconds);
      // Delta time keeps angular velocity consistent across display refresh rates.
      cube.rotation.x += config.rotation.x * speed * delta;
      cube.rotation.y += config.rotation.y * speed * delta;
      cube.rotation.z += config.rotation.z * speed * delta;
      animationElapsed += delta * speed;
      updateMorph();
    }
    lastTime = time;
    renderer.render(scene, camera);
    if (playing) requestFrame();
  }

  function stopPendingFrame(): void {
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    frameId = null;
    lastTime = null;
  }

  function resize(): void {
    if (disposed || contextLost) return;
    const width = Math.max(1, viewport.clientWidth);
    const height = Math.max(1, viewport.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, config.renderer.maxPixelRatio));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the whole cube visible when the viewport becomes a narrow portrait shape.
    camera.position.copy(baseCameraPosition).multiplyScalar(Math.max(1, 0.9 / camera.aspect));
    camera.lookAt(cameraTarget);
    camera.updateProjectionMatrix();
    requestFrame();
  }

  function handleVisibilityChange(): void {
    stopPendingFrame();
    if (!document.hidden) requestFrame();
  }

  function handleContextLost(event: Event): void {
    event.preventDefault();
    contextLost = true;
    stopPendingFrame();
    options.onContextLost();
  }

  function handleContextRestored(): void {
    contextLost = false;
    lastTime = null;
    // Render-target contents do not survive context loss; regenerate the studio
    // map after Three.js has restored the renderer's internal WebGL state.
    environmentTarget.dispose();
    environmentTarget = createEnvironment();
    scene.environment = environmentTarget.texture;
    options.onContextRestored();
    resize();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewport);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  canvas.addEventListener('webglcontextlost', handleContextLost);
  canvas.addEventListener('webglcontextrestored', handleContextRestored);
  resize();

  return {
    setPlaying(nextPlaying) {
      playing = nextPlaying;
      lastTime = null;
      requestFrame();
    },
    setSpeed(multiplier) {
      if (!Number.isFinite(multiplier)) return;
      speed = Math.min(config.rotation.maxSpeed, Math.max(config.rotation.minSpeed, multiplier));
      requestFrame();
    },
    reset() {
      cube.rotation.set(
        config.cube.initialRotation.x,
        config.cube.initialRotation.y,
        config.cube.initialRotation.z,
      );
      animationElapsed = 0;
      updateMorph();
      lastTime = null;
      requestFrame();
    },
    dispose() {
      disposed = true;
      stopPendingFrame();
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      geometry.dispose();
      material.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      environmentTarget.dispose();
      for (const light of lights) light.shadow.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      scene.clear();
    },
  };
}
