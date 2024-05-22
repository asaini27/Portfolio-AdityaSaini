document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Form submitted! We will be in touch.');
});
const hiText = document.getElementById('hi-animated-text');
const hiWords = ['Hi', 'Hola', 'नमस्ते', 'Bonjour'];
let hiWordIndex = 0;

const roleText = document.getElementById('role-animated-text');
const roleWords = ['An Innovator', 'A Developer', 'An Entrepreneur'];
let roleWordIndex = 0;

function typeHiText() {
    hiText.textContent = hiWords[hiWordIndex];
    hiWordIndex = (hiWordIndex + 1) % hiWords.length;
    setTimeout(typeRoleText, 20); // Time before changing language
}

function typeRoleText() {
    if (roleWordIndex < roleWords.length) {
        roleText.textContent = roleWords[roleWordIndex];
        roleWordIndex++;
        setTimeout(typeRoleText, 200); // Time before next role
    } else {
        roleWordIndex = 0;
        setTimeout(typeHiText, 20); // Restart cycle
    }
}

// Initial call to start animation
typeHiText();



