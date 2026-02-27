async function askAI(prompt) {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Add user message to UI
    appendMessage('user', prompt);

    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt })
        });
        const data = await response.json();
        appendMessage('ai', data.reply);
    } catch (error) {
        appendMessage('ai', "Sorry, I'm having trouble connecting to my brain right now. Please try again later.");
    }
}

function appendMessage(sender, text) {
    const chatMessages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `chat-message message-${sender}`;
    div.innerText = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById('btn-send-chat').addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    if (input.value.trim()) {
        askAI(input.value);
        input.value = '';
    }
});

document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = document.getElementById('chat-input');
        if (input.value.trim()) {
            askAI(input.value);
            input.value = '';
        }
    }
});
