const loginForm = document.getElementById("login-form");
if (loginForm) {
	const emailInput = document.getElementById("login-email");
	const passwordInput = document.getElementById("login-password");
	const generalError = document.getElementById("login-general-error");
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
	const isValidEmail = (email) => {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return re.test(String(email).toLowerCase());
	};
	const checkEmail = () => {
		const emailValue = emailInput.value.trim();
		if (emailValue === "") {
			showError(emailInput, "Vui lòng không để trống trường này.");
			return false;
		} else if (!isValidEmail(emailValue)) {
			showError(emailInput, "Email không đúng định dạng.");
			return false;
		} else {
			showSuccess(emailInput);
			return true;
		}
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
		showSuccess(input);
		return true;
	};
	emailInput.addEventListener("blur", () => {
		checkEmail();
	});
	passwordInput.addEventListener("blur", () => {
		checkRequired(passwordInput);
	});
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		if (generalError) generalError.innerText = "";
		const isEmailValid = checkRequired(emailInput);
		const isPasswordValid = checkRequired(passwordInput);
		if (!isEmailValid || !isPasswordValid) {
			return;
		}
		const email = emailInput.value.trim();
		const password = passwordInput.value;
		const users = JSON.parse(localStorage.getItem("users")) || [];
		const foundUser = users.find(
			(user) => user.email === email && user.password === password
		);
		if (foundUser) {
			if (generalError) {
				generalError.classList.remove("text-red-600");
				generalError.classList.add("text-green-600");
				generalError.innerText = "Đăng nhập thành công! Đang chuyển hướng...";
			}
			setTimeout(function () {
				localStorage.setItem("user-current", JSON.stringify(foundUser));
				window.location.href = "./index.html";
			}, 3000);
		} else {
			if (generalError) {
				generalError.innerText = "Email hoặc mật khẩu không chính xác.";
			} else {
				alert("Email hoặc mật khẩu không chính xác.");
			}
			emailInput.classList.add("error");
			passwordInput.classList.add("error");
		}
	});
}
