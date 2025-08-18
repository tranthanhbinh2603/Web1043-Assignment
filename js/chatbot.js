
document.addEventListener('DOMContentLoaded', () => {
    const chatIcon = document.createElement('div');
    chatIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white bg-blue-600 rounded-full p-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    `;
    chatIcon.classList.add('chat-icon');
    document.body.appendChild(chatIcon);

    const chatWidget = document.createElement('div');
    chatWidget.classList.add('chat-widget');
    chatWidget.innerHTML = `
        <div class="chat-header">
            <h2>AI Assistant</h2>
            <button class="close-chat">&times;</button>
        </div>
        <div class="chat-body">
            <div class="chat-messages">
                <div class="message bot-message">
                    <p>Hello! How can I help you find the perfect keyboard today?</p>
                </div>
            </div>
        </div>
        <div class="chat-footer">
            <input type="text" id="chatInput" placeholder="Ask about keyboards...">
            <button id="sendMessage">Send</button>
        </div>
    `;
    document.body.appendChild(chatWidget);

    const closeChat = chatWidget.querySelector('.close-chat');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = chatWidget.querySelector('.chat-messages');

    chatIcon.addEventListener('click', () => {
        chatWidget.classList.toggle('active');
    });

    closeChat.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    sendMessage.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    function handleUserMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        appendMessage(userMessage, 'user-message');
        chatInput.value = '';

        setTimeout(() => {
            generateBotResponse(userMessage);
        }, 500);
    }

    function appendMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateBotResponse(userMessage) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        let response = "I'm not sure how to answer that. You can ask me about keyboard features like 'wireless', 'mechanical', or 'rgb'.";

        if (products.length === 0) {
            response = "I can't seem to find any product data. Please make sure products are loaded on the site.";
            appendMessage(response, 'bot-message');
            return;
        }

        const lowerCaseMessage = userMessage.toLowerCase();
        let recommendedProducts = [];

        // Simple keyword matching
        if (lowerCaseMessage.includes('wireless') || lowerCaseMessage.includes('bluetooth')) {
            recommendedProducts = products.filter(p => p.tags.includes('Wireless'));
        } else if (lowerCaseMessage.includes('mechanical')) {
            recommendedProducts = products.filter(p => p.tags.includes('Mechanical'));
        } else if (lowerCaseMessage.includes('rgb')) {
            recommendedProducts = products.filter(p => p.tags.includes('RGB'));
        } else if (lowerCaseMessage.includes('cheap') || lowerCaseMessage.includes('affordable')) {
            const sortedByPrice = [...products].sort((a, b) => a.price - b.price);
            recommendedProducts = sortedByPrice.slice(0, 3);
        } else if (lowerCaseMessage.includes('best') || lowerCaseMessage.includes('recommend')) {
             // Recommend products with high ratings
            const sortedByRating = [...products].sort((a, b) => b.rating - a.rating);
            recommendedProducts = sortedByRating.slice(0, 3);
        } else {
            // Find products by name
            recommendedProducts = products.filter(p => p.name.toLowerCase().includes(lowerCaseMessage));
        }


        if (recommendedProducts.length > 0) {
            response = "Based on your request, I recommend these products:<br>";
            recommendedProducts.slice(0, 3).forEach(p => {
                response += `<br><b>${p.name}</b> - $${p.price}`;
            });
        }

        appendMessage(response, 'bot-message');
    }
});
