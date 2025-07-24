const profileIcon = document.getElementById("profile-icon");
const profileDropdown = document.getElementById("profile-dropdown");
if (profileIcon) {
	const currentUser = JSON.parse(localStorage.getItem("user-current"));
	const loggedInSrc = profileIcon.dataset.loggedInSrc;
	const loggedOutSrc = profileIcon.dataset.loggedOutSrc;
	if (currentUser) {
		profileIcon.src = loggedInSrc;
		profileIcon.alt = "Tài khoản đã đăng nhập";
		profileDropdown.innerHTML = `
                    <div class="px-4 py-2">
                        <p class="text-sm">Xin chào,</p>
                        <p class="font-medium text-gray-900 truncate">${currentUser.name}</p>
                    </div>
                    <hr>
                    <a href="#" id="logout-button" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng xuất</a>
                `;
		const logoutButton = document.getElementById("logout-button");
		if (logoutButton) {
			logoutButton.addEventListener("click", (e) => {
				e.preventDefault();
				localStorage.removeItem("user-current");
				alert("Bạn đã đăng xuất thành công.");
				window.location.reload();
			});
		}
	} else {
		profileIcon.src = loggedOutSrc;
		profileDropdown.innerHTML = `
                    <a href="./login.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng nhập</a>
                    <a href="./register.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng ký</a>
                `;
	}
}
