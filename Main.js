// Mobile Map Navigation App - Complete JS

// Global state
let currentView = 'map';
let audioContext = null;

// === Audio Functions ===
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(freq = 600, duration = 100) {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

// === UI Interaction ===

// Show info popup
function showInfo(type) {
    playSound(900, 150);
    const popup = document.getElementById(type + 'Popup');
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3000);
}

// Start navigation
function startNavigation() {
    initAudio();
    playSound(1000, 400);

    const mapView = document.getElementById('mapView');
    const navView = document.getElementById('navView');

    mapView.classList.add('slide-left');
    navView.classList.add('slide-in');
    currentView = 'nav';

    document.querySelectorAll('.info-popup').forEach(popup => {
        popup.classList.remove('show');
    });
}

// Go back to map view
function goBack() {
    playSound(700, 200);
    if (currentView === 'nav') {
        const mapView = document.getElementById('mapView');
        const navView = document.getElementById('navView');

        mapView.classList.remove('slide-left');
        navView.classList.remove('slide-in');
        currentView = 'map';
    }
}

// Toggle audio button state
function toggleAudio() {
    const btn = document.getElementById('audioBtn');
    btn.classList.toggle('playing');
    playSound(500, 100);
}

// Play directional instruction sound
function playDirectionSound() {
    playSound(1200, 250);
}

// Add hover sounds to pins & directions
function addHoverEffects() {
    const pins = document.querySelectorAll('.pin');
    const cards = document.querySelectorAll('.direction-card');

    pins.forEach(pin => {
        pin.addEventListener('mouseenter', () => playSound(400, 50));
    });

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => playSound(400, 50));
    });
}

// Handle responsiveness for phone container
function handleResize() {
    const phoneContainer = document.querySelector('.phone-container');
    const windowHeight = window.innerHeight;
    const containerHeight = 812;

    if (windowHeight < containerHeight + 40) {
        phoneContainer.style.transform = `scale(${(windowHeight - 40) / containerHeight})`;
    } else {
        phoneContainer.style.transform = 'scale(1)';
    }
}

// === Initialization ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('Mobile Map Navigation App initialized');

    // One-time audio context unlock
    document.addEventListener('click', () => {
        if (!audioContext) {
            initAudio();
        }
    }, { once: true });

    addHoverEffects();
    handleResize();
});

// Add global click sound to all buttons
document.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        playSound(600, 100);
    }
});

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);
