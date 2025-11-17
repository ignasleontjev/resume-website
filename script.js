// TODO: Replace this with your actual API Gateway URL after deployment
// Format: https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/chat
const API_ENDPOINT = 'https://o39jhm2eej.execute-api.us-east-1.amazonaws.com/ask';

// Chat UI Elements
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');

// Toggle chat window
chatToggle.addEventListener('click', () => {
    chatWindow.classList.add('active');
    chatInput.focus();
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Send message on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Display user message
    addMessage(message, 'user');
    chatInput.value = '';
    sendButton.disabled = true;
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    try {
        // Call AWS Lambda function via API Gateway
        const reply = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });
        
        if (!reply.ok) {
            throw new Error('API request failed');
        }
        
        const data = await reply.json();
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Display bot response
        addMessage(data.reply, 'bot');
        
    } catch (error) {
        console.error('Error:', error);
        typingIndicator.remove();
        addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
    } finally {
        sendButton.disabled = false;
        chatInput.focus();
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const p = document.createElement('p');
    p.textContent = text;
    messageDiv.appendChild(p);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return typingDiv;

}



