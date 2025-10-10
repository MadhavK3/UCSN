// Minimal shim for three/webgpu used by three-globe during dev.
export class WebGPURenderer {
  constructor() { console.warn('three/webgpu WebGPURenderer shim used') }
}
export class StorageInstancedBufferAttribute {}
