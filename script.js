// The grid starts showing 0–10. Each click of the + button on either end
// extends the range to the next boundary, following the pattern:
// 10, 20, 100, 200, 1000, 2000, 10000, 20000, 100000, ...
// (alternating ×2 and ×5, forever).
var low = 0;
var high = 10;

// Given the current boundary (always positive), return the next one.
function nextBoundary(current) {
    // The sequence starting from 10: 10, 20, 100, 200, 1000, 2000, ...
    // If current has the form 1×10^k (like 10, 100, 1000), next is 2×10^k.
    // If current has the form 2×10^k (like 20, 200, 2000), next is 1×10^(k+1).
    var digits = current.toString();
    if (digits[0] === '1') {
        return current * 2;
    }
    return current * 5;
}

function renderGrid() {
    var grid = document.getElementById('numberGrid');
    grid.innerHTML = '';

    // Left + button (to extend into negatives)
    var leftBtn = document.createElement('button');
    leftBtn.className = 'extend-btn';
    leftBtn.textContent = '+';
    leftBtn.setAttribute('aria-label', 'Extend into more negative numbers');
    leftBtn.addEventListener('click', extendNegative);
    grid.appendChild(leftBtn);

    // All number buttons from low to high
    for (var n = low; n <= high; n++) {
        grid.appendChild(createNumberButton(n));
    }

    // Right + button (to extend into larger positives)
    var rightBtn = document.createElement('button');
    rightBtn.className = 'extend-btn';
    rightBtn.textContent = '+';
    rightBtn.setAttribute('aria-label', 'Add more numbers');
    rightBtn.addEventListener('click', extendPositive);
    grid.appendChild(rightBtn);
}

function createNumberButton(n) {
    var button = document.createElement('button');
    button.className = 'number-button color-' + (Math.abs(n) % 10);
    button.textContent = n;
    button.setAttribute('aria-label', 'Number ' + n);
    button.addEventListener('click', function (event) {
        speakNumber(n);
        celebrate(n, event.currentTarget);
    });
    return button;
}

function extendNegative() {
    // First click goes to -10, then follows the same ×2/×5 pattern.
    var currentMag = Math.abs(low) || 10;
    low = -(low === 0 ? 10 : nextBoundary(currentMag));
    renderGrid();
}

function extendPositive() {
    high = nextBoundary(high);
    renderGrid();
}

function speakNumber(number) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(number.toString());
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Number ' + number);
        console.warn('Speech synthesis not supported in this browser');
    }
}

// ----- Sparkles, confetti & celebration -----------------------------------

var SPARKLE_COLORS = [
    '#ffd700', '#ff6b6b', '#4facfe', '#43e97b', '#f093fb',
    '#fee140', '#00f2fe', '#aa00ff', '#ff9a56', '#2af598'
];

// Decide how big a celebration a number deserves, then fire it off from the
// center of the clicked button.
function celebrate(number, button) {
    var rect = button.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;

    if (Math.abs(number) === 100) {
        // The big one: tons of sparkles, confetti and a little fanfare.
        shootSparkles(x, y, 80);
        shootConfetti(150);
        playFanfare();
    } else if (number !== 0 && number % 10 === 0) {
        // Multiples of 10 get extra sparkles.
        shootSparkles(x, y, 40);
    } else {
        // Every other number gets a modest burst.
        shootSparkles(x, y, 14);
    }
}

// Spawn `count` sparkle particles that fly outward from (x, y).
function shootSparkles(x, y, count) {
    for (var i = 0; i < count; i++) {
        var sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.background = SPARKLE_COLORS[i % SPARKLE_COLORS.length];

        // Random direction and distance for the burst.
        var angle = Math.random() * Math.PI * 2;
        var distance = 40 + Math.random() * 80;
        var dx = Math.cos(angle) * distance;
        var dy = Math.sin(angle) * distance;
        sparkle.style.setProperty('--dx', dx + 'px');
        sparkle.style.setProperty('--dy', dy + 'px');

        var size = 6 + Math.random() * 8;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';

        document.body.appendChild(sparkle);
        removeAfterAnimation(sparkle);
    }
}

// Rain `count` confetti pieces down from the top of the screen.
function shootConfetti(count) {
    for (var i = 0; i < count; i++) {
        var piece = document.createElement('div');
        piece.className = 'confetti';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = SPARKLE_COLORS[i % SPARKLE_COLORS.length];
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        piece.style.animationDuration = 2 + Math.random() * 1.5 + 's';
        piece.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
        piece.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');

        document.body.appendChild(piece);
        removeAfterAnimation(piece);
    }
}

// Remove an element once its CSS animation finishes (with a fallback timer).
function removeAfterAnimation(el) {
    var done = false;
    function cleanup() {
        if (done) return;
        done = true;
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
    el.addEventListener('animationend', cleanup);
    setTimeout(cleanup, 4000);
}

// Play a short celebratory fanfare using the Web Audio API so we don't need
// any audio files.
function playFanfare() {
    if (!('AudioContext' in window || 'webkitAudioContext' in window)) {
        return;
    }
    try {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        var ctx = new AudioCtx();

        // A cheerful ascending arpeggio ending on a high note.
        var notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        var noteLength = 0.16;

        notes.forEach(function (freq, i) {
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;

            var start = ctx.currentTime + i * noteLength;
            var end = start + noteLength + 0.1;
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, end);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(end);
        });

        // Close the context after the fanfare finishes to free resources.
        setTimeout(function () {
            ctx.close();
        }, (notes.length * noteLength + 0.5) * 1000);
    } catch (e) {
        console.warn('Could not play fanfare', e);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderGrid();
});
