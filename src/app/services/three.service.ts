import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({
  providedIn: 'root',
})
export class ThreeService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId: number | null = null;
  private mixers: THREE.AnimationMixer[] = [];
  private clock: THREE.Clock = new THREE.Clock();

  constructor() {}

  checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }
  

  initialize(canvas: HTMLCanvasElement): void {
    if (!this.checkWebGLSupport()) {
      console.error('WebGL is not supported in this browser.');
      return;
    }
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 5;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'lowp',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // reset clock for animations
    this.clock = new THREE.Clock();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  addPigeon(): void {
    const loader = new GLTFLoader();
    loader.load('/assets/3d/pigeon-animated/source/pigeon.glb', (gltf) => {
      const pigeon = gltf.scene;
      const mixer = new THREE.AnimationMixer(pigeon);
      const animations = gltf.animations;
      // store mixer to update in animation loop
      this.mixers.push(mixer);
      if (animations && animations.length) {
        for (let i = 0; i < animations.length; i++) {
          const action = mixer.clipAction(animations[i]);
          action.play();
          action.setLoop(THREE.LoopRepeat, Infinity);
        }
      }
      
      pigeon.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          
          // Simplificar materiais
          if (mesh.material) {
            const material = mesh.material as THREE.Material;
            
          }
          
          // Desativar sombras se existirem
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      });

      this.scene.add(pigeon);
      const animate = () => {
        this.animationId = requestAnimationFrame(animate);
        // update all mixers for animations
        const delta = this.clock.getDelta();
        this.mixers.forEach(m => m.update(delta));
        
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    });
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    // Clean up resources
    this.scene.clear();
    this.renderer.dispose();
  }
}
