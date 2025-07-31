document.addEventListener("DOMContentLoaded", () => {
	const profileForm = document.getElementById("profile-form");
	if (!profileForm) return;
	const dropZone = document.getElementById("drop-zone");
	const fileInput = document.getElementById("file-input");
	const profilePreview = document.getElementById("profile-preview");
	const nameInput = document.getElementById("profile-name");
	const oldPasswordInput = document.getElementById("old-password");
	const newPasswordInput = document.getElementById("new-password");
	const confirmPasswordInput = document.getElementById("confirm-password");
	const generalError = document.getElementById("general-error");
	let newImageData = null;
	const currentUser = JSON.parse(localStorage.getItem("user-current"));
	if (!currentUser) {
		window.location.href = "./login.html";
		return;
	}
	nameInput.value = currentUser.name;
	document.getElementById("profile-email").value = currentUser.email;
	if (currentUser.image_user_data) {
		profilePreview.src = currentUser.image_user_data;
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
	const checkName = () => {
		if (nameInput.value.trim() === "") {
			showError(nameInput, "Họ và tên không được để trống.");
			return false;
		}
		showSuccess(nameInput);
		return true;
	};
	const validateOldPassword = () => {
		if (
			oldPasswordInput.value &&
			oldPasswordInput.value !== currentUser.password
		) {
			showError(oldPasswordInput, "Mật khẩu cũ không chính xác.");
			return false;
		}
		showSuccess(oldPasswordInput);
		return true;
	};
	const validateNewPasswordStrength = () => {
		const password = newPasswordInput.value;
		if (!password) {
			showSuccess(newPasswordInput);
			return true;
		}
		const errors = [];
		if (password.length < 8) errors.push("phải có ít nhất 8 ký tự");
		if (!/[A-Z]/.test(password)) errors.push("phải chứa 1 chữ hoa");
		if (!/\d/.test(password)) errors.push("phải chứa 1 chữ số");
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
			errors.push("phải chứa 1 ký tự đặc biệt");
		if (errors.length > 0) {
			showError(newPasswordInput, `Mật khẩu ${errors.join(", ")}.`);
			return false;
		}
		showSuccess(newPasswordInput);
		validateConfirmPasswordMatch();
		return true;
	};
	const validateConfirmPasswordMatch = () => {
		const newPassword = newPasswordInput.value;
		const confirmPassword = confirmPasswordInput.value;
		if (confirmPassword && newPassword !== confirmPassword) {
			showError(confirmPasswordInput, "Mật khẩu xác nhận không khớp.");
			return false;
		}
		showSuccess(confirmPasswordInput);
		return true;
	};
	nameInput.addEventListener("blur", checkName);
	oldPasswordInput.addEventListener("blur", validateOldPassword);
	newPasswordInput.addEventListener("blur", validateNewPasswordStrength);
	confirmPasswordInput.addEventListener("blur", validateConfirmPasswordMatch);
	dropZone.addEventListener("click", () => fileInput.click());
	dropZone.addEventListener("dragover", (e) => {
		e.preventDefault();
		dropZone.classList.add("hover");
	});
	dropZone.addEventListener("dragleave", () =>
		dropZone.classList.remove("hover")
	);
	dropZone.addEventListener("drop", (e) => {
		e.preventDefault();
		dropZone.classList.remove("hover");
		handleFile(e.dataTransfer.files[0]);
	});
	fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));
	function handleFile(file) {
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				profilePreview.src = reader.result;
				newImageData = reader.result;
			};
			reader.readAsDataURL(file);
		} else {
			alert("Vui lòng chỉ chọn file ảnh.");
		}
	}
	document.querySelectorAll(".toggle-password").forEach((icon) => {
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
	profileForm.addEventListener("submit", (e) => {
		e.preventDefault();
		generalError.textContent = "";
		const isNameValid = checkName();
		let isPasswordSectionValid = true;
		const oldPassword = oldPasswordInput.value;
		const newPassword = newPasswordInput.value;
		const confirmPassword = confirmPasswordInput.value;
		if (oldPassword || newPassword || confirmPassword) {
			const isOldPassValid = validateOldPassword();
			const isNewPassStrong = validateNewPasswordStrength();
			const isConfirmPassMatched = validateConfirmPasswordMatch();
			if (!oldPassword || !newPassword || !confirmPassword) {
				generalError.textContent =
					"Vui lòng điền đầy đủ các trường mật khẩu để thay đổi.";
				isPasswordSectionValid = false;
			} else {
				isPasswordSectionValid =
					isOldPassValid && isNewPassStrong && isConfirmPassMatched;
			}
		}
		if (!isNameValid || !isPasswordSectionValid) {
			if (!isPasswordSectionValid && !generalError.textContent) {
				generalError.textContent = "Vui lòng kiểm tra lại các trường mật khẩu.";
			}
			return;
		}
		let allUsers = JSON.parse(localStorage.getItem("users")) || [];
		const userIndex = allUsers.findIndex(
			(user) => user.email === currentUser.email
		);
		if (userIndex === -1) {
			generalError.textContent =
				"Lỗi: Không tìm thấy người dùng trong hệ thống.";
			return;
		}
		const updatedUser = { ...allUsers[userIndex] };
		updatedUser.name = nameInput.value.trim();
		if (newImageData) {
			updatedUser.image_user_data = newImageData;
		}
		if (newPassword) {
			updatedUser.password = newPassword;
		}
		allUsers[userIndex] = updatedUser;
		localStorage.setItem("users", JSON.stringify(allUsers));
		localStorage.setItem("user-current", JSON.stringify(updatedUser));
		alert("Cập nhật thông tin thành công!");
		window.location.reload();
	});
});
