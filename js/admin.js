document.addEventListener("DOMContentLoaded", () => {
	const currentUser = JSON.parse(localStorage.getItem("user-current"));
	if (!currentUser || !currentUser.isAdmin) {
		window.location.href = "./index.html";
		return;
	}
	const userListContainer = document.getElementById("user-list-container");
	if (!userListContainer) return;
	let allUsers = JSON.parse(localStorage.getItem("users")) || [];
	const showError = (input, message) => {
		const errorDisplay = input
			.closest(".input-group")
			.querySelector(".error-message");
		if (errorDisplay) errorDisplay.innerText = message;
		input.classList.add("border-red-500");
	};
	const showSuccess = (input) => {
		const errorDisplay = input
			.closest(".input-group")
			.querySelector(".error-message");
		if (errorDisplay) errorDisplay.innerText = "";
		input.classList.remove("border-red-500");
	};
	const checkPasswordStrength = (input) => {
		const password = input.value;
		if (!password) {
			showSuccess(input);
			return true;
		}
		const errors = [];
		if (password.length < 8) errors.push("ít nhất 8 ký tự");
		if (!/[A-Z]/.test(password)) errors.push("1 chữ hoa");
		if (!/\d/.test(password)) errors.push("1 chữ số");
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
			errors.push("1 ký tự đặc biệt");
		if (errors.length > 0) {
			showError(input, `Mật khẩu cần ${errors.join(", ")}.`);
			return false;
		}
		showSuccess(input);
		return true;
	};
	const renderUserList = () => {
		userListContainer.innerHTML = "";
		const otherUsers = allUsers.filter(
			(user) => user.email !== currentUser.email
		);
		otherUsers.forEach((user) => {
			const userCard = document.createElement("div");
			userCard.className =
				"user-card bg-white p-6 rounded-lg border border-gray-200";
			userCard.innerHTML = `
                <form class="user-update-form" data-email="${
									user.email
								}" novalidate>
                    <div class="flex items-center gap-6 mb-6">
                        <div class="drop-zone flex-shrink-0">
                            <img loading="lazy" class="profile-preview" id="profile-icon" src="${
															user.image_user_data || "./svg/profile.svg"
														}" alt="Ảnh đại diện của ${user.name}">
                        </div>
                        <input type="file" class="file-input hidden" accept="image/*">
                        <div class="flex-grow">
                            <h3 class="text-xl font-bold">${user.name}</h3>
                            <p class="text-sm text-gray-500">${user.email}</p>
                            ${
															user.isAdmin
																? '<span class="mt-1 inline-block bg-green-200 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Admin</span>'
																: ""
														}
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="input-group">
                            <input type="text" placeholder=" " class="input-field" name="name" value="${
															user.name
														}" required>
                            <label class="input-label">Họ và tên</label>
                            <div class="error-message text-sm text-red-600 mt-1"></div>
                        </div>
                        <div class="input-group">
                            <div class="password-container relative">
                                <input type="password" placeholder=" " class="input-field pr-10" name="password">
                                <label class="input-label">Mật khẩu mới (để trống nếu không đổi)</label>
                                <img loading="lazy" src="./svg/show-password.svg" class="w-6 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer toggle-password" alt="Hiện mật khẩu">
                            </div>
                            <div class="error-message text-sm text-red-600 mt-1"></div>
                        </div>
                        <div class="input-group">
                             <div class="password-container relative">
                                <input type="password" placeholder=" " class="input-field pr-10" name="confirm_password">
                                <label class="input-label">Xác nhận mật khẩu mới</label>
                                <img loading="lazy" src="./svg/show-password.svg" class="w-6 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer toggle-password" alt="Hiện mật khẩu">
                            </div>
                            <div class="error-message text-sm text-red-600 mt-1"></div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mt-6">
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" class="admin-toggle h-4 w-4 text-black border-gray-300 rounded focus:ring-black" ${
															user.isAdmin ? "checked" : ""
														}>
                            <span class="ml-2 text-sm text-gray-700">Đặt làm quản trị viên</span>
                        </label>
                    </div>
                    <div class="flex gap-4 mt-6">
                        <button type="submit" class="flex-1 w-full bg-black text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800 transition-colors">Lưu thay đổi</button>
                        <button type="button" class="delete-user-btn flex-1 w-full bg-red-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors">Xóa</button>
                    </div>
                    <div class="save-feedback text-green-600 text-sm font-semibold text-center mt-2 h-5"></div>
                </form>
            `;
			userListContainer.appendChild(userCard);
		});
	};
	userListContainer.addEventListener("click", (e) => {
		if (e.target.closest(".drop-zone")) {
			e.target
				.closest(".user-update-form")
				.querySelector(".file-input")
				.click();
		}
		if (e.target.classList.contains("delete-user-btn")) {
			const form = e.target.closest(".user-update-form");
			const userEmail = form.dataset.email;
			if (
				confirm(
					`Bạn có chắc chắn muốn xóa người dùng ${userEmail} không? Hành động này không thể hoàn tác.`
				)
			) {
				allUsers = allUsers.filter((user) => user.email !== userEmail);
				localStorage.setItem("users", JSON.stringify(allUsers));
				renderUserList();
			}
		}
		if (e.target.classList.contains("toggle-password")) {
			const passwordInput = e.target.parentElement.querySelector("input");
			if (passwordInput.type === "password") {
				passwordInput.type = "text";
				e.target.src = "./svg/hide-password.svg";
				e.target.alt = "Ẩn mật khẩu";
			} else {
				passwordInput.type = "password";
				e.target.src = "./svg/show-password.svg";
				e.target.alt = "Hiện mật khẩu";
			}
		}
	});
	userListContainer.addEventListener("focusout", (e) => {
		const form = e.target.closest("form");
		if (!form) return;
		const passwordInput = form.querySelector('input[name="password"]');
		const confirmPasswordInput = form.querySelector(
			'input[name="confirm_password"]'
		);
		if (e.target === passwordInput) {
			checkPasswordStrength(passwordInput);
			if (confirmPasswordInput.value) {
				if (passwordInput.value !== confirmPasswordInput.value) {
					showError(confirmPasswordInput, "Mật khẩu xác nhận không khớp.");
				} else {
					showSuccess(confirmPasswordInput);
				}
			}
		}
		if (e.target === confirmPasswordInput) {
			if (passwordInput.value !== confirmPasswordInput.value) {
				showError(confirmPasswordInput, "Mật khẩu xác nhận không khớp.");
			} else {
				showSuccess(confirmPasswordInput);
			}
		}
	});
	userListContainer.addEventListener("change", (e) => {
		if (e.target.classList.contains("file-input")) {
			const file = e.target.files[0];
			const form = e.target.closest(".user-update-form");
			const previewImg = form.querySelector(".profile-preview");
			if (file && file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onloadend = () => {
					previewImg.src = reader.result;
					form.dataset.newImageData = reader.result;
				};
				reader.readAsDataURL(file);
			}
		}
	});
	userListContainer.addEventListener("submit", (e) => {
		e.preventDefault();
		if (!e.target.classList.contains("user-update-form")) return;
		const form = e.target;
		const userEmail = form.dataset.email;
		const nameInput = form.querySelector('input[name="name"]');
		const passwordInput = form.querySelector('input[name="password"]');
		const confirmPasswordInput = form.querySelector(
			'input[name="confirm_password"]'
		);
		const adminToggle = form.querySelector(".admin-toggle");
		const feedbackEl = form.querySelector(".save-feedback");
		const isNameValid = nameInput.value.trim() !== "";
		if (!isNameValid) showError(nameInput, "Tên không được để trống.");
		else showSuccess(nameInput);
		let isPasswordSectionValid = true;
		const newPassword = passwordInput.value;
		const confirmPassword = confirmPasswordInput.value;
		if (newPassword || confirmPassword) {
			const isStrong = checkPasswordStrength(passwordInput);
			const isMatching = newPassword === confirmPassword;
			if (!isMatching)
				showError(confirmPasswordInput, "Mật khẩu xác nhận không khớp.");
			isPasswordSectionValid = isStrong && isMatching;
		}
		if (!isNameValid || !isPasswordSectionValid) return;
		const userIndex = allUsers.findIndex((user) => user.email === userEmail);
		if (userIndex > -1) {
			allUsers[userIndex].name = nameInput.value.trim();
			allUsers[userIndex].isAdmin = adminToggle.checked;
						if (newPassword) {
				allUsers[userIndex].password = CryptoJS.SHA256(newPassword).toString();
			}
			if (form.dataset.newImageData) {
				allUsers[userIndex].image_user_data = form.dataset.newImageData;
				delete form.dataset.newImageData;
			}
			localStorage.setItem("users", JSON.stringify(allUsers));
			feedbackEl.innerText = "Đã lưu thành công!";
			setTimeout(() => {
				renderUserList();
			}, 1500);
		}
	});
	renderUserList();
});
