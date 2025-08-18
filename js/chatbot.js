document.addEventListener("DOMContentLoaded", () => {
	const chatIcon = document.createElement("div");
	chatIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white bg-blue-600 rounded-full p-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    `;
	chatIcon.classList.add("chat-icon");
	document.body.appendChild(chatIcon);

	const chatWidget = document.createElement("div");
	chatWidget.classList.add("chat-widget");
	chatWidget.innerHTML = `
        <div class="chat-header">
            <h2>Chuyên gia AI tư vấn bàn phím</h2>
            <button class="close-chat">&times;</button>
        </div>
        <div class="chat-body">
            <div class="chat-messages">
                <div class="message bot-message">
                    <p>Xin chào! Tôi có thể giúp bạn tìm được bàn phím hoàn hảo như thế nào hôm nay?</p>
                </div>
            </div>
        </div>
        <div class="chat-footer">
            <input type="text" id="chatInput" placeholder="Ask about keyboards...">
            <button id="sendMessage">Send</button>
        </div>
    `;
	document.body.appendChild(chatWidget);

	const closeChat = chatWidget.querySelector(".close-chat");
	const chatInput = document.getElementById("chatInput");
	const sendMessage = document.getElementById("sendMessage");
	const chatMessages = chatWidget.querySelector(".chat-messages");

	chatIcon.addEventListener("click", () => {
		chatWidget.classList.toggle("active");
	});

	closeChat.addEventListener("click", () => {
		chatWidget.classList.remove("active");
	});

	sendMessage.addEventListener("click", handleUserMessage);
	chatInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			handleUserMessage();
		}
	});

	function handleUserMessage() {
		const userMessage = chatInput.value.trim();
		if (!userMessage) return;

		appendMessage(userMessage, "user-message");
		chatInput.value = "";

		// Show a temporary "typing" message
		const typingIndicator = appendMessage("", "bot-message");

		getGeminiResponse(userMessage, typingIndicator);
	}

	function appendMessage(message, type) {
		const messageElement = document.createElement("div");
		messageElement.classList.add("message", type);
		messageElement.innerHTML = `<p>${message}</p>`;
		chatMessages.appendChild(messageElement);
		chatMessages.scrollTop = chatMessages.scrollHeight;
		return messageElement; // Return the element to be able to remove it later
	}

	async function getGeminiResponse(userMessage, typingIndicator) {
		// --- BƯỚC QUAN TRỌNG ---
		// Lấy API Key của bạn và thay thế 'YOUR_API_KEY' dưới đây
		// Lưu ý: Tên biến API_KEY không thay đổi, chỉ cách sử dụng nó thay đổi.
		const API_KEY = "AIzaSyB0oI_bZgSIww9ZUoANTMheJduQ3oRwTZA"; // Thay thế bằng key của bạn

		// THAY ĐỔI 1: Cập nhật URL để sử dụng model 'gemini-2.0-flash' và xóa API key khỏi URL.
		const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

		const products = JSON.parse(localStorage.getItem("products")) || [];
		let productContext = "Here is a list of available products:\n";
		if (products.length > 0) {
			products.forEach((p) => {
				productContext += `- Name: ${p.title}, Price: ${p.discountedPrice}, Category: ${p.category}\n`;
			});
		} else {
			productContext = "Không có thông tin về sản phẩm nào.";
		}

		const prompt = `
        Bạn là một trợ lý AI thân thiện và hữu ích cho một cửa hàng bàn phím trực tuyến.
        Bạn sẽ chat bằng tiếng Việt và chỉ bằng tiếng Việt
        Mục tiêu của bạn là giúp người dùng tìm được bàn phím hoàn hảo dựa trên nhu cầu của họ.
        Bạn nên trò chuyện và đưa ra các đề xuất dựa trên câu hỏi của người dùng và danh sách sản phẩm bên dưới.
        Nếu người dùng hỏi một câu hỏi chung chung, hãy trả lời trong bối cảnh bàn phím.
        Hãy giữ câu trả lời ngắn gọn và dễ đọc. Sử dụng Markdown để định dạng câu trả lời của bạn (in đậm, in nghiêng, danh sách).

        ${productContext}

        Tin nhắn của người dùng: "${userMessage}"
    `;

		try {
			const response = await fetch(API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-goog-api-key": API_KEY,
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: prompt,
								},
							],
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error(`API Error: ${response.statusText}`);
			}

			const data = await response.json();
			if (!data.candidates || data.candidates.length === 0) {
				throw new Error("Không có phản hồi. Vui lòng kiểm tra lại.");
			}
			const botResponse = data.candidates[0].content.parts[0].text;
			const converter = new showdown.Converter();
			const htmlResponse = converter.makeHtml(botResponse);
			typingIndicator.querySelector("p").innerHTML = htmlResponse;
		} catch (error) {
			console.error("Error fetching Gemini response:", error);
			const errorMessage =
				"Sorry, I'm having a bit of trouble connecting to my brain right now. Please check the console (F12) for any API key errors and try again later.";
			typingIndicator.querySelector("p").innerText = errorMessage;
		}
	}
});
