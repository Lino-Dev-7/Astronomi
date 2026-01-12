const planetData = {
    Matahari: {
        color: '#ffd700',
        system: "Bintang kami adalah bola plasma raksasa. Tanpa Matahari, tidak akan ada kehidupan di Bumi! Suhunya mencapai 15 juta derajat Celsius di intinya.",
        encyclopedia: "Matahari menyumbang 99.86% dari total massa tata surya. Cahayanya butuh 8 menit untuk sampai ke Bumi. Jangan pernah menatap langsung ke Matahari!",
        structure: "Inti -> Zona Radiasi -> Zona Konveksi -> Fotosfer -> Kromosfer -> Korona.",
        scale: 1, // Sun doesn't zoom
        period: 0 // Stationary
    },
    Merkurius: {
        color: '#a9a9a9',
        system: "Planet terkecil dan terdekat dengan Matahari. Merkurius tidak punya atmosfer, jadi suhunya ekstrem: sangat panas di siang hari, sangat dingin di malam hari.",
        encyclopedia: "Merkurius memiliki banyak kawah seperti Bulan. Satu tahun di sini hanya 88 hari Bumi, tapi satu hari di sana sangat lama (59 hari Bumi!).",
        structure: "Inti besi besar (85% radius) -> Mantel batuan -> Kerak tipis.",
        scale: 10,
        period: 88,
        startArg: 0
    },
    Venus: {
        color: '#e3bc79',
        system: "Planet terpanas di tata surya karena efek rumah kaca yang parah. Awan tebalnya terbuat dari asam sulfat! Venus sering disebut 'Bintang Kejora'.",
        encyclopedia: "Venus berputar terbalik (retrograde) dibandingkan planet lain. Matahari terbit dari Barat di sini! Satu hari di Venus lebih lama dari satu tahunnya.",
        structure: "Inti besi -> Mantel batuan cair -> Kerak vulkanik aktif.",
        scale: 8,
        period: 225,
        startArg: 45
    },
    Bumi: {
        color: '#4facfe',
        system: "Rumah kita! Satu-satunya planet yang diketahui memiliki kehidupan. 70% permukaannya tertutup air, yang membuatnya terlihat biru indah dari angkasa.",
        encyclopedia: "Bumi punya satu satelit alami: Bulan. Atmosfer kita melindungi dari meteor dan radiasi matahari. Kita berada di 'Goldilocks Zone' (tidak terlalu panas/dingin).",
        structure: "Inti dalam padat -> Inti luar cair -> Mantel -> Kerak benua & samudera.",
        scale: 6,
        period: 365.25,
        startArg: 90
    },
    Mars: {
        color: '#ff5f6d',
        system: "Planet Merah. Warnanya berasal dari besi berkarat di tanahnya. Mars punya gunung tertinggi di tata surya (Olympus Mons) dan badai debu raksasa.",
        encyclopedia: "Mars adalah target utama pencarian kehidupan asing. Punya dua bulan kecil: Phobos dan Deimos. Ilmuwan berencana mengirim manusia ke sini!",
        structure: "Inti besi sulfida -> Mantel silikat -> Kerak batuan beku tebal.",
        scale: 7,
        period: 687,
        startArg: 135
    },
    Jupiter: {
        color: '#d4a373',
        system: "Raja Planet! Planet terbesar ini adalah bola gas raksasa. Jupiter punya 'Bintik Merah Raksasa', yaitu badai abadi yang lebih besar dari Bumi.",
        encyclopedia: "Jupiter punya lebih dari 79 bulan! Ganymede adalah bulan terbesarnya. Gravitasi Jupiter sangat kuat, melindungi Bumi dari banyak komet.",
        structure: "Inti batuan (mungkin) -> Hidrogen metalik -> Hidrogen molekuler -> Atmosfer berawan.",
        scale: 4,
        period: 4333, // ~12 years
        startArg: 180
    },
    Saturnus: {
        color: '#f4e4ba',
        system: "Permata Tata Surya. Terkenal dengan cincin indahnya yang terbuat dari es dan batu. Meski besar, Saturnus sangat ringan—bisa mengapung di air!",
        encyclopedia: "Cincin Saturnus sangat lebar tapi tipis. Punya bulan bernama Titan yang memiliki atmosfer tebal dan danau metana. Sangat misterius!",
        structure: "Inti batuan -> Hidrogen metalik -> Lapisan hidrogen/helium cair.",
        scale: 4,
        period: 10759, // ~29 years
        startArg: 225
    },
    Uranus: {
        color: '#7de2f0',
        system: "Planet Es Raksasa. Uranus unik karena berputar miring (menggelinding) di orbitnya. Warnanya biru pucat karena gas metana di atmosfernya.",
        encyclopedia: "Suhu di sini sangat dingin (-224°C). Angin di Uranus sangat kencang. Ditemukan menggunakan teleskop pada tahun 1781.",
        structure: "Inti batuan -> Mantel es (air, amonia, metana) -> Atmosfer H/He/Metana.",
        scale: 5,
        period: 30687, // ~84 years
        startArg: 270
    },
    Neptunus: {
        color: '#5b6cf9',
        system: "Planet terjauh dari Matahari. Sangat dingin, gelap, dan berangin kencang. Neptunus adalah kembaran Uranus tapi lebih berat dan biru.",
        encyclopedia: "Satu tahun di Neptunus = 165 tahun Bumi! Punya bulan Triton yang menyemburkan nitrogen beku seperti geyser.",
        structure: "Mirip Uranus: Inti -> Mantel Es -> Atmosfer badai aktif.",
        scale: 5,
        period: 60190, // ~165 years
        startArg: 315
    }
};

/* --- TIME SIMULATION ENGINE (Level 280) --- */
class TimeMachine {
    constructor(onUpdate) {
        this.J2000 = new Date('2000-01-01T12:00:00Z').getTime();
        this.currentDate = new Date();
        this.isPlaying = true;
        this.speedLevel = 0; // 0=1x, 1=Day, 2=Week, 3=Month
        this.speeds = [1, 24 * 60 * 60, 7 * 24 * 60 * 60, 30 * 24 * 60 * 60]; // Multipliers relative to real-time (1000ms/sec) -> accelerated
        // Actually, let's simplify: 
        // Lvl 0: Real Time (1 sec = 1 sim sec)
        // Lvl 1: 1 sec = 1 day
        // Lvl 2: 1 sec = 1 week
        this.speedMultipliers = [1, 86400, 604800];

        this.onUpdate = onUpdate; // Callback to UI
        this.lastFrameTime = performance.now();
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        return this.isPlaying;
    }

    setSpeed() {
        this.speedLevel = (this.speedLevel + 1) % this.speedMultipliers.length;
        return this.speedLevel; // 0, 1, 2
    }

    setDate(year) {
        // Keep month/day, change year
        this.currentDate.setFullYear(year);
    }

    resetToNow() {
        this.currentDate = new Date();
    }

    addMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    }

    tick() {
        const now = performance.now();
        const dt = (now - this.lastFrameTime) / 1000; // Seconds elapsed
        this.lastFrameTime = now;

        if (this.isPlaying) {
            // Advance time
            const speed = this.speedMultipliers[this.speedLevel];
            // Add (dt * speed) seconds to current date
            this.currentDate.setTime(this.currentDate.getTime() + (dt * speed * 1000));
        }

        // Callback for UI updates
        if (this.onUpdate) this.onUpdate(this.currentDate);
    }

    getPlanetAngle(planetName) {
        const p = planetData[planetName];
        if (!p || p.period === 0) return 0; // Sun

        // Epoch Calculation
        const msSinceEpoch = this.currentDate.getTime() - this.J2000;
        const daysSinceEpoch = msSinceEpoch / (1000 * 60 * 60 * 24);

        // Angle = (Days / Period) * 360 + StartOffset
        const angle = ((daysSinceEpoch / p.period) % 1) * 360 + (p.startArg || 0);
        return angle;
    }
}

class SolarSystemApp {
    constructor() {
        this.activePlanet = null;
        this.container = document.querySelector('.solar-system');
        this.fullContainer = document.querySelector('#solar-system-container');
        this.state = 'SYSTEM'; // 'SYSTEM' or 'FOCUS'
        this.currentData = null;
        this.init();

        // Initialize Time Machine
        this.timeMachine = new TimeMachine((date) => this.updateTimeUI(date));
        this.initTimeControls();

        // Start Render Loop
        this.animate();
    }

    init() {
        // Create Stars
        this.createStars();

        // Event Listeners for Planets
        document.querySelectorAll('.planet, .sun').forEach(el => {
            el.addEventListener('click', (e) => {
                const name = el.getAttribute('data-name');
                // Sun is now clickable!
                this.focusOnPlanet(el, name);
                e.stopPropagation();
            });
        });

        // HUD: Back Button
        document.getElementById('btn-back').addEventListener('click', () => {
            this.returnToSystem();
        });

        // HUD: Tabs
        document.querySelectorAll('.hud-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab, btn);
            });
        });

        // "Start Adventure" Button
        document.getElementById('start-btn').addEventListener('click', () => {
            document.body.classList.add('explore-mode');
        });

        // "Settings" Button (Placeholder)
        document.getElementById('settings-btn').addEventListener('click', () => {
            alert("Fitur Pengaturan akan segera hadir! 🛠️");
        });

        // Optional: Press ESC to return to Menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('explore-mode')) {
                if (this.state === 'FOCUS') {
                    this.returnToSystem();
                } else {
                    document.body.classList.remove('explore-mode');
                }
            }
        });
    }

    initTimeControls() {
        const playBtn = document.getElementById('time-play');
        const speedBtn = document.getElementById('time-speed');
        const slider = document.getElementById('time-slider');

        playBtn.addEventListener('click', () => {
            const playing = this.timeMachine.togglePlay();
            playBtn.textContent = playing ? "⏯️" : "▶️";
        });

        speedBtn.addEventListener('click', () => {
            const level = this.timeMachine.setSpeed();
            const labels = ["1x Speed", "1 Day/s", "1 Week/s"];
            speedBtn.textContent = labels[level];
        });

        document.getElementById('time-prev').addEventListener('click', () => this.timeMachine.addMonth(-1));
        document.getElementById('time-next').addEventListener('click', () => this.timeMachine.addMonth(1));
        document.getElementById('time-reset').addEventListener('click', () => this.timeMachine.resetToNow());

        slider.addEventListener('input', (e) => {
            this.timeMachine.setDate(parseInt(e.target.value));
        });
    }

    updateTimeUI(date) {
        // Format Date
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('current-date').textContent = date.toLocaleDateString('id-ID', options);
        document.getElementById('current-time').textContent = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        // Sync Slider if year changed externally (by ticking)
        const slider = document.getElementById('time-slider');
        if (document.activeElement !== slider) {
            slider.value = date.getFullYear();
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update Time Logic
        this.timeMachine.tick();

        // Update Planetary Positions (Physics Engine)
        // Only update rotation angles if we are NOT in focus mode (or maybe keep them moving?)
        // Let's keep them moving for realism, but maybe slower?
        // Actually, just update them. The CSS transform for focus will handle the Camera.
        // BUT wait, if we manually rotate .orbit via JS, we might conflict with CSS transforms.
        // Solution: Rotate the ORBIT element.

        const planets = ['Merkurius', 'Venus', 'Bumi', 'Mars', 'Jupiter', 'Saturnus', 'Uranus', 'Neptunus'];
        const englishMap = { 'Merkurius': 'mercury', 'Venus': 'venus', 'Bumi': 'earth', 'Mars': 'mars', 'Jupiter': 'jupiter', 'Saturnus': 'saturn', 'Uranus': 'uranus', 'Neptunus': 'neptune' };

        planets.forEach(pName => {
            const angle = this.timeMachine.getPlanetAngle(pName);
            const className = englishMap[pName];
            const orbitEl = document.querySelector(`.orbit-${className}`);

            if (orbitEl) {
                // Apply rotation
                // Note: We need to preserve the centering translate(-50%, -50%)
                orbitEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

                // Counter-rotate the planet so it stays upright?
                // Not strictly necessary for spheres, but good for icons.
                // Our planets are divs with shadows, rotation matters for lighting (shadow should stay opposite sun).
                // If orbit rotates, planet rotates with it.
                // To keep shadow correct relative to Sun (center), we actually want the planet to NOT rotate locally relative to the Sun vector.
                // The current CSS `rotate` on orbit does this naturally.
                // However, the Planet div itself might have `transform: translate(-50%, -50%)`
                // Let's just rotate the orbit container.
            }
        });

    }

    focusOnPlanet(element, name) {
        if (this.state === 'FOCUS') return;
        this.state = 'FOCUS';
        this.activePlanet = element;
        const data = planetData[name];

        document.body.classList.add('view-focus');
        this.container.classList.add('paused');
        // Note: 'paused' class used to pause CSS animation. 
        // With JS engine, we might want to pause TimeMachine or just let it run?
        // Let's PAUSE time when focusing to read.
        this.timeMachine.isPlaying = false;
        document.getElementById('time-play').textContent = "▶️"; // Show play button state

        // Add highlight classes
        element.classList.add('focused-planet');
        element.parentElement.classList.add('focused-orbit');

        // Update HUD
        this.updateHUD(name, data);
        
    

        // Show HUD with animation
        const hud = document.getElementById('planet-hud');
        hud.classList.remove('hidden');
        // Force reflow
        void hud.offsetWidth;
        hud.classList.add('active');

        // Cinematic Zoom Math (Same as before)
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        const containerCenter = { x: viewportW / 2, y: viewportH / 2 };
        const isMobile = viewportW < 768;
        const targetX = isMobile ? viewportW * 0.5 : viewportW * 0.75;
        const targetY = isMobile ? viewportH * 0.35 : viewportH * 0.5;

        // We need the Current Position of the Planet *after* JS rotation
        const rect = element.getBoundingClientRect();
        const planetCenterX = rect.left + rect.width / 2;
        const planetCenterY = rect.top + rect.height / 2;

        const vecX = planetCenterX - containerCenter.x;
        const vecY = planetCenterY - containerCenter.y;
        const scale = data.scale || 5;

        const predictedX = containerCenter.x + (vecX * scale);
        const predictedY = containerCenter.y + (vecY * scale);

        const translateX = targetX - predictedX;
        const translateY = targetY - predictedY;

        this.container.style.transformOrigin = 'center center';
        this.container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    returnToSystem() {
        this.state = 'SYSTEM';
        const hud = document.getElementById('planet-hud');
        hud.classList.remove('active');

        // Reset Transform
        this.container.style.transform = `translate(0, 0) scale(1)`;

        setTimeout(() => {
            hud.classList.add('hidden');
            document.body.classList.remove('view-focus');
            this.container.classList.remove('paused');

            // Resume Time? Maybe not auto-resume, let user decide.
            // Or auto-resume if it was playing before?
            // Simple UX: Auto-resume.
            this.timeMachine.isPlaying = true;
            document.getElementById('time-play').textContent = "⏯️";

            if (this.activePlanet) {
                this.activePlanet.classList.remove('focused-planet');
                this.activePlanet.parentElement.classList.remove('focused-orbit');
                this.activePlanet = null;
            }
        }, 1000);
    }

    updateHUD(planetName, data) {
        document.getElementById('hud-planet-name').textContent = planetName;
        document.getElementById('hud-planet-name').style.color = data.color || 'white';
        document.querySelectorAll('.hud-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.hud-btn[data-tab="system"]').classList.add('active');

        this.currentData = data;
        const descBox = document.getElementById('hud-description');
        descBox.textContent = "";
        this.typeWriter(data.system, descBox);
    }

    switchTab(tabName, btnElement) {
        document.querySelectorAll('.hud-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
        const text = this.currentData[tabName];
        const descBox = document.getElementById('hud-description');
        descBox.textContent = "";
        this.typeWriter(text, descBox);
    }

    typeWriter(text, element) {
        let i = 0;
        element.innerHTML = "";
        const speed = 20;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    createStars() {
        const starContainer = document.querySelector('.stars');
        if (!starContainer) return;

        // Generate 200 random stars
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.className = 'star';

            // Random Position
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            // Random Size
            const size = Math.random() * 2 + 1; // 1px to 3px

            // Random Opacity/Delay
            const delay = Math.random() * 5;

            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.background = 'white';
            star.style.position = 'absolute';
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.borderRadius = '50%';
            star.style.opacity = Math.random();
            star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite ${delay}s`;

            starContainer.appendChild(star);
        }
    }
}

/* --- VISUAL & AUDIO POLISH MANAGER (Level 400 - Add Only) --- */
class PolishManager {
    constructor() {
        this.soundEnabled = localStorage.getItem('astroSound') !== 'false';
        this.visualViewport = document.getElementById('visual-viewport');
        this.audioCtx = null; // Lazy init
        this.init();
    }

    init() {
        // 1. No Preload Needed (Web Audio API)

        // 2. Event Delegation
        document.body.addEventListener('click', (e) => {
            // Unlock AudioContext on first interact
            if (!this.audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioContext();
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            this.handleGlobalClick(e);
        }, true); // Use Capture to catch events before stopPropagation (like on planets)

        // 3. Update Toggle Icon State
        this.updateToggleIcon();

        // 4. Initial Drift Check
        if (document.body.classList.contains('explore-mode')) {
            this.setDrift(true);
        }
    }

    handleGlobalClick(e) {
        const target = e.target;

        // Toggle Button
        if (target.closest('#sound-toggle')) {
            this.toggleSound();
            this.play('click');
            return;
        }

        // Play Button (Start)
        if (target.closest('#start-btn')) {
            this.play('click');
            this.setDrift(true);
        }

        // Back Button
        if (target.closest('#btn-back')) {
            this.play('back');
            this.setDrift(true);
        }

        // Planet Click
        if (target.closest('.planet') || target.closest('.sun')) {
            // Check if not already focused?
            // The logic runs nicely: click planet -> zoom.
            this.play('zoom');
            this.setDrift(false);
        }

        // Time Controls
        if (target.closest('.time-btn') || target.closest('#back-to-menu-btn')) {
            this.play('click');
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('astroSound', this.soundEnabled);
        this.updateToggleIcon();
    }

    updateToggleIcon() {
        const btn = document.getElementById('sound-toggle');
        if (btn) {
            btn.textContent = this.soundEnabled ? "🔊" : "🔇";
            btn.classList.toggle('muted', !this.soundEnabled);
        }
    }

    play(key) {
        if (!this.soundEnabled) return;
        if (!this.audioCtx) return;

        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        // Simple synth routing
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (key === 'click' || key === 'tick') {
            // High-tech blip
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (key === 'zoom') {
            // Warp drive engage
            osc.type = 'sine';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 1.0);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 1.0);
            osc.start(now);
            osc.stop(now + 1.0);
        } else if (key === 'back') {
            // Warp down
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    }

    setDrift(enable) {
        if (this.visualViewport) {
            if (enable) {
                this.visualViewport.classList.add('camera-drift');
            } else {
                this.visualViewport.classList.remove('camera-drift');
            }
        }
    }
}

// Instantiate Polish Manager
window.addEventListener('DOMContentLoaded', () => {
    window.app = new SolarSystemApp(); // Restore App Instantiation
    window.polish = new PolishManager();
});

/* --- UX ENHANCEMENTS MANAGER (Level 500 - Add Only) --- */
(function () {
    window.addEventListener('load', () => {
        const app = window.app;
        if (!app) return;

        // --- 1. Year Speed Preset ---
        const timeControls = document.getElementById('time-controls');
        if (timeControls) {
            const yearBtn = document.createElement('button');
            yearBtn.id = 'time-speed-year';
            yearBtn.className = 'time-btn';
            yearBtn.textContent = '1 Year/s';
            yearBtn.title = 'Sangat Cepat (1 Tahun per Detik)';

            // Inject after the existing speed button
            const speedBtn = document.getElementById('time-speed');
            if (speedBtn && speedBtn.nextSibling) {
                timeControls.insertBefore(yearBtn, speedBtn.nextSibling);
            } else {
                timeControls.appendChild(yearBtn);
            }

            // 1 year in seconds = 365.25 * 24 * 3600
            const YEAR_MULT = 31557600;
            app.timeMachine.speedMultipliers.push(YEAR_MULT);
            const yearIdx = app.timeMachine.speedMultipliers.length - 1;

            yearBtn.addEventListener('click', () => {
                app.timeMachine.speedLevel = yearIdx;
                document.getElementById('time-speed').textContent = "1 Year/s";
                if (window.polish) window.polish.play('click');
            });
        }

        // --- 2. Vertical Panning (Desktop) ---
        let currentYOffset = 0;
        const container = document.getElementById('solar-system-container');

        window.addEventListener('wheel', (e) => {
            if (!document.body.classList.contains('explore-mode')) return;
            if (document.body.classList.contains('view-focus')) return;
            if (window.innerWidth < 768) return;

            e.preventDefault();
            const delta = e.deltaY;
            currentYOffset -= delta * 0.5;

            const limit = 400;
            currentYOffset = Math.max(-limit, Math.min(limit, currentYOffset));

            container.style.setProperty('--system-y-offset', `${currentYOffset}px`);
        }, { passive: false });
    });
})();

/* --- CORRECTIVE FIXES MANAGER (Add-Only) --- */
(function () {
    window.addEventListener('load', () => {
        const app = window.app;
        if (!app) return;

        // 1. Refined Sun Structure Data (Matches HUD name)
        // Note: The previous block used "Matahari", ensure it matches
        const SUN_LAYERS = [
            { name: 'Inti Plasma', size: 25, color: '#ffff00', desc: 'Zona fusi termonuklir.' },
            { name: 'Zona Radiasi', size: 50, color: '#ffcc00', desc: 'Transfer energi via foton.' },
            { name: 'Zona Konveksi', size: 75, color: '#ff9900', desc: 'Arus gas panas naik-turun.' },
            { name: 'Fotosfer', size: 90, color: '#ff6600', desc: 'Permukaan cahaya Matahari.' },
            { name: 'Korona', size: 110, color: 'rgba(255, 255, 255, 0.3)', desc: 'Atmosfer luar yang sangat panas.' }
        ];

        // 2. Click Interceptor for Alignment Reset
        document.body.addEventListener('click', (e) => {
            const clickable = e.target.closest('.planet, .sun');
            if (clickable) {
                // Smoothly reset the vertical pan before zoom math runs
                const container = document.getElementById('solar-system-container');
                if (container) {
                    container.style.setProperty('--system-y-offset', '0px');
                    // We also need to update the local variable in the existing IIFE
                    // But we can't directly. However, resetting the CSS variable 
                    // ensures bBox and positioning are correct relative to the screen.
                }
            }
        }, true); // Capture mode to run BEFORE existing zoom click listeners

        // 3. Toggle Show-Structure Class
        const hudMenu = document.querySelector('.hud-menu');
        if (hudMenu) {
            hudMenu.addEventListener('click', (e) => {
                const btn = e.target.closest('.hud-btn');
                if (!btn) return;

                const tab = btn.getAttribute('data-tab');
                const activePlanet = app.activePlanet;
                if (!activePlanet) return;

                if (tab === 'structure') {
                    activePlanet.classList.add('show-structure');
                } else {
                    activePlanet.classList.remove('show-structure');
                }
            });
        }

        // 4. Cleanup on Back
        const backBtn = document.getElementById('btn-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (app.activePlanet) app.activePlanet.classList.remove('show-structure');
            });
        }
    });
})();



/* --- PLANET STRUCTURE MANAGER (Level 600 - Add Only) --- */
(function () {
    const STRUCTURE_DATA = {
        'Matahari': [
            { name: 'Inti Plasma', size: 30, color: '#ffff00', desc: 'Suhu 15 juta°C, tempat fusi nuklir.' },
            { name: 'Zona Radiasi', size: 65, color: '#ffaa00', desc: 'Energi butuh ribuan tahun untuk lewat.' },
            { name: 'Zona Konveksi', size: 90, color: '#ff5500', desc: 'Arus gas panas naik ke permukaan.' },
            { name: 'Fotosfer', size: 100, color: '#ffcc00', desc: 'Permukaan yang kita lihat.' }
        ],
        'Merkurius': [
            { name: 'Inti Besi', size: 75, color: '#444', desc: 'Sangat besar, kaya akan besi.' },
            { name: 'Mantel Batuan', size: 90, color: '#777', desc: 'Lapisan silikat padat.' },
            { name: 'Kerak', size: 100, color: '#aaa', desc: 'Penuh dengan kawah meteor.' }
        ],
        'Venus': [
            { name: 'Inti Logam', size: 40, color: '#8b4513', desc: 'Inti besi dan nikel.' },
            { name: 'Mantel Batuan', size: 90, color: '#cd853f', desc: 'Batuan cair panas.' },
            { name: 'Kerak', size: 100, color: '#deb887', desc: 'Kerak silikat yang tebal.' }
        ],
        'Bumi': [
            { name: 'Inti Dalam', size: 20, color: '#ff0000', desc: 'Besi padat yang sangat panas.' },
            { name: 'Inti Luar', size: 45, color: '#ff8c00', desc: 'Logam cair yang berputar.' },
            { name: 'Mantel', size: 96, color: '#e67e22', desc: 'Lapisan batuan semi-cair.' },
            { name: 'Kerak', size: 100, color: '#3498db', desc: 'Tempat kita tinggal.' }
        ],
        'Mars': [
            { name: 'Inti Besi', size: 45, color: '#5d3a1a', desc: 'Mungkin mengandung sulfur.' },
            { name: 'Mantel', size: 90, color: '#a0522d', desc: 'Silikat yang kaku.' },
            { name: 'Kerak', size: 100, color: '#c0392b', desc: 'Warna merah karena karat.' }
        ],
        'Jupiter': [
            { name: 'Inti Batuan', size: 15, color: '#4d4d4d', desc: 'Inti padat seukuran Bumi.' },
            { name: 'Hidrogen Metalik', size: 70, color: '#bdc3c7', desc: 'Hidrogen yang bersifat logam.' },
            { name: 'Hidrogen Gas', size: 95, color: '#d35400', desc: 'Lapisan gas raksasa.' },
            { name: 'Atmosfer', size: 100, color: '#f39c12', desc: 'Awan gas yang badai.' }
        ],
        'Saturnus': [
            { name: 'Inti Padat', size: 20, color: '#555', desc: 'Logam dan batuan.' },
            { name: 'Es & Hidrogen', size: 80, color: '#ecf0f1', desc: 'Lapisan dingin yang tebal.' },
            { name: 'Atmosfer', size: 100, color: '#f1c40f', desc: 'Awan ammonia.' }
        ],
        'Uranus': [
            { name: 'Inti Batuan', size: 25, color: '#34495e', desc: 'Inti kecil yang dingin.' },
            { name: 'Mantel Es', size: 85, color: '#1abc9c', desc: 'Campuran air, metana, amonia.' },
            { name: 'Atmosfer', size: 100, color: '#2ecc71', desc: 'Gas metana biru.' }
        ],
        'Neptunus': [
            { name: 'Inti Batuan', size: 25, color: '#2c3e50', desc: 'Sama seperti Uranus.' },
            { name: 'Mantel Es', size: 85, color: '#2980b9', desc: 'Es raksasa di bawah badai.' },
            { name: 'Atmosfer', size: 100, color: '#3498db', desc: 'Atmosfer sangat berangin.' }
        ]
    };

    let tooltip = null;

    function initTooltip() {
        tooltip = document.createElement('div');
        tooltip.className = 'layer-tooltip';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);
    }

    function createStructure(planetEl, planetName) {
        // Clear any existing wrapper
        let old = planetEl.querySelector('.planet-structure-wrapper');
        if (old) old.remove();

        const data = STRUCTURE_DATA[planetName];
        if (!data) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'planet-structure-wrapper';

        // Reverse array to build from outer to inner for better stacking (or inner to outer)
        // Let's build from outer to inner so inner ones are on top
        const reversedData = [...data].reverse();

        reversedData.forEach(layer => {
            const div = document.createElement('div');
            div.className = 'structure-layer';
            div.style.width = layer.size + '%';
            div.style.height = layer.size + '%';
            div.style.backgroundColor = layer.color;
            div.style.color = layer.color; // for currentColor shadow

            div.addEventListener('mouseenter', (e) => {
                if (!tooltip) return;
                tooltip.textContent = `${layer.name}: ${layer.desc}`;
                tooltip.style.display = 'block';
            });

            div.addEventListener('mousemove', (e) => {
                if (!tooltip) return;
                tooltip.style.left = e.clientX + 'px';
                tooltip.style.top = e.clientY + 'px';
            });

            div.addEventListener('mouseleave', () => {
                if (tooltip) tooltip.style.display = 'none';
            });

            wrapper.appendChild(div);
        });

        planetEl.appendChild(wrapper);
        return wrapper;
    }

    function handleTabClick(btn) {
        const tab = btn.getAttribute('data-tab');
        const app = window.app;
        if (!app || !app.activePlanet) return;

        const currentPlanetName = document.getElementById('hud-planet-name').textContent;
        const wrapper = createStructure(app.activePlanet, currentPlanetName);

        if (tab === 'structure' && wrapper) {
            // Delay slightly for smooth transition
            setTimeout(() => wrapper.classList.add('active'), 50);
        } else {
            // Hide all structure wrappers
            document.querySelectorAll('.planet-structure-wrapper').forEach(w => w.classList.remove('active'));
        }
    }

    window.addEventListener('load', () => {
        initTooltip();

        // Listen for Tab Clicks via delegating on the HUD menu
        const hudMenu = document.querySelector('.hud-menu');
        if (hudMenu) {
            hudMenu.addEventListener('click', (e) => {
                const btn = e.target.closest('.hud-btn');
                if (btn) handleTabClick(btn);
            });
        }

        // Listen for Back Button to clear overlay
        const backBtn = document.getElementById('btn-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                document.querySelectorAll('.planet-structure-wrapper').forEach(w => w.classList.remove('active'));
            });
        }

        // Listen for ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
            document.querySelectorAll('.planet-structure-wrapper').forEach(w => w.classList.remove('active'));
            
        
           }
        });
    });
})();

/* --- CYBER-SCIFI HUD MANAGER (Level 700 - Add Only) --- */
(function () {
    const CYBER_DATA = {
        'Matahari': { subtitle: "BINTANG KERDIL", stats: [{ label: "Diameter", value: "1.39 Juta km" }, { label: "Massa", value: "1.989 × 10^30 kg" }, { label: "Suhu Permukaan", value: "5,505°C" }, { label: "Gravitasi", value: "274 m/s²" }] },
        'Merkurius': { subtitle: "PLANET TERKECIL", stats: [{ label: "Diameter", value: "4,879 km" }, { label: "Jarak Matahari", value: "57.9 Juta km" }, { label: "Periode Rotasi", value: "58.6 Hari" }, { label: "Suhu (Siang)", value: "430°C" }] },
        'Venus': { subtitle: "BINTANG KEJORA", stats: [{ label: "Diameter", value: "12,104 km" }, { label: "Atmosfer", value: "96% CO2" }, { label: "Suhu Rata-rata", value: "462°C" }, { label: "Arah Rotasi", value: "Retrograde" }] },
        'Bumi': { subtitle: "PLANET KEHIDUPAN", stats: [{ label: "Diameter", value: "12,742 km" }, { label: "Populasi", value: "~8 Miliar" }, { label: "Satelit Alami", value: "1 (Bulan)" }, { label: "Periode Orbit", value: "365.25 Hari" }] },
        'Mars': { subtitle: "PLANET MERAH", stats: [{ label: "Diameter", value: "6,779 km" }, { label: "Gravitasi", value: "3.71 m/s²" }, { label: "Gunung Tertinggi", value: "Olympus Mons" }, { label: "Jarak Matahari", value: "227.9 Juta km" }] },
        'Jupiter': { subtitle: "RAKSASA GAS", stats: [{ label: "Diameter", value: "139,820 km" }, { label: "Massa", value: "317.8 x Bumi" }, { label: "Periode Rotasi", value: "9 Jam 55 Menit" }, { label: "Satelit", value: "95 (Diketahui)" }] },
        'Saturnus': { subtitle: "PERMATA TATA SURYA", stats: [{ label: "Diameter", value: "116,460 km" }, { label: "Cincin", value: "7 Kelompok Utama" }, { label: "Kepadatan", value: "< Air (Mengapung)" }, { label: "Satelit", value: "146 (Diketahui)" }] },
        'Uranus': { subtitle: "RAKSASA ES", stats: [{ label: "Diameter", value: "50,724 km" }, { label: "Suhu Terdingin", value: "-224°C" }, { label: "Kemiringan", value: "98° (Menggelinding)" }, { label: "Penemu", value: "William Herschel" }] },
        'Neptunus': { subtitle: "PLANET BIRU JAUH", stats: [{ label: "Diameter", value: "49,244 km" }, { label: "Kecepatan Angin", value: "2,100 km/h" }, { label: "Suhu Rata-rata", value: "-200°C" }, { label: "Periode Orbit", value: "165 Tahun" }] }
    };

    class CyberHUDManager {
        constructor() { this.active = false; }
        transformHUD() {
            const hudPanel = document.querySelector('.hud-left-panel');
            if (!hudPanel) return;
            const nameEl = document.getElementById('hud-planet-name');
            const name = nameEl ? nameEl.textContent.trim() : null;
            const key = Object.keys(CYBER_DATA).find(k => k.toUpperCase() === name?.toUpperCase());
            if (!key) return;
            const data = CYBER_DATA[key];
            const subtitleEl = document.querySelector('.hud-subtitle');
            if (subtitleEl) { subtitleEl.textContent = data.subtitle; subtitleEl.classList.add('cyber-subtitle'); subtitleEl.style.color = 'var(--neon-blue)'; }
            let statsContainer = document.getElementById('cyber-stats-container');
            if (!statsContainer) {
                statsContainer = document.createElement('div');
                statsContainer.id = 'cyber-stats-container';
                const menu = document.querySelector('.hud-menu');
                if (menu && menu.parentNode) { menu.parentNode.insertBefore(statsContainer, menu.nextSibling); } else { hudPanel.appendChild(statsContainer); }
            }
            statsContainer.innerHTML = `<div class="cyber-data-header">DATA STATISTIK</div><div class="cyber-stats-grid">${data.stats.map(s => `<div class="stat-row"><span class="stat-label">${s.label}</span><span class="stat-value">${s.value}</span></div>`).join('')}</div>`;
            document.querySelectorAll('.hud-btn').forEach(btn => btn.classList.add('cyber-btn'));
            hudPanel.classList.add('cyber-mode');
            if (!document.getElementById('cyber-frame-overlay')) {
                const frame = document.createElement('div');
                frame.id = 'cyber-frame-overlay';
                frame.innerHTML = `<div class="tech-corner top-left"></div><div class="tech-corner top-right"></div><div class="tech-corner bottom-left"></div><div class="tech-corner bottom-right"></div><div class="tech-line-left"></div>`;
                hudPanel.appendChild(frame);
            }
        }
    }
    window.addEventListener('load', () => {
        window.cyberHUD = new CyberHUDManager();
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'planet-hud' && mutation.target.classList.contains('active')) {
                    setTimeout(() => window.cyberHUD.transformHUD(), 50);
                }
            });
        });
        const hud = document.getElementById('planet-hud');
        if (hud) { observer.observe(hud, { attributes: true, attributeFilter: ['class'] }); }
    });
})();


/* --- ENCYCLOPEDIA CONTENT UPDATE (User Request) --- */
(function () {
    const NEW_ENCYCLOPEDIA = {
        'Matahari': `
            <h3>Matahari</h3>
            <strong>Matahari</strong> adalah bintang di pusat Tata Surya. Hampir seluruh massa Tata Surya (±99,86%) berada pada Matahari.<br><br>
            <strong>Fakta Utama:</strong>
            <ul>
                <li>Jenis: Bintang deret utama (tipe G)</li>
                <li>Diameter: ±1,39 juta km</li>
                <li>Suhu permukaan: ±5.500 °C</li>
                <li>Suhu inti: ±15 juta °C</li>
                <li>Usia: ±4,6 miliar tahun</li>
            </ul>
            <strong>Peran Matahari:</strong>
            <ul>
                <li>Sumber cahaya dan panas bagi Bumi</li>
                <li>Menjaga planet tetap pada orbitnya dengan gravitasi</li>
                <li>Menghasilkan energi lewat <strong>fusi nuklir</strong> (hidrogen → helium)</li>
            </ul>`,
        'Merkurius': `
            <h3>Merkurius</h3>
            Planet terdekat dari Matahari dan yang paling kecil.<br><br>
            <strong>Ciri Utama:</strong>
            <ul>
                <li>Tidak punya atmosfer tebal</li>
                <li>Perbedaan suhu ekstrem</li>
                <li>Banyak kawah seperti Bulan</li>
            </ul>
            <strong>Fakta Singkat:</strong>
            <ul>
                <li>Jarak dari Matahari: ±58 juta km</li>
                <li>Kala revolusi: 88 hari</li>
                <li>Kala rotasi: 59 hari</li>
            </ul>`,
        'Venus': `
            <h3>Venus</h3>
            Sering disebut <strong>kembaran Bumi</strong>, tetapi sangat tidak ramah.<br><br>
            <strong>Ciri Utama:</strong>
            <ul>
                <li>Atmosfer sangat tebal (CO₂)</li>
                <li>Efek rumah kaca ekstrem</li>
                <li>Rotasi berlawanan arah</li>
            </ul>
            <strong>Fakta Singkat:</strong>
            <ul>
                <li>Planet terpanas</li>
                <li>Suhu permukaan: ±465 °C</li>
            </ul>`,
        'Bumi': `
            <h3>Bumi</h3>
            Satu-satunya planet yang diketahui mendukung kehidupan.<br><br>
            <strong>Ciri Utama:</strong>
            <ul>
                <li>Air cair melimpah</li>
                <li>Atmosfer kaya oksigen</li>
                <li>Medan magnet pelindung</li>
            </ul>
            <strong>Fakta Singkat:</strong>
            <ul>
                <li>Jarak dari Matahari: ±150 juta km</li>
                <li>Kala revolusi: 365 hari</li>
                <li>Satelit alami: Bulan</li>
            </ul>`,
        'Mars': `
            <h3>Mars</h3>
            Dikenal sebagai <strong>Planet Merah</strong>.<br><br>
            <strong>Ciri Utama:</strong>
            <ul>
                <li>Warna merah dari oksida besi</li>
                <li>Memiliki gunung tertinggi di Tata Surya (Olympus Mons)</li>
                <li>Pernah memiliki air di masa lalu</li>
            </ul>
            <strong>Fakta Singkat:</strong>
            <ul>
                <li>Suhu dingin</li>
                <li>Target utama eksplorasi manusia</li>
            </ul>`,
        'Jupiter': `
            <h3>Jupiter</h3>
            Planet terbesar di Tata Surya.<br><br>
            <strong>Ciri Utama:</strong>
            <ul>
                <li>Raksasa gas</li>
                <li>Badai raksasa (Great Red Spot)</li>
                <li>Medan magnet sangat kuat</li>
            </ul>
            <strong>Fakta Singkat:</strong>
            <ul>
                <li>Banyak satelit (Io, Europa, Ganymede, Callisto)</li>
                <li>Massa lebih besar dari semua planet lain digabung</li>
            </ul>`,
        'Saturnus': `
            <h3>Saturnus</h3>
            Terkenal dengan <strong>cincin yang indah</strong>.<br><br>
            <strong>Ciri Utama:</strong>
            <ul>
                <li>Raksasa gas</li>
                <li>Cincin tersusun dari es dan batu</li>
            </ul>
            <strong>Fakta Singkat:</strong>
            <ul>
                <li>Massa jenis rendah</li>
                <li>Satelit terkenal: Titan</li>
            </ul>`,
        'Uranus': `
            <h3>Uranus</h3>
            Planet dengan kemiringan sumbu ekstrem.<br><br>
            <strong>Ciri Utama:</strong>
            <ul>
                <li>Berotasi seperti "menggelinding"</li>
                <li>Raksasa es</li>
            </ul>
            <strong>Fakta Singkat:</strong>
            <ul>
                <li>Warna biru kehijauan dari metana</li>
                <li>Suhu sangat dingin</li>
            </ul>`,
        'Neptunus': `
            <h3>Neptunus</h3>
            Planet terjauh dari Matahari.<br><br>
            <strong>Ciri Utama:</strong>
            <ul>
                <li>Angin tercepat di Tata Surya</li>
                <li>Raksasa es</li>
            </ul>
            <strong>Fakta Singkat:</strong>
            <ul>
                <li>Warna biru pekat</li>
                <li>Sangat dingin dan gelap</li>
            </ul>`
    };

    window.addEventListener('load', () => {
        if (!window.app) return;

        // Monkey-patch switchTab to handle HTML content for Encyclopedia
        const originalSwitchTab = window.app.switchTab;

        window.app.switchTab = function (tabName, btnElement) {
            // Standard behavior for visual feedback
            document.querySelectorAll('.hud-btn').forEach(b => b.classList.remove('active'));
            if (btnElement) btnElement.classList.add('active');

            // Override for Encyclopedia
            if (tabName === 'encyclopedia') {
                const descBox = document.getElementById('hud-description');
                // Use the new content if available, else fallback
                const name = document.getElementById('hud-planet-name').textContent.trim();

                // Try to find the key case-insensitively
                const key = Object.keys(NEW_ENCYCLOPEDIA).find(k => k.toUpperCase() === name.toUpperCase());

                if (key) {
                    descBox.innerHTML = NEW_ENCYCLOPEDIA[key];
                    // IMPORTANT: Do NOT call typeWriter, as it breaks HTML
                } else {
                    // Fallback to original if data missing
                    originalSwitchTab.call(this, tabName, btnElement);
                }
            } else {
                // Determine if we are overriding other tabs? No, keep original logic for others.
                // But we must call original correctly.
                // The original method sets active class and calls typeWriter.
                // Since we handled active class above, calling original will do it again, which is fine.
                originalSwitchTab.call(this, tabName, btnElement);
            }
        };

        // Also update initial view if needed? 
        // Initial view is 'system', which is fine.
    });
})();


/* --- TIME CONTROL LOGIC UPDATE (User Request) --- */
(function () {
    window.addEventListener('load', () => {
        const app = window.app;
        if (!app || !app.timeMachine) return;

        // 1. Redefine Speed Multipliers (Day, Week, Month, Year)
        // 1 day = 86400
        // 1 week = 604800
        // 1 month (30d) = 2592000
        // 1 year (365.25d) = 31557600
        app.timeMachine.speedMultipliers = [86400, 604800, 2592000, 31557600];

        // Reset to Index 0 (1 Hari/s default)
        app.timeMachine.speedLevel = 0;

        // 2. Override Button Logic
        const oldBtn = document.getElementById('time-speed');
        if (oldBtn) {
            // Clone to strip existing event listeners
            const newBtn = oldBtn.cloneNode(true);
            oldBtn.parentNode.replaceChild(newBtn, oldBtn);

            // Set Initial Text
            const labels = ["1 Hari/s", "1 Minggu/s", "1 Bulan/s", "1 Tahun/s"];
            newBtn.textContent = labels[0];

            // Add New Listener
            newBtn.addEventListener('click', () => {
                // Cycle Speed
                app.timeMachine.setSpeed(); // Increases level % length

                // Update Text
                const level = app.timeMachine.speedLevel;
                newBtn.textContent = labels[level];

                // Check for fast speed to add visual effect?
                if (level === 3 && window.polish) {
                    window.polish.play('click');
                    // Add a tiny bit of drift or shake maybe?
                } else if (window.polish) {
                    window.polish.play('click');
                }
            });
        }
    });
})();


/* --- TIME SPEED BUTTON UPDATE (User Request) --- */
(function () {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const app = window.app;
            if (!app || !app.timeMachine) return;

            // 1. Hide the separate Year button if it exists
            const yearBtn = document.getElementById('time-speed-year');
            if (yearBtn) {
                yearBtn.style.display = 'none';
            }

            // 2. Redefine Speed Multipliers (Day, Week, Month, Year)
            // Day = 86400, Week = 604800, Month (30d) = 2592000, Year (365.25d) = 31557600
            app.timeMachine.speedMultipliers = [86400, 604800, 2592000, 31557600];
            app.timeMachine.speedLevel = 0; // Default: 1 Day/s

            // 3. Update Main Button Logic
            const oldBtn = document.getElementById('time-speed');
            if (oldBtn) {
                // Clone to remove existing listeners
                const newBtn = oldBtn.cloneNode(true);
                oldBtn.parentNode.replaceChild(newBtn, oldBtn);

                // Set Initial Text
                const labels = ["1 Hari/s", "1 Minggu/s", "1 Bulan/s", "1 Tahun/s"];
                newBtn.textContent = labels[0];

                // Add New Listener
                newBtn.addEventListener('click', () => {
                    // Cycle: 0 -> 1 -> 2 -> 3 -> 0
                    app.timeMachine.speedLevel = (app.timeMachine.speedLevel + 1) % app.timeMachine.speedMultipliers.length;

                    // Update Text
                    newBtn.textContent = labels[app.timeMachine.speedLevel];

                    // Optional: Visual Feedback
                    if (window.polish) window.polish.play('click');
                });
            }
        }, 100); // Slight delay to ensure UX Manager has run
    });
})();


/* --- REAL-TIME DEFAULT UPDATE (User Correction) --- */
(function () {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const app = window.app;
            if (!app || !app.timeMachine) return;

            // 1. Redefine Speed Multipliers (Real-time, Day, Week, Month, Year)
            // Real-time = 1, Day = 86400, Week = 604800, Month = 2592000, Year = 31557600
            app.timeMachine.speedMultipliers = [1, 86400, 604800, 2592000, 31557600];
            app.timeMachine.speedLevel = 0; // Default: Real-time (Index 0)

            // 2. Update Button Logic
            const oldBtn = document.getElementById('time-speed');
            if (oldBtn) {
                // Clone to remove listener from previous update
                const newBtn = oldBtn.cloneNode(true);
                oldBtn.parentNode.replaceChild(newBtn, oldBtn);

                // Labels mapping to the multipliers
                const labels = ["Real-time", "1 Hari/s", "1 Minggu/s", "1 Bulan/s", "1 Tahun/s"];

                // Set Initial Text
                newBtn.textContent = labels[0]; // "Real-time"

                // Add New Listener
                newBtn.addEventListener('click', () => {
                    // Cycle: 0 -> 1 -> 2 -> 3 -> 4 -> 0
                    app.timeMachine.speedLevel = (app.timeMachine.speedLevel + 1) % app.timeMachine.speedMultipliers.length;

                    // Update Text
                    newBtn.textContent = labels[app.timeMachine.speedLevel];

                    // Visual Feedback
                    if (window.polish) window.polish.play('click');
                });
            }
        }, 200); // 200ms delay to ensure it runs after the previous update
    });
})();


/* --- STRUCTURE TEXT UPDATE (User Request) --- */
(function () {
    const NEW_STRUCTURE_TEXT = {
        'Matahari': `
            <h3>☀︎ Matahari</h3>
            <ul>
                <li>Inti</li>
                <li>Zona radiasi</li>
                <li>Zona konveksi</li>
                <li>Fotosfer</li>
                <li>Kromosfer</li>
                <li>Korona</li>
            </ul>`,
        'Merkurius': `
            <h3>☿ Merkurius</h3>
            <ul>
                <li>Inti besi besar</li>
                <li>Mantel tipis</li>
                <li>Kerak berbatu</li>
                <li>Atmosfer sangat tipis (eksosfer)</li>
            </ul>`,
        'Venus': `
            <h3>♀ Venus</h3>
            <ul>
                <li>Inti besi</li>
                <li>Mantel batuan panas</li>
                <li>Kerak batuan</li>
                <li>Atmosfer sangat tebal (CO₂)</li>
            </ul>`,
        'Bumi': `
            <h3>🌍 Bumi</h3>
            <ul>
                <li>Inti dalam (padat)</li>
                <li>Inti luar (cair)</li>
                <li>Mantel</li>
                <li>Kerak</li>
                <li>Atmosfer</li>
            </ul>`,
        'Mars': `
            <h3>♂ Mars</h3>
            <ul>
                <li>Inti besi</li>
                <li>Mantel</li>
                <li>Kerak</li>
                <li>Atmosfer tipis</li>
            </ul>`,
        'Jupiter': `
            <h3>♃ Jupiter</h3>
            <ul>
                <li>Inti padat</li>
                <li>Hidrogen metalik</li>
                <li>Hidrogen & helium cair</li>
                <li>Atmosfer gas tebal</li>
            </ul>`,
        'Saturnus': `
            <h3>♄ Saturnus</h3>
            <ul>
                <li>Inti padat</li>
                <li>Hidrogen metalik</li>
                <li>Hidrogen & helium cair</li>
                <li>Atmosfer gas</li>
                <li>Cincin es dan batu</li>
            </ul>`,
        'Uranus': `
            <h3>♅ Uranus</h3>
            <ul>
                <li>Inti batu</li>
                <li>Mantel es (air, amonia, metana)</li>
                <li>Atmosfer gas</li>
            </ul>`,
        'Neptunus': `
            <h3>♆ Neptunus</h3>
            <ul>
                <li>Inti batu</li>
                <li>Mantel es</li>
                <li>Atmosfer gas (metana dominan)</li>
            </ul>`
    };

    window.addEventListener('load', () => {
        setTimeout(() => {
            const app = window.app;
            if (!app) return;

            // Chain of Responsibility: Wrap the *current* switchTab (which might be the Encyclopedia one)
            const previousSwitchTab = app.switchTab;

            app.switchTab = function (tabName, btnElement) {
                // Handle Structure Tab
                if (tabName === 'structure') {
                    // Update Active Button visually
                    document.querySelectorAll('.hud-btn').forEach(b => b.classList.remove('active'));
                    if (btnElement) btnElement.classList.add('active');

                    // Set Content
                    const descBox = document.getElementById('hud-description');
                    const name = document.getElementById('hud-planet-name').textContent.trim();

                    // Find Data
                    const key = Object.keys(NEW_STRUCTURE_TEXT).find(k => k.toUpperCase() === name.toUpperCase());

                    if (key) {
                        descBox.innerHTML = NEW_STRUCTURE_TEXT[key];
                    } else {
                        // Fallback
                        descBox.innerHTML = "Data struktur tidak tersedia.";
                    }

                    // Trigger any visual overlays (like the layer view) if handled by original logic?
                    // The original layout logic (showing cutaway) is likely handled by 'click' listeners on the button or within switchTab?
                    // Let's check if previousSwitchTab did essential work.
                    // Previous switchTab: text update via typeWriter.
                    // Visual Structure Manager handles the `show-structure` class via its *own* event listener on `.hud-btn`.
                    // So purely replacing the text logic here is safe.

                } else {
                    // Delegate to previous handler (Encyclopedia or Original)
                    previousSwitchTab.call(this, tabName, btnElement);
                }
            };
        }, 300); // 300ms to ensure it runs after Encyclopedia update
    });
})();


/* --- SETTINGS MANAGER (User Request) --- */
(function () {
    window.addEventListener('load', () => {
        setTimeout(() => {
            // 1. Inject Modal HTML
            const modalHTML = `
                <div class="settings-overlay" id="settings-modal">
                    <div class="settings-panel">
                        <button class="settings-close-btn" id="settings-close">&times;</button>
                        <h2 class="settings-title">PENGATURAN</h2>
                        
                        <div class="setting-row">
                            <div class="setting-text">
                                <div class="setting-label">Mode Performa</div>
                                <span class="setting-desc" id="perf-desc">High (Visual Penuh)</span>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="perf-toggle" checked>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <!-- Placeholder for future settings -->
                        <div style="margin-top: 2rem; font-size: 0.8rem; color: #555;">
                            Versi 1.2.0 - Solar System Kids
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // 2. Elements & Logic
            const modal = document.getElementById('settings-modal');
            const closeBtn = document.getElementById('settings-close');
            const perfToggle = document.getElementById('perf-toggle');
            const perfDesc = document.getElementById('perf-desc');
            const settingsBtn = document.getElementById('settings-btn'); // Existing button

            // Helper: Apply Mode
            function applyMode(isHigh) {
                if (isHigh) {
                    document.body.classList.remove('low-perf');
                    perfDesc.textContent = "High (Visual Penuh)";
                } else {
                    document.body.classList.add('low-perf');
                    perfDesc.textContent = "Low (Hemat Baterai/Lag)";
                }
                localStorage.setItem('perfMode', isHigh ? 'high' : 'low');
                perfToggle.checked = isHigh;
            }

            // 3. Initialize State (Check LocalStorage)
            const savedMode = localStorage.getItem('perfMode');
            const isHigh = savedMode !== 'low'; // Default to High if null
            applyMode(isHigh);

            // 4. Overwrite Settings Button Behavior
            if (settingsBtn) {
                // Clone to remove 'Alert' listener
                const newSettingsBtn = settingsBtn.cloneNode(true);
                settingsBtn.parentNode.replaceChild(newSettingsBtn, settingsBtn);

                newSettingsBtn.addEventListener('click', () => {
                    modal.classList.add('active');
                    if (window.polish) window.polish.play('click');
                });
            }

            // 5. Modal Listeners
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                if (window.polish) window.polish.play('back');
            });

            // Close when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });

            // 6. Toggle Switch Listener
            perfToggle.addEventListener('change', (e) => {
                applyMode(e.target.checked);
                if (window.polish) window.polish.play('click');
            });

        }, 400); // Delay to ensure DOM is ready
    });
})();

