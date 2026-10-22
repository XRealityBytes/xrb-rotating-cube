/** The visual controls for the demo live here. Distances use Three.js world units. */
export const sceneConfig = {
  cube: {
    size: 4.2,
    cornerRadius: 0.075,
    subdivisions: 18,
    color: '#82b7ca',
    metalness: 0.45,
    roughness: 0.24,
    clearcoat: 0.85,
    clearcoatRoughness: 0.18,
    iridescence: 0.22,
    environmentIntensity: 0.8,
    initialRotation: { x: 0.18, y: 0.38, z: 0.08 },
  },
  morph: {
    // One cycle moves cube -> sphere -> cube. The speed control scales this duration.
    cycleDurationSeconds: 8,
    sphereRadius: 2.1,
    colors: ['#82b7ca', '#9a7cff', '#ee6ca7', '#ff9d66', '#59ddd0'],
  },
  camera: {
    fieldOfView: 34,
    near: 0.1,
    far: 100,
    position: { x: 5.5, y: 3.8, z: 9.2 },
    target: { x: 0, y: -0.05, z: 0 },
  },
  lighting: {
    key: { color: '#e8f8ff', intensity: 4.5, position: { x: -3, y: 6, z: 5 } },
    cyan: { color: '#42e8ef', intensity: 3.5, position: { x: -5, y: 1, z: 2 } },
    violet: { color: '#ab8cff', intensity: 5, position: { x: 4, y: 3, z: -3 } },
    hemisphere: { skyColor: '#b9e2ff', groundColor: '#19152e', intensity: 0.6 },
    shadow: { opacity: 0.27, floorY: -2.05, mapSize: 1024 },
  },
  rotation: {
    // Radians per second, multiplied by the speed control.
    x: 0.17,
    y: 0.36,
    z: 0.055,
    defaultSpeed: 1,
    minSpeed: 0.25,
    maxSpeed: 2,
    speedStep: 0.25,
  },
  renderer: {
    maxPixelRatio: 2,
    exposure: 1.15,
    // Prevent a large jump when a browser resumes a throttled animation frame.
    maxFrameDeltaSeconds: 0.05,
  },
};
