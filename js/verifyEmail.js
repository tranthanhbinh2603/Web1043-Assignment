document.addEventListener("DOMContentLoaded", () => {
	const verifyForm = document.getElementById("verify-form");
	if (!verifyForm) return;

	const userEmailDisplay = document.getElementById("user-email");
	const codeInput = document.getElementById("verify-code");
	const generalError = document.getElementById("verify-general-error");
	const resendLink = document.getElementById("resend-code");

	const data = sessionStorage.getItem("temp_user_data");
	const userEmail = data ? JSON.parse(data).email : null;
	if (userEmail) {
		userEmailDisplay.textContent = userEmail;
	} else {
		window.location.href = "./register.html";
		return;
	}

	emailjs.init({
		publicKey: "Lo2-Xuo-hlQQjmIjq",
		blockHeadless: true,
		limitRate: {
			id: "app",
			throttle: 10000,
		},
	});

	const sendVerificationCode = (email) => {
		const verificationCode = Math.floor(
			100000 + Math.random() * 900000
		).toString();
		sessionStorage.setItem("verification_code", verificationCode);
		const templateParams = {
			to_email: userEmail,
			from_name: "Keychron Vietnam",
			verification_code: verificationCode,
		};
		emailjs.send("service_hqm5hks", "template_1om7j6p", templateParams);
	};

	// Send the initial code when the page loads
	sendVerificationCode(userEmail);

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

	const checkCode = () => {
		const enteredCode = codeInput.value.trim();
		const storedCode = sessionStorage.getItem("verification_code");

		if (enteredCode === "") {
			showError(codeInput, "Vui lòng nhập mã xác nhận.");
			return false;
		}

		if (enteredCode !== storedCode) {
			showError(codeInput, "Mã xác nhận không đúng.");
			return false;
		}

		showSuccess(codeInput);
		return true;
	};

	verifyForm.addEventListener("submit", (e) => {
		e.preventDefault();
		generalError.innerText = "";

		if (checkCode()) {
			const tempUserDataString = sessionStorage.getItem("temp_user_data");
			if (tempUserDataString) {
				const newUser = JSON.parse(tempUserDataString);
				const users = JSON.parse(localStorage.getItem("users")) || [];
				users.push(newUser);
				localStorage.setItem("users", JSON.stringify(users));
			}
			generalError.classList.remove("text-red-600");
			generalError.classList.add("text-green-600");
			generalError.innerText = "Xác nhận thành công! Đang chuyển hướng...";
			sessionStorage.removeItem("temp_user_data");
			sessionStorage.removeItem("verification_code");

			setTimeout(() => {
				window.location.href = "./login.html";
			}, 1000);
		} else {
			generalError.innerText = "Vui lòng kiểm tra lại mã xác nhận.";
		}
	});
});
