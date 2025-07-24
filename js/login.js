const loginForm = document.getElementById("login-form");
if (loginForm) {
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const emailInput = document.getElementById("login-email");
		const passwordInput = document.getElementById("login-password");

		const email = emailInput.value.trim();
		const password = passwordInput.value;

		// Basic validation
		if (!email || !password) {
			alert("Vui lòng điền đầy đủ email và mật khẩu.");
			return;
		}

		// Get users from Local Storage
		const users = JSON.parse(localStorage.getItem("users")) || [];

		// Find user with matching credentials
		const foundUser = users.find(
			(user) => user.email === email && user.password === password
		);

		if (foundUser) {
			// Login successful
			alert("Đăng nhập thành công!");
			localStorage.setItem("user-current", JSON.stringify(foundUser)); // Store current user
			window.location.href = "./index.html"; // Redirect to homepage
		} else {
			// Login failed
			alert("Email hoặc mật khẩu không chính xác.");
		}
	});
}
