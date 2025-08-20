document.addEventListener("DOMContentLoaded", () => {
	const resetPasswordForm = document.getElementById("reset-password-form");
	if (!resetPasswordForm) return;

	const codeInput = document.getElementById("reset-code");
	const passwordInput = document.getElementById("reset-password");
	const confirmPasswordInput = document.getElementById(
		"reset-confirm-password"
	);
	const generalError = document.getElementById("reset-general-error");

	const userEmail = sessionStorage.getItem("user_email_for_reset");
	if (!userEmail) {
		// If no email is in session, redirect to login
		window.location.href = "./login.html";
		return;
	}

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

	const checkRequired = (input, fieldName) => {
		if (input.value.trim() === "") {
			showError(input, `${fieldName} không được để trống.`);
			return false;
		}
		return true;
	};

	const checkCode = () => {
		if (!checkRequired(codeInput, "Mã xác nhận")) return false;
		const enteredCode = codeInput.value.trim();
		const storedCode = sessionStorage.getItem("password_reset_code");

		if (enteredCode !== storedCode) {
			showError(codeInput, "Mã xác nhận không đúng.");
			return false;
		}

		showSuccess(codeInput);
		return true;
	};

	const checkPasswordStrength = () => {
		if (!checkRequired(passwordInput, "Mật khẩu mới")) return false;
		const password = passwordInput.value;
		const errors = [];
		if (password.length < 8) errors.push("phải có ít nhất 8 ký tự");
		if (!/[A-Z]/.test(password)) errors.push("phải chứa 1 chữ hoa");
		if (!/\d/.test(password)) errors.push("phải chứa 1 chữ số");
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
			errors.push("phải chứa 1 ký tự đặc biệt");

		if (errors.length > 0) {
			showError(passwordInput, `Mật khẩu ${errors.join(", ")}.`);
			return false;
		}
		showSuccess(passwordInput);
		checkConfirmPasswordMatch(); // Check confirmation password whenever the main password changes
		return true;
	};

	const checkConfirmPasswordMatch = () => {
		if (!checkRequired(confirmPasswordInput, "Xác nhận mật khẩu")) return false;
		if (passwordInput.value !== confirmPasswordInput.value) {
			showError(confirmPasswordInput, "Mật khẩu xác nhận không khớp.");
			return false;
		}
		showSuccess(confirmPasswordInput);
		return true;
	};

	// Add blur listeners for instant validation
	codeInput.addEventListener("blur", checkCode);
	passwordInput.addEventListener("blur", checkPasswordStrength);
	confirmPasswordInput.addEventListener("blur", checkConfirmPasswordMatch);

	resetPasswordForm.addEventListener("submit", (e) => {
		e.preventDefault();
		generalError.innerText = "";

		const isCodeValid = checkCode();
		const isPasswordStrong = checkPasswordStrength();
		const isConfirmPasswordValid = checkConfirmPasswordMatch();

		if (isCodeValid && isPasswordStrong && isConfirmPasswordValid) {
			// Find user and update password in localStorage
			const users = JSON.parse(localStorage.getItem("users")) || [];
			const userIndex = users.findIndex((user) => user.email === userEmail);

			if (userIndex !== -1) {
				const newPassword = passwordInput.value;
				users[userIndex].password = CryptoJS.SHA256(newPassword).toString();
				localStorage.setItem("users", JSON.stringify(users));

				// Clean up session storage
				sessionStorage.removeItem("user_email_for_reset");
				sessionStorage.removeItem("password_reset_code");

				generalError.classList.remove("text-red-600");
				generalError.classList.add("text-green-600");
				generalError.innerText =
					"Mật khẩu đã được đặt lại thành công! Đang chuyển hướng...";

				setTimeout(() => {
					window.location.href = "./login.html";
				}, 1500);
			} else {
				generalError.innerText = "Vui lòng kiểm tra lại các thông tin đã nhập.";
			}
		} else {
			generalError.innerText = "Vui lòng kiểm tra lại các thông tin đã nhập.";
		}
	});
});
