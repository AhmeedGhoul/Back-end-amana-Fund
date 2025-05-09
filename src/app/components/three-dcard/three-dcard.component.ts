import { Component, Input, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-three-dcard',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="card-container"></div>',
  styles: [`
    .card-container {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class ThreeDCardComponent implements OnInit, OnDestroy {
  @Input() modelPath: string = 'assets/models/bank-card.glb';
  @Input() backgroundColor: string = '#ffffff';
  @Input() autoRotate: boolean = true;
  @Input() rotationSpeed: number = 0.5;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls: any; // Changed to any to avoid type issues
  private model!: THREE.Group;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.initThree();
    this.loadModel();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.renderer) this.renderer.dispose();
    if (this.controls) this.controls.dispose();
    window.removeEventListener('resize', this.onWindowResize);
  }

  private initThree(): void {
    const container = this.el.nativeElement.querySelector('.card-container');
    
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = this.rotationSpeed;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private onWindowResize = (): void => {
    const container = this.el.nativeElement.querySelector('.card-container');
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  private loadModel(): void {
    const loader = new GLTFLoader();
    loader.load(this.modelPath, (gltf) => {
      this.model = gltf.scene;
      this.model.scale.set(1, 1, 1);
      this.model.position.set(0, 0, 0);
      this.scene.add(this.model);
      
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      this.model.position.sub(center);
    }, undefined, (error) => {
      console.error('Error loading model:', error);
    });
  }

  private animate(): void {
    const animateFn = () => {
      requestAnimationFrame(animateFn);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animateFn();
  }
}