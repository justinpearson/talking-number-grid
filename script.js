// Initialize the number grid
function createNumberGrid() {
    const grid = document.getElementById('numberGrid');

    // Create buttons for numbers 1 to 100
    for (let i = 1; i <= 100; i++) {
        const button = document.createElement('button');
        button.className = 'number-button';
        button.textContent = i;
        button.setAttribute('aria-label', `Number ${i}`);

        // Add click event to speak the number
        button.addEventListener('click', () => speakNumber(i));

        grid.appendChild(button);
    }
}

// Function to speak the number using Web Speech API
function speakNumber(number) {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Create a new speech utterance
        const utterance = new SpeechSynthesisUtterance(number.toString());

        // Configure speech properties
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.1; // Slightly higher pitch for kids
        utterance.volume = 1.0; // Full volume

        // Speak the number
        window.speechSynthesis.speak(utterance);
    } else {
        // Fallback if speech synthesis is not supported
        alert(`Number ${number}`);
        console.warn('Speech synthesis not supported in this browser');
    }
}

// Initialize the grid when the page loads
document.addEventListener('DOMContentLoaded', createNumberGrid);
