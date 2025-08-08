const profileIcon = document.getElementById("profile-icon");
const profileDropdown = document.getElementById("profile-dropdown");

function show_number_item_in_cart() {
	const cartCountElement = document.getElementById("cart-count");
	if (cartCountElement) {
		const cart = JSON.parse(localStorage.getItem("cart")) || [];
		const cartItemCount = cart.length;
		if (cartItemCount > 0) {
			cartCountElement.textContent = cartItemCount;
			cartCountElement.classList.remove("hidden");
		} else {
			cartCountElement.classList.add("hidden");
		}
	} else if (cartCountElement) {
		cartCountElement.classList.add("hidden");
	}
}

if (profileIcon) {
	const currentUser = JSON.parse(localStorage.getItem("user-current"));
	const loggedInSrc = profileIcon.dataset.loggedInSrc;
	const loggedOutSrc = profileIcon.dataset.loggedOutSrc;
	if (currentUser) {
		if (currentUser.image_user_data) {
			profileIcon.src = currentUser.image_user_data;
		} else {
			profileIcon.src = loggedInSrc;
		}
		profileIcon.alt = "Tài khoản đã đăng nhập";
		let dropdownHTML = `
                <div class="px-4 py-2">
                    <p class="text-sm">Xin chào,</p>
                    <p class="font-medium text-gray-900 truncate">${currentUser.name}</p>
                </div>
                <hr>
                <a href="./profile.html" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Thông tin cá nhân</a>
            `;
		if (currentUser.isAdmin) {
			dropdownHTML += `
                    <a href="./admin.html" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Quản lý người dùng</a>
                `;
		}
		dropdownHTML += `
                <a href="#" id="logout-button" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng xuất</a>
            `;
		profileDropdown.innerHTML = dropdownHTML;
		const logoutButton = document.getElementById("logout-button");
		if (logoutButton) {
			logoutButton.addEventListener("click", (e) => {
				e.preventDefault();
				localStorage.removeItem("user-current");
				alert("Bạn đã đăng xuất thành công.");
				window.location.reload();
			});
		}
		show_number_item_in_cart();
	} else {
		profileIcon.src = loggedOutSrc;
		profileDropdown.innerHTML = `
                <a href="./login.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng nhập</a>
                <a href="./register.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng ký</a>
            `;
	}
}
