/**
 * Creates a 3D model of a fire extinguisher using Three.js primitives
 * @param {THREE.Scene} scene - The scene to add the model to
 * @param {number} scale - Scale factor for the model
 * @returns {Object} Object containing the model and its parts
 */
function createFireExtinguisher(scene, scale = 1) {
    const group = new THREE.Group();
    
    // Materials
    const redMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        metalness: 0.3,
        roughness: 0.7
    });
    
    const silverMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.3
    });
    
    const blackMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.1,
        roughness: 0.9
    });
    
    // Main body (cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const body = new THREE.Mesh(bodyGeometry, redMaterial);
    body.rotation.x = Math.PI / 2; // Rotate to stand upright
    body.position.y = 0.2;
    group.add(body);
    
    // Top part (cylinder)
    const topGeometry = new THREE.CylinderGeometry(0.6, 0.8, 0.4, 32);
    const top = new THREE.Mesh(topGeometry, silverMaterial);
    top.rotation.x = Math.PI / 2;
    top.position.y = 0.9;
    group.add(top);
    
    // Nozzle (cylinder)
    const nozzleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
    const nozzle = new THREE.Mesh(nozzleGeometry, silverMaterial);
    nozzle.rotation.x = Math.PI / 2;
    nozzle.rotation.z = -0.3; // Angle the nozzle
    nozzle.position.set(0.7, 0.9, 0);
    group.add(nozzle);
    
    // Handle (torus)
    const handleGeometry = new THREE.TorusGeometry(0.15, 0.03, 16, 32);
    const handle = new THREE.Mesh(handleGeometry, blackMaterial);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0, 1.1, 0);
    group.add(handle);
    
    // Pressure gauge (small cylinder)
    const gaugeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const gauge = new THREE.Mesh(gaugeGeometry, silverMaterial);
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(-0.5, 0.9, 0.3);
    group.add(gauge);
    
    // Gauge face (small cylinder)
    const gaugeFaceGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.11, 16);
    const gaugeFace = new THREE.Mesh(gaugeFaceGeometry, new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.9
    }));
    gaugeFace.rotation.x = Math.PI / 2;
    gaugeFace.position.set(-0.5, 0.9, 0.36);
    group.add(gaugeFace);
    
    // Scale the entire model
    group.scale.set(scale, scale, scale);
    
    // Add the model to the scene if provided
    if (scene) {
        scene.add(group);
    }
    
    // Animation state
    let animationState = {
        nozzleRotation: 0,
        nozzleTargetRotation: 0,
        pressureGaugeRotation: 0,
        time: 0
    };
    
    // Update function for animations
    const update = (time = 0) => {
        // Smoothly update nozzle rotation
        animationState.nozzleRotation += (animationState.nozzleTargetRotation - animationState.nozzleRotation) * 0.1;
        nozzle.rotation.z = -0.3 + Math.sin(animationState.nozzleRotation) * 0.1;
        
        // Subtle breathing effect for the pressure gauge
        animationState.time += 0.01;
        if (gaugeFace) {
            gaugeFace.rotation.z = Math.sin(animationState.time * 0.5) * 0.05;
        }
        
        // Auto-rotate if enabled in options
        if (options.autoRotate) {
            group.rotation.y = time * (options.rotationSpeed || 0.2);
        }
        
        // Update any additional animations
        if (options.onUpdate) {
            options.onUpdate(time, group, animationState);
        }
    };
    
    // Handle mouse/touch interactions
    const handleInteraction = (e) => {
        if (e.type === 'mousedown' || e.type === 'touchstart') {
            animationState.nozzleTargetRotation = 0.2;
        } else if (e.type === 'mouseup' || e.type === 'touchend') {
            animationState.nozzleTargetRotation = 0;
        }
    };
    
    // Add event listeners if container is provided
    if (options.container) {
        const container = typeof options.container === 'string' 
            ? document.getElementById(options.container) 
            : options.container;
            
        if (container) {
            container.addEventListener('mousedown', handleInteraction);
            container.addEventListener('mouseup', handleInteraction);
            container.addEventListener('touchstart', handleInteraction, { passive: true });
            container.addEventListener('touchend', handleInteraction, { passive: true });
        }
    }
    
    // Cleanup function
    const dispose = () => {
        if (options.container) {
            const container = typeof options.container === 'string' 
                ? document.getElementById(options.container) 
                : options.container;
                
            if (container) {
                container.removeEventListener('mousedown', handleInteraction);
                container.removeEventListener('mouseup', handleInteraction);
                container.removeEventListener('touchstart', handleInteraction);
                container.removeEventListener('touchend', handleInteraction);
            }
        }
        
        // Dispose of geometries and materials
        [bodyGeometry, topGeometry, nozzleGeometry, handleGeometry, gaugeGeometry, gaugeFaceGeometry].forEach(geo => geo.dispose());
        [redMaterial, silverMaterial, blackMaterial].forEach(mat => {
            if (mat.map) mat.map.dispose();
            if (mat.normalMap) mat.normalMap.dispose();
            if (mat.roughnessMap) mat.roughnessMap.dispose();
            mat.dispose();
        });
    };
    
    // Return the model and its API
    return {
        group: group,
        body: body,
        top: top,
        nozzle: nozzle,
        handle: handle,
        pressureGauge: gauge,
        gaugeFace: gaugeFace,
        update: update,
        dispose: dispose,
        setColor: (color) => {
            redMaterial.color.set(color);
        },
        setMetalness: (value) => {
            redMaterial.metalness = value;
            silverMaterial.metalness = value * 3; // Keep silver shinier
        },
        setRoughness: (value) => {
            redMaterial.roughness = value;
            silverMaterial.roughness = value * 0.5; // Keep silver smoother
        },
        triggerSpray: () => {
            animationState.nozzleTargetRotation = 0.5;
            setTimeout(() => {
                animationState.nozzleTargetRotation = 0;
            }, 300);
        }
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createFireExtinguisher };
} else {
    window.createFireExtinguisher = createFireExtinguisher;
}
