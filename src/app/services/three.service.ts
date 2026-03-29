import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface FloatingObjectState {
  object: THREE.Object3D;
  targetOffsetX: number;
  targetOffsetY: number;
  targetOffsetZ: number;
  riseDuration: number;
  riseDelay: number;
  hoverAmpX: number;
  hoverAmpY: number;
  hoverAmpZ: number;
  hoverSpeed: number;
  phase: number;
  spinX: number;
  spinY: number;
}

@Injectable({
  providedIn: 'root',
})
export class ThreeService {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private animationId: number | null = null;
  private resizeHandler: (() => void) | null = null;
  private mixers: THREE.AnimationMixer[] = [];
  private floatingObjects: FloatingObjectState[] = [];
  private dynamicObjects: THREE.Object3D[] = [];
  private clock = new THREE.Clock();
  private readonly anchor = new THREE.Vector3(0, 0.08, -2.25);
  private readonly riseStartOffset = new THREE.Vector3(0, -2.4, 0.35);
  private readonly loader = new GLTFLoader();

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
    if (this.renderer !== null) {
      this.dispose();
    }

    if (!this.checkWebGLSupport()) {
      console.error('WebGL is not supported in this browser.');
      return;
    }

    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 1000);
    this.camera.position.set(0, 0.2, 6.2);
    this.camera.lookAt(0, 0.08, -2.2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.25);
    directionalLight.position.set(5, 6, 4);
    this.scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x8ba4ff, 0.48);
    fillLight.position.set(-3.5, -1, 2.5);
    this.scene.add(fillLight);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'lowp',
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.clock = new THREE.Clock();
    this.onWindowResize();

    this.resizeHandler = () => this.onWindowResize();
    window.addEventListener('resize', this.resizeHandler);
    this.startAnimationLoop();
  }

  buildHeroScene(): void {
    if (!this.scene) {
      return;
    }

    this.clearDynamicObjects();
    this.addTechObjects();
    this.addPigeonCompanion();
  }

  private addTechObjects(): void {
    const torus = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.36, 0.11, 120, 18),
      new THREE.MeshStandardMaterial({ color: 0x34373d, metalness: 0.65, roughness: 0.24 })
    );
    this.registerFloatingObject(torus, {
      targetOffsetX: -1.95,
      targetOffsetY: 0.34,
      targetOffsetZ: 0.1,
      riseDuration: 1.85,
      riseDelay: 0,
      hoverAmpX: 0.08,
      hoverAmpY: 0.13,
      hoverAmpZ: 0.07,
      hoverSpeed: 0.82,
      phase: 0.2,
      spinX: 0.24,
      spinY: 0.5,
    });

    const chip = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.54, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x22252b, metalness: 0.42, roughness: 0.26 })
    );
    this.registerFloatingObject(chip, {
      targetOffsetX: 1.36,
      targetOffsetY: 0.2,
      targetOffsetZ: 0.16,
      riseDuration: 1.95,
      riseDelay: 0.08,
      hoverAmpX: 0.06,
      hoverAmpY: 0.11,
      hoverAmpZ: 0.05,
      hoverSpeed: 0.74,
      phase: 2.1,
      spinX: 0.17,
      spinY: 0.38,
    });

    const cloud = this.createCloudMesh();
    this.registerFloatingObject(cloud, {
      targetOffsetX: -1.7,
      targetOffsetY: 2,
      targetOffsetZ: -0.04,
      riseDuration: 2.1,
      riseDelay: 0.16,
      hoverAmpX: 0.05,
      hoverAmpY: 0.12,
      hoverAmpZ: 0.05,
      hoverSpeed: 0.66,
      phase: 4.3,
      spinX: 0.1,
      spinY: 0.24,
    });

    const codeBadge = this.createTechBadge('</>', '#3f434a');
    this.registerFloatingObject(codeBadge, {
      targetOffsetX: 2.62,
      targetOffsetY: 0.04,
      targetOffsetZ: -0.06,
      riseDuration: 1.78,
      riseDelay: 0.02,
      hoverAmpX: 0.07,
      hoverAmpY: 0.09,
      hoverAmpZ: 0.05,
      hoverSpeed: 0.8,
      phase: 5.4,
      spinX: 0.08,
      spinY: 0.34,
    });

    const cpuBadge = this.createTechBadge('CPU', '#555d69');
    this.registerFloatingObject(cpuBadge, {
      targetOffsetX: -0.68,
      targetOffsetY: -0.02,
      targetOffsetZ: -0.08,
      riseDuration: 2.05,
      riseDelay: 0.14,
      hoverAmpX: 0.06,
      hoverAmpY: 0.1,
      hoverAmpZ: 0.04,
      hoverSpeed: 0.72,
      phase: 1.34,
      spinX: 0.12,
      spinY: 0.26,
    });

    const cloudBadge = this.createTechBadge('CLOUD', '#2f3440');
    this.registerFloatingObject(cloudBadge, {
      targetOffsetX: 0.04,
      targetOffsetY: 2.8,
      targetOffsetZ: -0.02,
      riseDuration: 1.92,
      riseDelay: 0.1,
      hoverAmpX: 0.05,
      hoverAmpY: 0.08,
      hoverAmpZ: 0.04,
      hoverSpeed: 0.7,
      phase: 2.94,
      spinX: 0.08,
      spinY: 0.22,
    });
  }

  private addPigeonCompanion(): void {
    if (!this.scene) {
      return;
    }

    const activeScene = this.scene;

    this.loader.load('/assets/3d/pigeon-animated/source/pigeon.glb', (gltf) => {
      if (!this.scene || this.scene !== activeScene) {
        return;
      }

      const root = new THREE.Group();
      const pigeon = gltf.scene;
      pigeon.scale.set(2.5, 2.5, 2.5);
      pigeon.rotation.y = Math.PI * 0.18;
      root.add(pigeon);

      const mixer = new THREE.AnimationMixer(pigeon);
      for (const clip of gltf.animations) {
        mixer.clipAction(clip).play();
      }

      this.mixers.push(mixer);
      this.registerFloatingObject(root, {
        targetOffsetX: 1.7,
        targetOffsetY: 1.3,
        targetOffsetZ: 0.22,
        riseDuration: 2.15,
        riseDelay: 0.24,
        hoverAmpX: 0.05,
        hoverAmpY: 0.1,
        hoverAmpZ: 0.05,
        hoverSpeed: 0.6,
        phase: 3.95,
        spinX: 0.03,
        spinY: 0.12,
      });
    });
  }

  private registerFloatingObject(object: THREE.Object3D, state: Omit<FloatingObjectState, 'object'>): void {
    if (!this.scene) {
      return;
    }

    this.floatingObjects.push({ object, ...state });
    this.dynamicObjects.push(object);
    this.scene.add(object);
  }

  private createTechBadge(label: string, color: string): THREE.Mesh {
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 256;
    badgeCanvas.height = 128;

    const ctx = badgeCanvas.getContext('2d');
    if (!ctx) {
      return new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 0.45),
        new THREE.MeshBasicMaterial({ color: 0x3b3f45, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
      );
    }

    ctx.clearRect(0, 0, badgeCanvas.width, badgeCanvas.height);
    this.drawRoundedRect(ctx, 16, 16, badgeCanvas.width - 32, badgeCanvas.height - 32, 26, color);
    ctx.fillStyle = '#f2f2f2';
    ctx.font = '700 42px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, badgeCanvas.width / 2, badgeCanvas.height / 2 + 2);

    const texture = new THREE.CanvasTexture(badgeCanvas);
    texture.anisotropy = 4;

    return new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 0.58),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, opacity: 0.92 })
    );
  }

  private createCloudMesh(): THREE.Group {
    const cloud = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: 0x606975,
      roughness: 0.45,
      metalness: 0.2,
    });

    const spheres = [
      { size: 0.32, x: -0.2, y: 0, z: 0 },
      { size: 0.38, x: 0.07, y: 0.08, z: 0 },
      { size: 0.3, x: 0.33, y: -0.02, z: 0 },
      { size: 0.28, x: 0.06, y: -0.14, z: 0.15 },
    ];

    for (const sphereConfig of spheres) {
      const cloudNode = new THREE.Mesh(
        new THREE.SphereGeometry(sphereConfig.size, 24, 24),
        material
      );
      cloudNode.position.set(sphereConfig.x, sphereConfig.y, sphereConfig.z);
      cloud.add(cloudNode);
    }

    return cloud;
  }

  private drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillStyle: string
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  private startAnimationLoop(): void {
    if (this.animationId !== null) {
      return;
    }

    const animate = () => {
      this.animationId = requestAnimationFrame(animate);

      if (!this.scene || !this.camera || !this.renderer) {
        return;
      }

      const delta = this.clock.getDelta();
      const elapsed = this.clock.elapsedTime;

      for (const mixer of this.mixers) {
        mixer.update(delta);
      }

      this.updateFloatingObjects(elapsed, delta);
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  private updateFloatingObjects(elapsed: number, delta: number): void {
    for (const state of this.floatingObjects) {
      const riseClock = Math.max(0, elapsed - state.riseDelay);
      const riseProgressRaw = Math.min(riseClock / state.riseDuration, 1);
      const riseProgress = 1 - Math.pow(1 - riseProgressRaw, 3);

      const startX = this.anchor.x + this.riseStartOffset.x;
      const startY = this.anchor.y + this.riseStartOffset.y;
      const startZ = this.anchor.z + this.riseStartOffset.z;

      const targetX = this.anchor.x + state.targetOffsetX;
      const targetY = this.anchor.y + state.targetOffsetY;
      const targetZ = this.anchor.z + state.targetOffsetZ;

      let x = THREE.MathUtils.lerp(startX, targetX, riseProgress);
      let y = THREE.MathUtils.lerp(startY, targetY, riseProgress);
      let z = THREE.MathUtils.lerp(startZ, targetZ, riseProgress);

      const hoverTime = elapsed * state.hoverSpeed + state.phase;
      const hoverBlend = 0.2 + riseProgress * 0.8;
      x += Math.sin(hoverTime) * state.hoverAmpX * hoverBlend;
      y += Math.cos(hoverTime * 1.15) * state.hoverAmpY * hoverBlend;
      z += Math.sin(hoverTime * 0.92) * state.hoverAmpZ * hoverBlend;

      state.object.position.set(x, y, z);

      state.object.rotation.x += state.spinX * delta;
      state.object.rotation.y += state.spinY * delta;
    }
  }

  onWindowResize(): void {
    if (!this.camera || !this.renderer || !this.canvas) {
      return;
    }

    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private clearDynamicObjects(): void {
    if (this.scene) {
      for (const object of this.dynamicObjects) {
        this.scene.remove(object);
        this.disposeObject3D(object);
      }
    }

    for (const mixer of this.mixers) {
      mixer.stopAllAction();
    }

    this.mixers = [];
    this.floatingObjects = [];
    this.dynamicObjects = [];
  }

  private disposeObject3D(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }

      child.geometry.dispose();
      const material = child.material;

      if (Array.isArray(material)) {
        for (const mat of material) {
          this.disposeMaterial(mat);
        }
        return;
      }

      this.disposeMaterial(material);
    });
  }

  private disposeMaterial(material: THREE.Material): void {
    const maybeMaterial = material as unknown as Record<string, unknown>;
    for (const value of Object.values(maybeMaterial)) {
      if (value instanceof THREE.Texture) {
        value.dispose();
      }
    }

    material.dispose();
  }

  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    this.clearDynamicObjects();

    if (this.scene) {
      this.scene.clear();
      this.scene = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    this.camera = null;
    this.canvas = null;
  }
}
