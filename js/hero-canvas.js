/**
 * YogSpace — Three.js 3D Hero Canvas Background (White Minimalist Theme)
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene Setup
    const scene = new THREE.Scene();

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 7;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // 1. Central Floating Geometric Core (Wireframe Icosahedron + TorusKnot)
    const coreGroup = new THREE.Group();

    // Outer Wireframe Icosahedron (Slate Dark)
    const geoOuter = new THREE.IcosahedronGeometry(2.2, 1);
    const matOuter = new THREE.MeshBasicMaterial({
        color: 0x0F172A,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const meshOuter = new THREE.Mesh(geoOuter, matOuter);
    coreGroup.add(meshOuter);

    // Inner Core (Subtle Royal Blue / Dark Slate)
    const geoInner = new THREE.TorusKnotGeometry(1.1, 0.3, 80, 14);
    const matInner = new THREE.MeshBasicMaterial({
        color: 0x0052FF,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const meshInner = new THREE.Mesh(geoInner, matInner);
    coreGroup.add(meshInner);

    scene.add(coreGroup);

    // 2. Subtle Dark Floating Particle Grid
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;     // X
        positions[i + 1] = (Math.random() - 0.5) * 20; // Y
        positions[i + 2] = (Math.random() - 0.5) * 16; // Z
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create Particle Canvas Texture for White Background
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 16;
    particleCanvas.height = 16;
    const ctx = particleCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.5)');
    grad.addColorStop(0.5, 'rgba(0, 82, 255, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(8, 8, 8, 0, Math.PI * 2);
    ctx.fill();

    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMat = new THREE.PointsMaterial({
        size: 0.14,
        map: particleTexture,
        transparent: true,
        depthWrite: false,
        opacity: 0.5
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Tracking for Parallax Reaction
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - windowHalfX) * 0.0012;
        targetY = (e.clientY - windowHalfY) * 0.0012;
    }, { passive: true });

    // Clock & Visibility Observer Optimization
    const clock = new THREE.Clock();
    let isCanvasVisible = true;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isCanvasVisible = entry.isIntersecting;
            });
        }, { threshold: 0.05 });
        observer.observe(canvas);
    }

    // Animation Render Loop
    function animate() {
        requestAnimationFrame(animate);

        if (!isCanvasVisible) return;

        const elapsedTime = clock.getElapsedTime();

        // Rotate Geometry Core
        meshOuter.rotation.x = elapsedTime * 0.1;
        meshOuter.rotation.y = elapsedTime * 0.15;

        meshInner.rotation.x = -elapsedTime * 0.2;
        meshInner.rotation.z = elapsedTime * 0.15;

        // Rotate Particle System
        particleSystem.rotation.y = elapsedTime * 0.02;

        // Smooth Mouse Parallax Lag
        coreGroup.rotation.y += (targetX - coreGroup.rotation.y) * 0.05;
        coreGroup.rotation.x += (targetY - coreGroup.rotation.x) * 0.05;

        // Subtle Floating Bobbing
        coreGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.2;

        renderer.render(scene, camera);
    }
    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
});
