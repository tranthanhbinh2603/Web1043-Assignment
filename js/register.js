const registerForm = document.getElementById("register-form");

// Logic Xử lý Form
if (registerForm) {
	registerForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const nameInput = document.getElementById("reg-name");
		const emailInput = document.getElementById("reg-email");
		const passwordInput = document.getElementById("reg-password");
		const confirmPasswordInput = document.getElementById(
			"reg-confirm-password"
		);
		const name = nameInput.value.trim();
		const email = emailInput.value.trim();
		const password = passwordInput.value;
		const confirmPassword = confirmPasswordInput.value;
		if (!name || !email || !password || !confirmPassword) {
			alert("Vui lòng điền đầy đủ thông tin.");
			return;
		}
		if (!email.endsWith("@gmail.com")) {
			alert("Vui lòng chỉ sử dụng email có đuôi @gmail.com để đăng ký.");
			return;
		}
		if (password !== confirmPassword) {
			alert("Mật khẩu xác nhận không khớp.");
			return;
		}
		const users = JSON.parse(localStorage.getItem("users")) || [];
		const userExists = users.some((user) => user.email === email);
		if (userExists) {
			alert("Email này đã được đăng ký. Vui lòng sử dụng một email khác.");
			return;
		}
		const newUser = { name, email, password };
		users.push(newUser);
		localStorage.setItem("users", JSON.stringify(users));
		alert("Đăng ký tài khoản thành công!");
		window.location.href = "./login.html";
	});
}
