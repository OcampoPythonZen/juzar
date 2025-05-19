import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class ModelViewer {
    constructor(containerId, modelPath) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID ${containerId} not found`);
            return;
        }

        this.modelPath = modelPath;
        this.scene = new THREE.Scene();
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupLights();
        this.loadModel();
        this.setupResizeHandler();
        this.animate();
    }

    setupScene() {
        // Get container dimensions
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // Create camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        // Clear the container and append renderer
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);

        // Add orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);

        // Hemisphere light for more natural lighting
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemisphereLight.position.set(0, 1, 0);
        this.scene.add(hemisphereLight);
    }

    loadModel() {
        const loader = new GLTFLoader();
        
        loader.load(
            this.modelPath,
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);
                
                // Center and scale the model
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                this.model.position.x = -center.x;
                this.model.position.y = -center.y;
                this.model.position.z = -center.z;
                
                // Scale model to fit
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                this.model.scale.set(scale, scale, scale);
                
                // Trigger custom event when model is loaded
                const event = new CustomEvent('modelLoaded', { detail: { model: this.model } });
                document.dispatchEvent(event);
            },
            (xhr) => {
                // Loading progress
                const percentLoaded = (xhr.loaded / xhr.total) * 100;
                console.log(`${percentLoaded}% loaded`);
                
                // Dispatch progress event
                const event = new CustomEvent('modelLoading', { 
                    detail: { 
                        loaded: xhr.loaded, 
                        total: xhr.total,
                        percent: percentLoaded
                    } 
                });
                document.dispatchEvent(event);
            },
            (error) => {
                console.error('Error loading model:', error);
                
                // Dispatch error event
                const event = new CustomEvent('modelError', { detail: { error } });
                document.dispatchEvent(event);
            }
        );
    }

    setupResizeHandler() {
        const onWindowResize = () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        };

        window.addEventListener('resize', onWindowResize, false);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Auto-initialize if data-model-viewer attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const modelContainers = document.querySelectorAll('[data-model-viewer]');
    
    modelContainers.forEach(container => {
        const modelPath = container.getAttribute('data-model-path');
        if (modelPath) {
            new ModelViewer(container.id, modelPath);
        }
    });
});
