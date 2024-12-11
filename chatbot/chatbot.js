class Chatbot {
    constructor() {
        this.messages = [{
            role: 'assistant',
            content: "Hello I'm Pat, the Pathway2Code assistant! How can I help you today?"
        }];
        
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.chatMessages = document.getElementById('chat-messages');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
        messageDiv.textContent = content;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Clear input
        this.messageInput.value = '';

        // Add user message to chat
        this.addMessage(message, true);
        this.messages.push({ role: 'user', content: message });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.messages)
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Create a new message div for the assistant's response
            const assistantMessage = document.createElement('div');
            assistantMessage.className = 'message assistant';
            this.chatMessages.appendChild(assistantMessage);

            // Read the streaming response
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                assistantMessage.textContent += text;
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }

            // Add the complete message to our messages array
            this.messages.push({
                role: 'assistant',
                content: assistantMessage.textContent
            });

        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Sorry, there was an error processing your message.', false);
        }
    }
}

// Initialize the chatbot when the page loads
window.addEventListener('load', () => {
    new Chatbot();
}); 