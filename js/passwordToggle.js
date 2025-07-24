const togglePasswordIcons = document.querySelectorAll(".toggle-password");
togglePasswordIcons.forEach((icon) => {
	icon.addEventListener("click", () => {
		const passwordInput = icon.parentElement.querySelector("input");
		if (passwordInput.type === "password") {
			passwordInput.type = "text";
			icon.src = "./svg/hide-password.svg";
			icon.alt = "Ẩn mật khẩu";
		} else {
			passwordInput.type = "password";
			icon.src = "./svg/show-password.svg";
			icon.alt = "Hiện mật khẩu";
		}
	});
});
