document.addEventListener('DOMContentLoaded', () => {
    // 1. Get references to the button and the hidden message
    const surpriseButton = document.getElementById('surprise-button');
    const surpriseMessage = document.getElementById('surprise-message');

    // 2. Add an event listener to the button
    surpriseButton.addEventListener('click', () => {
        // 3. Toggle the 'hidden' class to show/hide the message
        
        // Check if the message is currently hidden
        if (surpriseMessage.classList.contains('hidden')) {
            // If hidden, show it
            surpriseMessage.classList.remove('hidden');
            surpriseButton.textContent = 'Hide Message'; // Change button text
        } else {
            // If visible, hide it
            surpriseMessage.classList.add('hidden');
            surpriseButton.textContent = 'Click for a Surprise!'; // Change button text back
        }
    });
});