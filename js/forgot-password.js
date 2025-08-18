document.addEventListener("DOMContentLoaded", () => {
	const forgotPasswordForm = document.getElementById("forgot-password-form");
	if (!forgotPasswordForm) return;

	const emailInput = document.getElementById("forgot-email");
	const generalError = document.getElementById("forgot-general-error");

	const showError = (input, message) => {
		const inputGroup = input.closest(".input-group");
		const errorDisplay = inputGroup.querySelector(".error-message");
		errorDisplay.innerText = message;
		input.classList.add("border-red-500");
	};

	const showSuccess = (input) => {
		const inputGroup = input.closest(".input-group");
		const errorDisplay = inputGroup.querySelector(".error-message");
		errorDisplay.innerText = "";
		input.classList.remove("border-red-500");
	};

	const checkEmailExists = () => {
		const email = emailInput.value.trim();
		if (email === "") {
			showError(emailInput, "Email không được để trống.");
			return false;
		}
		const users = JSON.parse(localStorage.getItem("users")) || [];
		const userExists = users.some((user) => user.email === email);
		if (!userExists) {
			showError(emailInput, "Email này chưa được đăng ký.");
			return false;
		}
		showSuccess(emailInput);
		return true;
	};

	emailInput.addEventListener("blur", checkEmailExists);

	forgotPasswordForm.addEventListener("submit", (e) => {
		e.preventDefault();
		generalError.innerText = "";

		if (checkEmailExists()) {
			const email = emailInput.value.trim();

			// Store email for reset page
			sessionStorage.setItem("user_email_for_reset", email);

			// Use EmailJS to send a verification code
			sendResetCode(email);

			generalError.classList.remove("text-red-600");
			generalError.classList.add("text-green-600");
			generalError.innerText =
				"Đang gửi mã... Vui lòng kiểm tra email của bạn.";

			setTimeout(() => {
				window.location.href = "./reset-password.html";
			}, 1500);
		} else {
			generalError.innerText = "Vui lòng kiểm tra lại email đã nhập.";
		}
	});

	const sendResetCode = (email) => {
		emailjs.init({
			publicKey: "Lo2-Xuo-hlQQjmIjq", // Replace with your EmailJS public key
		});

		const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
		console.log("Reset Code:", resetCode); // For debugging
		sessionStorage.setItem("password_reset_code", resetCode);

		const templateParams = {
			to_email: email,
			from_name: "Keychron Vietnam",
			verification_code: resetCode,
		};

		emailjs
			.send("service_hqm5hks", "template_1om7j6p", templateParams) // Replace with your Service ID and Template ID
			.then(
				(response) => {
					console.log("SUCCESS!", response.status, response.text);
				},
				(error) => {
					console.log("FAILED...", error);
					generalError.innerText =
						"Gửi email thất bại. Vui lòng thử lại sau.";
				}
			);
	};
});
