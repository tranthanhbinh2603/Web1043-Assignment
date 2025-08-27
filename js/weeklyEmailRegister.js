document.addEventListener("DOMContentLoaded", () => {
	emailjs.init("Lo2-Xuo-hlQQjmIjq");
	const newsletterForm = document.getElementById("newsletter-form");
	const emailInput = document.getElementById("newsletter-email-input");
	const submitButton = document.getElementById("newsletter-submit-btn");
	const statusMessage = document.getElementById("newsletter-status");
	newsletterForm.addEventListener("submit", function (event) {
		event.preventDefault();
		statusMessage.textContent = "Đang gửi...";
		statusMessage.style.color = "#888";
		emailInput.style.display = "none";
		submitButton.style.display = "none";
		emailjs
			.sendForm("service_hqm5hks", "template_9ms9qdd", this)
			.then(
				() => {
					statusMessage.textContent = "Đăng ký thành công!";
					statusMessage.style.color = "green";
				},
				(error) => {
					console.log("FAILED...", error);
					statusMessage.textContent = "Có lỗi xảy ra, vui lòng thử lại.";
					statusMessage.style.color = "red";
				}
			)
			.finally(() => {
				setTimeout(() => {
					statusMessage.textContent = "";
					emailInput.value = "";

					emailInput.style.display = "block";
					submitButton.style.display = "flex";
				}, 3000);
			});
	});
});
