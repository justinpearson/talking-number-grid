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
    button.addEventListener('click', function () {
        speakNumber(n);
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

document.addEventListener('DOMContentLoaded', function () {
    renderGrid();
});
