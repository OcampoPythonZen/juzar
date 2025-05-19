import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// Cache for loaded models to avoid reloading
const modelCache = new Map();

// Performance metrics tracking
const PerformanceMetrics = {
  lastFrameTime: 0,
  frameCount: 0,
  lastFpsUpdate: 0,
  fps: 0,
  maxFPS: 60,
  minFrameTime: 1000 / 60 // 60fps target
};

/**
 * ModelViewer - A 3D model viewer component with touch support and performance optimizations
 * @class
 */
export class ModelViewer {
    /**
     * @param {string} containerId - The ID of the container element
     * @param {string} modelPath - Path to the 3D model
     * @param {Object} [options={}] - Configuration options
     * @param {boolean} [options.autoRotate=false] - Enable auto-rotation
     * @param {number} [options.autoRotateSpeed=1.0] - Auto-rotation speed
     * @param {boolean} [options.enableZoom=true] - Enable zoom controls
     * @param {boolean} [options.enablePan=true] - Enable pan controls
     * @param {boolean} [options.enableRotate=true] - Enable rotation controls
     * @param {number} [options.shadowIntensity=0.8] - Shadow intensity
     * @param {boolean} [options.showStats=false] - Show performance stats
     */
    constructor(containerId, modelPath, options = {}) {
        // Store container and model path
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID ${containerId} not found`);
            return;
        }
        
        this.modelPath = modelPath;
        
        // Merge default options with provided options
        this.options = {
            autoRotate: true,
            autoRotateSpeed: 1.0,
            enableZoom: true,
            enablePan: true,
            enableRotate: true,
            showAxes: false,
            showGrid: false,
            backgroundColor: 0x111111,
            modelColor: 0xffffff,
            wireframe: false,
            showLoadingUI: true,
            loadingText: 'Loading 3D model...',
            loadingTextColor: '#ffffff',
            loadingBarColor: '#4CAF50',
            loadingBarBackgroundColor: '#333333',
            showFPS: false,
            maxFPS: 60, // Target FPS for performance optimizations
            ...options
        };
        
        // Check for WebGL support
        if (!this.checkWebGLSupport()) {
            this.showWebGLError();
            return;
        }
        
        // Initialize properties
        this.scene = new THREE.Scene();
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.mixers = [];
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.previousMousePosition = { x: 0, y: 0 };
        this.animationFrameId = null;
        this.isModelLoaded = false;
        this.isDragging = false;
        this.initialLoad = true;
        this.resizeObserver = null;
        this.cleanupResizeHandler = null;
        this.lastRenderTime = 0;
        this.maxRetryAttempts = 3;
        this.retryAttempts = 0;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // Performance metrics
        this.performanceMetrics = {
            frameCount: 0,
            lastFpsUpdate: 0,
            fps: 0,
            maxFPS: this.options.maxFPS,
            minFrameTime: 1000 / this.options.maxFPS,
            lastFrameTime: 0,
            frameTimes: [],
            averageFrameTime: 0,
            jankyFrames: 0,
            totalFrames: 0
        };
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.resetView = this.resetView.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.visibilityChangeHandler = this.visibilityChange.bind(this);
        
        // Set initial timestamp for performance tracking
        this.lastRenderTime = performance.now();
        this.performanceMetrics.lastFpsUpdate = this.lastRenderTime;
        
        // Create loading manager
        this.loadingManager = new THREE.LoadingManager();
        this.setupLoadingManager();
        
        this.init();
    }

    /**
     * Initialize the model viewer
     * @private
     */
    init() {
        try {
            this.createLoadingUI();
            this.setupScene();
            this.setupLights();
            this.setupEventListeners();
            this.setupResizeObserver();
            this.loadModel();
            this.animate();
            
            // Handle visibility changes (tab switching)
            document.addEventListener('visibilitychange', this.visibilityChangeHandler);
            
            // Show help tooltip on first load
            if (localStorage.getItem('modelViewerHelpShown') !== 'true') {
                this.showHelpTooltip();
                localStorage.setItem('modelViewerHelpShown', 'true');
            }
        } catch (error) {
            console.error('Error initializing model viewer:', error);
            this.showErrorUI('Failed to initialize 3D viewer. Please refresh the page.');
        }
    }

    /**
     * Create and display the loading UI
     * @private
     */
    createLoadingUI() {
        // Create loading container
        this.loadingContainer = document.createElement('div');
        this.loadingContainer.className = 'absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 transition-opacity duration-300';
        this.loadingContainer.setAttribute('role', 'status');
        this.loadingContainer.setAttribute('aria-live', 'polite');
        
        // Add loading spinner with better accessibility
        this.loadingSpinner = document.createElement('div');
        this.loadingSpinner.className = 'w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin';
        this.loadingSpinner.setAttribute('aria-hidden', 'true');
        
        // Add loading text with better semantics
        const loadingTextContainer = document.createElement('div');
        loadingTextContainer.className = 'mt-4 text-center';
        
        this.loadingText = document.createElement('p');
        this.loadingText.className = 'text-sm font-medium text-gray-700 dark:text-gray-300';
        this.loadingText.textContent = 'Loading 3D model...';
        this.loadingText.id = `${this.container.id}-loading-text`;
        
        // Add percentage text
        this.percentageText = document.createElement('span');
        this.percentageText.className = 'block text-xs text-gray-500 dark:text-gray-400 mt-1';
        this.percentageText.textContent = '0%';
        
        // Progress bar container with better accessibility
        this.progressContainer = document.createElement('div');
        this.progressContainer.className = 'w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4';
        this.progressContainer.setAttribute('role', 'progressbar');
        this.progressContainer.setAttribute('aria-valuemin', '0');
        this.progressContainer.setAttribute('aria-valuemax', '100');
        this.progressContainer.setAttribute('aria-valuenow', '0');
        this.progressContainer.setAttribute('aria-labelledby', this.loadingText.id);
        
        // Progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'h-full bg-blue-500 transition-all duration-300';
        this.progressBar.style.width = '0%';
        
        // Assemble the UI
        loadingTextContainer.appendChild(this.loadingText);
        loadingTextContainer.appendChild(this.percentageText);
        
        this.progressContainer.appendChild(this.progressBar);
        this.loadingContainer.appendChild(this.loadingSpinner);
        this.loadingContainer.appendChild(loadingTextContainer);
        this.loadingContainer.appendChild(this.progressContainer);
        
        // Add retry button (initially hidden)
        this.retryButton = document.createElement('button');
        this.retryButton.className = 'mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors hidden';
        this.retryButton.textContent = 'Retry Loading';
        this.retryButton.addEventListener('click', () => this.loadModel());
        this.loadingContainer.appendChild(this.retryButton);
        
        // Add to container
        this.container.style.position = 'relative';
        this.container.appendChild(this.loadingContainer);
    }
    
    /**
     * Update the loading progress
     * @param {number} progress - Loading progress (0-100)
     * @private
     */
    updateProgress(progress) {
        if (this.progressBar && this.loadingContainer) {
            const roundedProgress = Math.round(progress);
            this.progressBar.style.width = `${roundedProgress}%`;
            this.percentageText.textContent = `${roundedProgress}%`;
            this.progressContainer.setAttribute('aria-valuenow', roundedProgress);
            
            // Update loading text based on progress
            if (roundedProgress < 30) {
                this.loadingText.textContent = 'Loading 3D model...';
            } else if (roundedProgress < 70) {
                this.loadingText.textContent = 'Processing model data...';
            } else {
                this.loadingText.textContent = 'Finalizing...';
            }
        }
    }
    
    /**
     * Hide the loading UI with a smooth transition
     * @private
     */
    hideLoadingUI() {
        if (this.loadingContainer) {
            this.loadingContainer.style.opacity = '0';
            this.loadingContainer.style.pointerEvents = 'none';
            
            // Wait for the transition to complete before removing
            const onTransitionEnd = () => {
                if (this.loadingContainer && this.loadingContainer.parentNode) {
                    this.loadingContainer.removeEventListener('transitionend', onTransitionEnd);
                    this.loadingContainer.remove();
                }
            };
            
            this.loadingContainer.addEventListener('transitionend', onTransitionEnd, { once: true });
            
            // Fallback in case transitionend doesn't fire
            setTimeout(() => {
                if (this.loadingContainer && this.loadingContainer.parentNode) {
                    this.loadingContainer.removeEventListener('transitionend', onTransitionEnd);
                    this.loadingContainer.remove();
                }
            }, 500);
        }
    }
    
    /**
     * Show an error message in the UI
     * @param {string} message - Error message to display
     * @private
     */
    showErrorUI(message) {
        if (!this.loadingContainer) return;
        
        // Show retry button
        if (this.retryButton) {
            this.retryButton.classList.remove('hidden');
        }
        
        // Update loading UI to show error state
        this.loadingSpinner.className = 'w-12 h-12 text-red-500';
        this.loadingSpinner.innerHTML = `
            <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        `;
        
        // Update text
        this.loadingText.textContent = 'Error Loading Model';
        this.loadingText.className = 'text-sm font-medium text-red-600 dark:text-red-400';
        
        // Add error details
        const errorDetails = document.createElement('p');
        errorDetails.className = 'text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs';
        errorDetails.textContent = message || 'Failed to load the 3D model. Please check your connection and try again.';
        
        // Insert after loading text
        this.loadingText.parentNode.insertBefore(errorDetails, this.percentageText);
        
        // Hide progress bar
        if (this.progressContainer) {
            this.progressContainer.style.opacity = '0.5';
        }
    }
    
    /**
     * Check if WebGL is supported
     * @returns {boolean} True if WebGL is supported
     * @private
     */
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                    (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Show WebGL not supported error
     * @private
     */
    showWebGLError() {
        this.container.innerHTML = `
            <div class="p-6 text-center text-red-600 bg-red-50 rounded-lg">
                <h3 class="text-lg font-medium">WebGL Not Supported</h3>
                <p class="mt-2 text-sm">
                    Your browser or device does not support WebGL, which is required to display 3D models.
                    Please try using a modern browser like Chrome, Firefox, or Edge.
                </p>
            </div>
        `;
    }
    
    /**
     * Handle visibility change events (tab switching)
     * @private
     */
    visibilityChange() {
        if (document.hidden) {
            // Tab is hidden, reduce performance impact
            this.performanceMetrics.maxFPS = 15;
            this.performanceMetrics.minFrameTime = 1000 / this.performanceMetrics.maxFPS;
            
            // Pause animations
            this.mixers.forEach(mixer => mixer.timeScale = 0);
        } else {
            // Tab is visible, restore normal FPS
            this.performanceMetrics.maxFPS = this.options.maxFPS;
            this.performanceMetrics.minFrameTime = 1000 / this.performanceMetrics.maxFPS;
            
            // Resume animations
            this.mixers.forEach(mixer => mixer.timeScale = 1);
            
            // Force a render to update the display
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        }
    }
    
    /**
     * Handle window resize events
     * @private
     */
    handleResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Update camera
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(Math.min(pixelRatio, 2)); // Cap pixel ratio for performance
        
        // Update controls if they exist
        if (this.controls && typeof this.controls.handleResize === 'function') {
            this.controls.handleResize();
        }
    }
    
    /**
     * Check if WebGL is supported
     * @returns {boolean} True if WebGL is supported
     * @private
     */
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                    (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Show WebGL error message
     * @private
     */
    showWebGLError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'absolute';
        errorDiv.style.top = '50%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translate(-50%, -50%)';
        errorDiv.style.padding = '20px';
        errorDiv.style.background = '#ffebee';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.color = '#c62828';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.maxWidth = '80%';
        errorDiv.style.zIndex = '1000';
        
        errorDiv.innerHTML = `
            <h3 style="margin-top: 0; color: #b71c1c;">WebGL Not Supported</h3>
            <p>Your browser or device does not support WebGL, which is required to display 3D content.</p>
            <p>Please try using a modern browser like Chrome, Firefox, or Edge with WebGL enabled.</p>
            <p><a href="https://get.webgl.org/" target="_blank" style="color: #1976d2; text-decoration: underline;">Learn more about WebGL</a></p>
        `;
        
        this.container.appendChild(errorDiv);
    }
    
    /**
     * Handle mouse down event
     * @param {MouseEvent} event - Mouse event
     * @private
     */
    onMouseDown(event) {
        this.isDragging = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        
        // Prevent text selection during drag
        event.preventDefault();
    }
    
    /**
     * Handle mouse move event
     * @param {MouseEvent} event - Mouse event
     * @private
     */
    onMouseMove(event) {
        if (!this.isDragging) return;
        
        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;
        
        // Update model rotation based on mouse movement
        if (this.model) {
            this.model.rotation.y += deltaX * 0.01;
            this.model.rotation.x += deltaY * 0.01;
        }
        
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    /**
     * Handle mouse up event
     * @private
     */
    onMouseUp() {
        this.isDragging = false;
    }
    
    /**
     * Handle click event
     * @param {MouseEvent} event - Mouse event
     * @private
     */
    onClick(event) {
        // Handle click interactions if needed
        // This can be used for object picking or other interactions
    }
    
    /**
     * Handle touch start event
     * @param {TouchEvent} event - Touch event
     * @private
     */
    onTouchStart(event) {
        if (event.touches.length === 1) {
            this.isDragging = true;
            this.previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
            event.preventDefault();
        }
    }
    
    /**
     * Handle touch move event
     * @param {TouchEvent} event - Touch event
     * @private
     */
    onTouchMove(event) {
        if (!this.isDragging || event.touches.length !== 1) return;
        
        const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = event.touches[0].clientY - this.previousMousePosition.y;
        
        // Update model rotation based on touch movement
        if (this.model) {
            this.model.rotation.y += deltaX * 0.01;
            this.model.rotation.x += deltaY * 0.01;
        }
        
        this.previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
        
        event.preventDefault();
    }
    
    /**
     * Handle touch end event
     * @private
     */
    onTouchEnd() {
        this.isDragging = false;
    }
    
    /**
     * Reset the view to the initial camera position
     * @public
     */
    resetView() {
        if (this.camera && this.controls) {
            this.controls.reset();
        }
    }
    
    /**
     * Show a help tooltip with interaction instructions
     * @private
     */
    showHelpTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-2 rounded-md pointer-events-none opacity-0 transition-opacity duration-300';
        tooltip.textContent = 'Drag to rotate • Scroll to zoom • Double-click to reset';
        this.container.appendChild(tooltip);
        
        // Fade in
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 300);
        }, 5000);
    }
    
    /**
     * Setup the loading manager with progress tracking
     * @private
     */
    setupLoadingManager() {
        this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log(`Started loading file: ${url} (${itemsLoaded} of ${itemsTotal} files)`);
        };

        this.loadingManager.onLoad = () => {
            console.log('Loading complete!');
            this.hideLoadingUI();
        };

        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            console.log(`Loading file: ${url} (${itemsLoaded} of ${itemsTotal})`);
            console.log(`Loading progress: ${progress}%`);
            this.updateProgress(progress);
            
            // Dispatch progress event
            const event = new CustomEvent('modelLoading', { 
                detail: { 
                    loaded: itemsLoaded, 
                    total: itemsTotal,
                    percent: progress
                } 
            });
            document.dispatchEvent(event);
        };

        this.loadingManager.onError = (url) => {
            console.error(`Error loading ${url}`);
            this.showErrorUI(`Failed to load resource: ${url}`);
            
            // Dispatch error event
            const event = new CustomEvent('modelError', { 
                detail: { 
                    error: `Failed to load resource: ${url}`
                } 
            });
            document.dispatchEvent(event);
        };
    }

    setupScene() {
        // Get container dimensions
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // Create camera with adjusted FOV for mobile
        const fov = this.isMobile ? 50 : 45;
        this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
        this.camera.position.z = 5;

        // Create renderer with performance optimizations
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
        });
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Enable physically correct lighting
        this.renderer.physicallyCorrectLights = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Clear the container and append renderer
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);

        // Add orbit controls with improved touch support
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enablePan = !this.isMobile; // Disable pan on mobile
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 1.5; // Allow looking under the model
        
        // Touch controls for mobile
        if (this.isMobile) {
            this.controls.touches = {
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
            };
        }
    }

    setupLights() {
        // Ambient light - soft white light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main directional light - simulates sun
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(5, 10, 7);
        mainLight.castShadow = true;
        
        // Optimize shadow map
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        mainLight.shadow.bias = -0.001;
        
        this.scene.add(mainLight);

        // Fill light - soft light from the opposite side
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-5, 3, -5);
        this.scene.add(fillLight);

        // Rim light - for edge highlighting
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.75);
        rimLight.position.set(0, 5, -5);
        this.scene.add(rimLight);
        
        // Hemisphere light - for natural outdoor lighting effect
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemisphereLight.position.set(0, 20, 0);
        this.scene.add(hemisphereLight);
    }
    
    setupEventListeners() {
        // Mouse events
        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
        
        // Touch events
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchend', this.onTouchEnd.bind(this));
        
        // Double click to reset view
        this.renderer.domElement.addEventListener('dblclick', this.resetView.bind(this));
        
        // Prevent context menu on right-click
        this.renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    onMouseDown(event) {
        this.isDragging = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    onMouseMove(event) {
        if (!this.isDragging) return;
        
        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;
        
        if (this.model) {
            this.model.rotation.y += deltaX * 0.01;
            this.model.rotation.x += deltaY * 0.01;
        }
        
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    onMouseUp() {
        this.isDragging = false;
    }
    
    onClick(event) {
        // Convert mouse position to normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObject(this.model, true);
        
        if (intersects.length > 0) {
            console.log('Clicked on:', intersects[0].object.name);
            
            // Dispatch click event with intersection data
            const clickEvent = new CustomEvent('modelClick', { 
                detail: { 
                    intersection: intersects[0],
                    object: intersects[0].object
                } 
            });
            document.dispatchEvent(clickEvent);
        }
    }
    
    onTouchStart(event) {
        if (event.touches.length === 1) {
            this.isDragging = true;
            this.previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
            event.preventDefault();
        }
    }
    
    onTouchMove(event) {
        if (!this.isDragging || event.touches.length !== 1) return;
        
        const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = event.touches[0].clientY - this.previousMousePosition.y;
        
        if (this.model) {
            this.model.rotation.y += deltaX * 0.01;
            this.model.rotation.x += deltaY * 0.01;
        }
        
        this.previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
        
        event.preventDefault();
    }
    
    onTouchEnd() {
        this.isDragging = false;
    }
    
    resetView() {
        if (this.controls) {
            this.controls.reset();
        }
        
        if (this.model) {
            this.model.rotation.set(0, 0, 0);
            this.model.position.set(0, 0, 0);
        }
        
        this.camera.position.z = 5;
    }

    loadModel() {
        // Configure DRACO loader for compressed models
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        
        // Configure GLTF loader with DRACO and loading manager
        const loader = new GLTFLoader(this.loadingManager);
        loader.setDRACOLoader(dracoLoader);
        
        // Start loading the model
        loader.load(
            this.modelPath,
            (gltf) => {
                this.model = gltf.scene;
                
                // Process all materials for better rendering
                this.model.traverse((node) => {
                    if (node.isMesh) {
                        // Enable shadows
                        node.castShadow = true;
                        node.receiveShadow = true;
                        
                        // Improve material rendering
                        if (node.material) {
                            // Convert to physically based rendering materials if needed
                            if (node.material.map) node.material.needsUpdate = true;
                            
                            // Enable flat shading for better performance on complex models
                            if (!node.material.flatShading) {
                                node.material.flatShading = true;
                            }
                            
                            // Enable transparency if needed
                            if (node.material.transparent) {
                                node.material.transparent = true;
                                node.material.opacity = 1.0;
                            }
                        }
                    }
                });
                
                // Add the model to the scene
                this.scene.add(this.model);
                
                // Center and scale the model
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                // Center the model
                this.model.position.x = -center.x;
                this.model.position.y = -center.y;
                this.model.position.z = -center.z;
                
                // Calculate scale to fit the model in the view
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = this.isMobile ? 1.5 / maxDim : 2 / maxDim;
                this.model.scale.set(scale, scale, scale);
                
                // Set up animations if they exist
                if (gltf.animations && gltf.animations.length) {
                    const mixer = new THREE.AnimationMixer(this.model);
                    this.mixers.push(mixer);
                    
                    // Play all animations
                    gltf.animations.forEach((clip) => {
                        const action = mixer.clipAction(clip);
                        action.play();
                    });
                }
                
                // Trigger custom event when model is loaded
                const event = new CustomEvent('modelLoaded', { 
                    detail: { 
                        model: this.model,
                        animations: gltf.animations || []
                    } 
                });
                document.dispatchEvent(event);
                
                // Hide loading UI after a short delay to ensure everything is rendered
                setTimeout(() => this.hideLoadingUI(), 300);
            },
            (xhr) => {
                // Progress updates are handled by the loading manager
            },
            (error) => {
                console.error('Error loading model:', error);
                this.showErrorUI('Failed to load the 3D model. Please try again later.');
                
                // Dispatch error event
                const event = new CustomEvent('modelError', { 
                    detail: { 
                        error: error.message || 'Failed to load 3D model'
                    } 
                });
                document.dispatchEvent(event);
            }
        );
        
        // Add loading placeholder or fallback content
        this.container.setAttribute('aria-busy', 'true');
    }

    /**
     * Set up a ResizeObserver to handle container resizing
     * @private
     */
    setupResizeObserver() {
        if (typeof ResizeObserver === 'undefined') {
            // Fallback for browsers that don't support ResizeObserver
            const handleResize = this.throttle(() => this.onWindowResize(), 100);
            window.addEventListener('resize', handleResize, { passive: true });
            return () => window.removeEventListener('resize', handleResize);
        }
        
        this.resizeObserver = new ResizeObserver(entries => {
            if (!entries[0]) return;
            const { width, height } = entries[0].contentRect;
            this.onWindowResize(width, height);
        });
        
        this.resizeObserver.observe(this.container);
    }
    
    /**
     * Throttle function to limit the rate of function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     * @private
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Handle window resize events
     * @private
     */
    onWindowResize(width, height) {
        if (!this.renderer || !this.camera) return;
        
        const containerWidth = width || this.container.clientWidth;
        const containerHeight = height || this.container.clientHeight;
        
        // Update camera aspect ratio
        this.camera.aspect = containerWidth / containerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(containerWidth, containerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Adjust render quality based on container size
        this.adjustQuality(containerWidth, containerHeight);
    }
    
    /**
     * Adjust rendering quality based on container size and device capabilities
     * @param {number} width - Container width
     * @param {number} height - Container height
     * @private
     */
    adjustQuality(width, height) {
        if (!this.renderer) return;
        
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        const isHighPerfDevice = !this.isMobile && window.deviceMemory >= 4; // 4GB+ RAM
        
        // Adjust shadow quality
        const shadowMapSize = isHighPerfDevice ? 2048 : 1024;
        this.scene.traverse(child => {
            if (child.isLight && child.shadow) {
                child.shadow.mapSize.width = shadowMapSize;
                child.shadow.mapSize.height = shadowMapSize;
                child.shadow.map?.dispose();
                child.shadow.map = null;
            }
        });
        
        // Adjust antialiasing
        this.renderer.antialias = isHighPerfDevice;
    }
    
    /**
     * Set up the scene with proper sizing and camera
     * @private
     */
    setupResizeHandler() {
        let resizeTimeout;
        const onWindowResize = () => {
            // Debounce resize events
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const width = this.container.clientWidth;
                const height = this.container.clientHeight;
                
                // Update camera
                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();
                
                // Update renderer
                this.renderer.setSize(width, height);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                
                console.log(`Resized to: ${width}x${height}`);
            }, 100);
        };

        // Initial setup
        onWindowResize();
        
        // Add event listener
        window.addEventListener('resize', onWindowResize, { passive: true });
        
        // Cleanup function
        return () => {
            window.removeEventListener('resize', onWindowResize);
            clearTimeout(resizeTimeout);
        };
    }

    /**
     * Main animation loop with frame rate limiting and performance optimizations
     * @private
     */
    animate() {
        // Store animation frame ID for cleanup
        this.animationFrameId = requestAnimationFrame((timestamp) => this.animate(timestamp));
        
        // Throttle frame rate when tab is inactive or on mobile
        const now = performance.now();
        const deltaTime = now - this.lastRenderTime;
        
        // Skip frame if not enough time has passed (throttle FPS)
        if (deltaTime < this.performanceMetrics.minFrameTime) {
            return;
        }
        
        // Update last render time, adjusting for frame time
        this.lastRenderTime = now - (deltaTime % this.performanceMetrics.minFrameTime);
        
        // Update performance metrics
        this.updatePerformanceMetrics(now);
        
        // Update controls if enabled and not currently dragging
        if (this.controls) {
            if (!this.isDragging || this.initialLoad) {
                this.controls.update();
            }
            
            // Handle auto-rotation if enabled
            if (this.options.autoRotate && !this.isDragging) {
                this.model.rotation.y += 0.001 * this.options.autoRotateSpeed;
            }
        }
        
        // Update animations if model is loaded
        if (this.isModelLoaded) {
            const delta = Math.min(0.1, this.clock.getDelta()); // Cap delta to prevent large jumps
            this.mixers.forEach(mixer => mixer.update(delta));
        }
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
        
        // Mark initial load as complete after first render
        if (this.initialLoad) {
            this.initialLoad = false;
        }
    }
    
    /**
     * Update performance metrics and adjust quality if needed
     * @param {number} currentTime - Current timestamp
     * @private
     */
    updatePerformanceMetrics(currentTime) {
        // Update FPS counter
        this.performanceMetrics.frameCount++;
        
        // Update FPS every second
        if (currentTime - this.performanceMetrics.lastFpsUpdate > 1000) {
            this.performanceMetrics.fps = Math.round(
                (this.performanceMetrics.frameCount * 1000) / (currentTime - this.performanceMetrics.lastFpsUpdate)
            );
            this.performanceMetrics.frameCount = 0;
            this.performanceMetrics.lastFpsUpdate = currentTime;
            
            // Adjust quality based on FPS
            this.adjustQualityBasedOnFPS();
        }
    }
    
    /**
     * Adjust quality settings based on current FPS
     * @private
     */
    adjustQualityBasedOnFPS() {
        if (!this.isModelLoaded) return;
        
        const targetFPS = this.performanceMetrics.maxFPS;
        const currentFPS = this.performanceMetrics.fps;
        const fpsRatio = currentFPS / targetFPS;
        
        // Only adjust if we're consistently below target
        if (fpsRatio < 0.8) {
            // Reduce quality
            this.renderer.shadowMap.enabled = currentFPS > 30;
            
            // Reduce shadow quality
            this.scene.traverse(child => {
                if (child.isLight && child.shadow) {
                    const currentSize = child.shadow.mapSize.x;
                    if (currentSize > 512) {
                        const newSize = Math.max(256, currentSize / 2);
                        child.shadow.mapSize.set(newSize, newSize);
                        child.shadow.map?.dispose();
                        child.shadow.map = null;
                    }
                }
            });
        }
    }
    
    /**
     * Clean up all resources when the viewer is no longer needed
     * @public
     */
    dispose() {
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Remove event listeners
        if (this.renderer) {
            const canvas = this.renderer.domElement;
            canvas.removeEventListener('mousedown', this.onMouseDown);
            canvas.removeEventListener('mousemove', this.onMouseMove);
            canvas.removeEventListener('mouseup', this.onMouseUp);
            canvas.removeEventListener('click', this.onClick);
            canvas.removeEventListener('touchstart', this.onTouchStart);
            canvas.removeEventListener('touchmove', this.onTouchMove);
            canvas.removeEventListener('touchend', this.onTouchEnd);
            canvas.removeEventListener('dblclick', this.resetView);
        }
        
        // Remove visibility change listener
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
        
        // Clean up resize observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        
        // Clean up resize handler
        if (typeof this.cleanupResizeHandler === 'function') {
            this.cleanupResizeHandler();
        }
        
        // Dispose of 3D objects and materials
        if (this.model) {
            this.model.traverse(child => {
                if (child.isMesh) {
                    // Dispose geometry
                    if (child.geometry) {
                        child.geometry.dispose();
                    }
                    
                    // Dispose materials
                    if (child.material) {
                        // Handle both single material and material array
                        const materials = Array.isArray(child.material) 
                            ? child.material 
                            : [child.material];
                        
                        materials.forEach(material => {
                            if (!material) return;
                            
                            // Dispose textures
                            Object.keys(material)
                                .filter(key => key in material && material[key]?.isTexture)
                                .forEach(key => material[key].dispose());
                            
                            // Dispose material
                            material.dispose();
                        });
                    }
                }
            });
            
            this.scene.remove(this.model);
            this.model = null;
        }
        
        // Dispose of animations
        this.mixers.forEach(mixer => mixer.uncacheRoot(this.scene));
        this.mixers = [];
        
        // Dispose of renderer
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.forceContextLoss();
            this.renderer.domElement = null;
            this.renderer = null;
        }
        
        // Clean up loading UI
        if (this.loadingContainer && this.loadingContainer.parentNode) {
            this.loadingContainer.remove();
        }
        
        // Clear all references
        this.controls = null;
        this.camera = null;
        this.scene = null;
        this.model = null;
        this.loadingManager = null;
        this.raycaster = null;
        this.mouse = null;
        this.container = null;
        
        // Clear any remaining event listeners
        const clone = this.container?.cloneNode(false);
        if (clone) {
            this.container.parentNode?.replaceChild(clone, this.container);
        }
    }
}

// Auto-initialize if data-model-viewer attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const modelContainers = document.querySelectorAll('[data-model-viewer]');
    const modelViewers = [];
    
    modelContainers.forEach(container => {
        const modelPath = container.getAttribute('data-model-path');
        const config = {
            autoRotate: container.hasAttribute('data-auto-rotate'),
            autoRotateSpeed: parseFloat(container.getAttribute('data-rotate-speed') || '1.0'),
            enableZoom: !container.hasAttribute('data-zoom-disabled'),
            enablePan: !container.hasAttribute('data-pan-disabled'),
            enableRotate: !container.hasAttribute('data-rotate-disabled'),
            shadowIntensity: parseFloat(container.getAttribute('data-shadow-intensity') || '0.8')
        };
        
        if (modelPath) {
            const viewer = new ModelViewer(container.id, modelPath, config);
            modelViewers.push(viewer);
        }
    });
    
    // Handle window unload to clean up resources
    window.addEventListener('beforeunload', () => {
        modelViewers.forEach(viewer => {
            if (viewer && typeof viewer.dispose === 'function') {
                viewer.dispose();
            }
        });
    });
});

// Export for module usage
export { ModelViewer };
