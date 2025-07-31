const registerForm = document.getElementById("register-form");

if (registerForm) {
	const nameInput = document.getElementById("reg-name");
	const emailInput = document.getElementById("reg-email");
	const passwordInput = document.getElementById("reg-password");
	const confirmPasswordInput = document.getElementById("reg-confirm-password");
	const generalError = document.getElementById("register-general-error");
	const showError = (input, message) => {
		const inputGroup = input.closest(".input-group");
		if (inputGroup) {
			const errorDisplay = inputGroup.querySelector(".error-message");
			if (errorDisplay) {
				errorDisplay.innerText = message;
			}
		}
		input.classList.add("error");
		input.classList.remove("success");
	};
	const showSuccess = (input) => {
		const inputGroup = input.closest(".input-group");
		if (inputGroup) {
			const errorDisplay = inputGroup.querySelector(".error-message");
			if (errorDisplay) {
				errorDisplay.innerText = "";
			}
		}
		input.classList.add("success");
		input.classList.remove("error");
	};
	const checkRequired = (input) => {
		if (input.value.trim() === "") {
			showError(input, `Vui lòng không để trống trường này.`);
			return false;
		}
		return true;
	};
	const checkEmail = (input) => {
		if (!checkRequired(input)) return false;
		const email = input.value.trim();
		if (!email.endsWith("@gmail.com")) {
			showError(input, "Vui lòng chỉ sử dụng email có đuôi @gmail.com.");
			return false;
		}
		const users = JSON.parse(localStorage.getItem("users")) || [];
		const userExists = users.some((user) => user.email === email);
		if (userExists) {
			showError(input, "Email này đã được đăng ký.");
			return false;
		}
		showSuccess(input);
		return true;
	};
	const checkPassword = (input) => {
		if (!checkRequired(input)) return false;
		showSuccess(input);
		return true;
	};
	const checkConfirmPassword = (password, confirmPassword) => {
		if (!checkRequired(confirmPassword)) return false;
		if (password.value !== confirmPassword.value) {
			showError(confirmPassword, "Mật khẩu xác nhận không khớp.");
			return false;
		}
		showSuccess(confirmPassword);
		return true;
	};
	nameInput.addEventListener("blur", () => {
		if (checkRequired(nameInput)) {
			showSuccess(nameInput);
		}
	});
	emailInput.addEventListener("blur", () => {
		checkEmail(emailInput);
	});
	passwordInput.addEventListener("blur", () => {
		checkPassword(passwordInput);
	});
	confirmPasswordInput.addEventListener("blur", () => {
		checkConfirmPassword(passwordInput, confirmPasswordInput);
	});
	registerForm.addEventListener("submit", (e) => {
		e.preventDefault();
		if (generalError) generalError.innerText = "";
		const isNameValid = checkRequired(nameInput);
		const isEmailValid = checkEmail(emailInput);
		const isPasswordValid = checkPassword(passwordInput);
		const isConfirmPasswordValid = checkConfirmPassword(
			passwordInput,
			confirmPasswordInput
		);
		const isFormValid =
			isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
		if (isFormValid) {
			const name = nameInput.value.trim();
			const email = emailInput.value.trim();
			const password = passwordInput.value;
			const users = JSON.parse(localStorage.getItem("users")) || [];
			const newUser = { name, email, password };
			users.push(newUser);
			localStorage.setItem("users", JSON.stringify(users));
			if (generalError) {
				generalError.classList.remove("text-red-600");
				generalError.classList.add("text-green-600");
				generalError.innerText = "Đăng ký thành công! Đang chuyển hướng...";
			}
			setTimeout(function () {
				window.location.href = "./login.html";
			}, 3000);
		} else {
			if (generalError) {
				generalError.innerText = "Vui lòng kiểm tra lại các thông tin đã nhập.";
			} else {
				alert("Vui lòng kiểm tra lại các thông tin đã nhập.");
			}
		}
	});
}
