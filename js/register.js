document.addEventListener("DOMContentLoaded", () => {
	const registerForm = document.getElementById("register-form");
	if (!registerForm) return;
	const nameInput = document.getElementById("reg-name");
	const emailInput = document.getElementById("reg-email");
	const passwordInput = document.getElementById("reg-password");
	const confirmPasswordInput = document.getElementById("reg-confirm-password");
	const generalError = document.getElementById("register-general-error");
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
	const checkEmail = () => {
		if (!checkRequired(emailInput, "Email")) return false;
		const email = emailInput.value.trim();
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!re.test(String(email).toLowerCase())) {
			showError(emailInput, "Email không đúng định dạng.");
			return false;
		}
		const users = JSON.parse(localStorage.getItem("users")) || [];
		if (users.some((user) => user.email === email)) {
			showError(emailInput, "Email này đã được đăng ký.");
			return false;
		}
		showSuccess(emailInput);
		return true;
	};
	const checkPasswordStrength = () => {
		if (!checkRequired(passwordInput, "Mật khẩu")) return false;
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
		checkConfirmPasswordMatch();
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
	nameInput.addEventListener(
		"blur",
		() => checkRequired(nameInput, "Họ và tên") && showSuccess(nameInput)
	);
	emailInput.addEventListener("blur", checkEmail);
	passwordInput.addEventListener("blur", checkPasswordStrength);
	confirmPasswordInput.addEventListener("blur", checkConfirmPasswordMatch);
	registerForm.addEventListener("submit", (e) => {
		e.preventDefault();
		generalError.innerText = "";
		const isNameValid = checkRequired(nameInput, "Họ và tên");
		const isEmailValid = checkEmail();
		const isPasswordStrong = checkPasswordStrength();
		const isConfirmPasswordValid = checkConfirmPasswordMatch();
		if (
			isNameValid &&
			isEmailValid &&
			isPasswordStrong &&
			isConfirmPasswordValid
		) {
			const newUser = {
				name: nameInput.value.trim(),
				email: emailInput.value.trim(),
				password: CryptoJS.SHA256(passwordInput.value).toString(),
				isAdmin: false,
			};

			sessionStorage.setItem("temp_user_data", JSON.stringify(newUser));

			generalError.classList.remove("text-red-600");
			generalError.classList.add("text-green-600");
			generalError.innerText = "Đang chuyển hướng đến trang xác nhận email...";
			setTimeout(() => {
				window.location.href = "./verify-email.html";
			}, 1000);
		} else {
			generalError.innerText = "Vui lòng kiểm tra lại các thông tin đã nhập.";
		}
	});
});
