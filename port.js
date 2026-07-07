// ===========================
// INIT ON LOAD
// ===========================
document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNavigation();
    initMobileMenu();
    initScrollSpy();
    initRevealAnimations();
    initPhotoReveal();
    initSkillBars();
    init3DHero();
    initModals();
});

// ===========================
// THEME TOGGLE
// ===========================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ===========================
// NAVIGATION (smooth scroll + active link)
// ===========================
function initNavigation() {
    document.querySelectorAll('.nav-link, [data-nav]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('data-section') || this.getAttribute('data-nav') || this.getAttribute('href')?.substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('.scroll-cue').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-nav');
            const target = document.getElementById(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ===========================
// MOBILE MENU
// ===========================
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('mobile-active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('mobile-active');
        });
    });
}

// ===========================
// SCROLLSPY (highlight active nav link)
// ===========================
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-section') === id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
}

// ===========================
// SCROLL REVEAL ANIMATIONS
// ===========================
function initRevealAnimations() {
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                if (entry.target.closest('#skills')) {
                    animateSkillBars();
                }
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
}

function initPhotoReveal() {
    const photoEls = document.querySelectorAll('.about-photo-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    photoEls.forEach(el => observer.observe(el));
}

// ===========================
// SKILL BARS
// ===========================
function initSkillBars() {
    document.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = '0%';
    });
}

function animateSkillBars() {
    document.querySelectorAll('.skill-row').forEach((row, index) => {
        const level = row.getAttribute('data-level');
        const fill = row.querySelector('.skill-fill');
        if (fill && level && fill.style.width === '0%') {
            setTimeout(() => { fill.style.width = level + '%'; }, index * 80);
        }
    });
}

// ===========================
// 3D HERO SCENE (Three.js)
// ===========================
function init3DHero() {
    const container = document.getElementById('hero3d');
    if (!container || typeof THREE === 'undefined') return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Wireframe icosahedron — represents structured complexity / neural geometry
    const geometry = new THREE.IcosahedronGeometry(1.9, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF6B35,
        wireframe: true,
        transparent: true,
        opacity: 0.85
    });
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    scene.add(wireMesh);

    // Inner solid faint shape for depth
    const innerGeometry = new THREE.IcosahedronGeometry(2.15, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x4DD9FF,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Particle points around the shape
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const radius = 3.5 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xFF8C42,
        size: 0.035,
        transparent: true,
        opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Mouse-reactive rotation target
    let targetRotX = 0, targetRotY = 0;
    let mouseActive = false;

    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;
        mouseActive = true;
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        targetRotY = x * 0.5;
        targetRotX = y * 0.3;
    });

    let autoRotation = 0;

    function animate() {
        requestAnimationFrame(animate);

        autoRotation += 0.0018;

        // Blend auto-rotation with mouse-reactive tilt
        wireMesh.rotation.y = autoRotation + (mouseActive ? targetRotY : 0);
        wireMesh.rotation.x = (mouseActive ? targetRotX : 0) + Math.sin(autoRotation) * 0.1;

        innerMesh.rotation.copy(wireMesh.rotation);

        particles.rotation.y -= 0.0006;
        particles.rotation.x += 0.0003;

        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // Pause render loop when tab hidden (performance)
    document.addEventListener('visibilitychange', () => {
        renderer.domElement.style.display = document.hidden ? 'none' : 'block';
    });
}

// ===========================
// MODALS (certificate + blog)
// ===========================
function initModals() {
    document.querySelectorAll('[id^="certificateModal-"]').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                const id = this.id.replace('certificateModal-', '');
                closeCertificateModal(id);
            }
        });
    });

    document.querySelectorAll('.blog-modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                const id = this.id.replace('blogModal-', '');
                closeBlogModal(id);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('[id^="certificateModal-"].active').forEach(modal => {
                closeCertificateModal(modal.id.replace('certificateModal-', ''));
            });
            document.querySelectorAll('.blog-modal.active').forEach(modal => {
                const id = modal.id.replace('blogModal-', '');
                closeBlogModal(id);
            });
        }
    });
}

function openCertificateModal(id) {
    document.getElementById('certificateModal-' + id).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCertificateModal(id) {
    document.getElementById('certificateModal-' + id).classList.remove('active');
    document.body.style.overflow = '';
}

function openBlogModal(id) {
    const modal = document.getElementById('blogModal-' + id);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBlogModal(id) {
    const modal = document.getElementById('blogModal-' + id);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

console.log('%c👋 Welcome to Ebube\'s Portfolio', 'color: #FF6B35; font-size: 18px; font-weight: bold;');