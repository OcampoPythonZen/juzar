import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createFireExtinguisher } from './fire-extinguisher.js';

/**
 * HeroModelViewer - A lightweight 3D model viewer for the hero section
 * Optimized for performance with a simple fire extinguisher model
 */
export class HeroModelViewer {
    /**
     * @param {string} containerId - ID of the container element
     * @param {Object} [options={}] - Configuration options
     */
    constructor(containerId, options = {}) {
        // Store container reference
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID ${containerId} not found`);
            return;
        }

        // Default options
        this.options = {
            autoRotate: true,
            autoRotateSpeed: 0.5,
            enableControls: false, // Disable controls by default for hero section
            enableZoom: false,
            enablePan: false,
            enableRotate: false,
            scale: 1,
            cameraPosition: { x: 0, y: 0, z: 3 },
            backgroundColor: 0xf5f5f5,
            modelColor: 0xff0000,
            ...options
        };

        // Initialize Three.js components
        this.initRenderer();
        this.initScene();
        this.initCamera();
        this.initLights();
        this.loadModel();
        this.setupEventListeners();
        this.animate();
    }

    /** Initialize the WebGL renderer */
    initRenderer() {
        // Create renderer with antialiasing and device pixel ratio
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(this.options.backgroundColor, 0);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Set size to match container
        this.updateSize();
        this.container.appendChild(this.renderer.domElement);
    }

    /** Initialize the scene */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background
        
        // Add a simple ground plane for shadows
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.ShadowMaterial({ 
            color: 0x000000,
            opacity: 0.2,
            transparent: true
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = -1;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    /** Initialize the camera */
    initCamera() {
        // Create camera with aspect ratio based on container
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        
        // Set initial camera position
        this.camera.position.set(
            this.options.cameraPosition.x,
            this.options.cameraPosition.y,
            this.options.cameraPosition.z
        );
        
        // Add orbit controls if enabled
        if (this.options.enableControls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = this.options.enableZoom;
            this.controls.enablePan = this.options.enablePan;
            this.controls.enableRotate = this.options.enableRotate;
            this.controls.autoRotate = this.options.autoRotate;
            this.controls.autoRotateSpeed = this.options.autoRotateSpeed;
        }
    }

    /** Initialize lights */
    initLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light for shadows
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(5, 10, 7);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 50;
        this.directionalLight.shadow.camera.left = -10;
        this.directionalLight.shadow.camera.right = 10;
        this.directionalLight.shadow.camera.top = 10;
        this.directionalLight.shadow.camera.bottom = -10;
        this.scene.add(this.directionalLight);
        
        // Add fill light for better visibility
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-5, 3, 5);
        this.scene.add(fillLight);
    }

    /** Load the 3D model */
    loadModel() {
        // Create a simple fire extinguisher model
        this.model = createFireExtinguisher(this.scene, this.options.scale);
        
        // Position the model
        if (this.model && this.model.group) {
            this.model.group.position.y = 0;
            this.model.group.rotation.y = Math.PI / 4; // Slight rotation for better view
        }
    }

    /** Handle window resize */
    onWindowResize() {
        this.updateSize();
        
        // Update camera aspect ratio
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    /** Update size based on container */
    updateSize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        // Only update if size actually changed
        if (this.containerWidth !== width || this.containerHeight !== height) {
            this.containerWidth = width;
            this.containerHeight = height;
            
            // Update renderer
            this.renderer.setSize(width, height);
            
            // Update camera
            if (this.camera) {
                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();
            }
        }
    }

    /** Animation loop */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Update controls if enabled
        if (this.controls) {
            this.controls.update();
        }
        
        // Update model animations
        if (this.model && this.model.update) {
            this.model.update(performance.now() * 0.001);
        }
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    /** Set up event listeners */
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Handle visibility change for better performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(this.animationId);
            } else {
                this.animate();
            }
        });
    }

    /**
     * Clean up and dispose all resources
     * @public
     */
    dispose() {
        if (this.isDisposed) return;
        
        // Cancel animation frame
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Remove event listeners
        this.removeEventListeners();
        
        // Dispose the model if it has a dispose method
        if (this.model && typeof this.model.dispose === 'function') {
            this.model.dispose();
            this.model = null;
        }
        
        // Dispose renderer
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.forceContextLoss();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
        }
        
        // Dispose scene
        if (this.scene) {
            this.scene.traverse(object => {
                if (!object.isMesh) return;
                
                // Dispose geometry
                if (object.geometry) {
                    object.geometry.dispose();
                }
                
                // Dispose materials
                const materials = Array.isArray(object.material) 
                    ? object.material 
                    : [object.material];
                
                materials.forEach(material => {
                    if (!material) return;
                    
                    // Dispose textures
                    for (const key in material) {
                        const value = material[key];
                        if (value && typeof value === 'object' && 'minFilter' in value) {
                            value.dispose();
                        }
                    }
                    
                    material.dispose();
                });
            });
            
            // Clear scene
            while (this.scene.children.length > 0) {
                const object = this.scene.children[0];
                this.scene.remove(object);
            }
            
            this.scene = null;
        }
        
        // Clear container
        if (this.container) {
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }
        
        // Clear references
        this.camera = null;
        this.controls = null;
        this.model = null;
        this.mouse = null;
        
        // Mark as disposed
        this.isDisposed = true;
        this.isInitialized = false;
    }
    
    /**
     * Handle window resize
     * @private
     */
    onWindowResize = () => {
        if (!this.isInitialized || this.isDisposed) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        // Only update if size actually changed
        if (this.width !== width || this.height !== height) {
            this.width = width;
            this.height = height;
            
            // Update camera
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            
            // Update renderer
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Recenter model
            if (this.model) {
                this.centerModel();
            }
        }
    };
    
    /**
     * Handle visibility change
     * @private
     */
    handleVisibilityChange = () => {
        if (document.hidden) {
            // Pause animations when tab is not visible
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        } else if (this.isInitialized && !this.isDisposed && !this.animationId) {
            // Resume animations when tab becomes visible
            this.lastFrameTime = performance.now();
            this.clock.start();
            this.animate();
        }
    };
    
    /**
     * Handle mouse move for parallax effect
     * @private
     */
    onMouseMove = (event) => {
        if (!this.options.enableParallax) return;
        
        // Calculate normalized device coordinates (-1 to +1)
        this.mouse = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1
        };
    };
    
    /**
     * Set up event listeners
     * @private
     */
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.onWindowResize, { passive: true });
        
        // Visibility change (tab switch)
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Mouse move for parallax
        if (this.options.enableParallax) {
            this.mouse = { x: 0, y: 0 };
            window.addEventListener('mousemove', this.onMouseMove, { passive: true });
        }
        
        // Touch events for mobile
        if ('ontouchstart' in window) {
            window.addEventListener('touchmove', this.onTouchMove, { passive: true });
        }
    }
    
    /**
     * Remove all event listeners
     * @private
     */
    removeEventListeners() {
        window.removeEventListener('resize', this.onWindowResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('touchmove', this.onTouchMove);
    }
    
    /**
     * Handle touch move for mobile devices
     * @private
     */
    onTouchMove = (event) => {
        if (!this.options.enableParallax) return;
        
        const touch = event.touches[0] || event.changedTouches[0];
        if (!touch) return;
        
        this.mouse = {
            x: (touch.clientX / window.innerWidth) * 2 - 1,
            y: -(touch.clientY / window.innerHeight) * 2 + 1
        };
    };
    
    /* Public API Methods */
    
    /**
     * Set the model color
     * @param {number|string} color - Color in hex or CSS color string
     * @public
     */
    setColor(color) {
        if (this.model && typeof this.model.setColor === 'function') {
            this.model.setColor(color);
        }
    }
    
    /**
     * Set the model metalness
     * @param {number} value - Metalness value (0 to 1)
     * @public
     */
    setMetalness(value) {
        if (this.model && typeof this.model.setMetalness === 'function') {
            this.model.setMetalness(value);
        }
    }
    
    /**
     * Set the model roughness
     * @param {number} value - Roughness value (0 to 1)
     * @public
     */
    setRoughness(value) {
        if (this.model && typeof this.model.setRoughness === 'function') {
            this.model.setRoughness(value);
        }
    }
    
    /**
     * Trigger the spray animation
     * @public
     */
    triggerSpray() {
        if (this.model && typeof this.model.triggerSpray === 'function') {
            this.model.triggerSpray();
        }
    }
    
    /**
     * Update the model scale
     * @param {number} scale - New scale value
     * @public
     */
    setScale(scale) {
        if (this.model && this.model.group) {
            this.model.group.scale.set(scale, scale, scale);
        }
    }
    
    /**
     * Reset the camera to default position
     * @public
     */
    resetCamera() {
        if (this.camera && this.options.cameraPosition) {
            const { x, y, z } = this.options.cameraPosition;
            this.camera.position.set(x, y, z);
            this.camera.lookAt(0, 0, 0);
            
            if (this.controls) {
                this.controls.target.set(0, 0, 0);
                this.controls.update();
            }
        }
    }
}

// Auto-initialize if data-hero-model-viewer attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-hero-model-viewer]');
    
    containers.forEach(container => {
        const options = {
            autoRotate: container.dataset.autoRotate !== 'false',
            autoRotateSpeed: parseFloat(container.dataset.rotateSpeed) || 0.5,
            scale: parseFloat(container.dataset.scale) || 1,
            modelColor: container.dataset.modelColor || '#ff0000'
        };
        
        new HeroModelViewer(container.id, options);
    });
});
