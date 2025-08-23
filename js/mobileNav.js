const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");
const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

if (menuToggle) {
	menuToggle.addEventListener("click", () => {
		mobileMenu.classList.remove("-translate-x-full");
		mobileMenuOverlay.classList.remove("hidden");
		document.body.style.overflow = "hidden";
	});

	function closeMobileMenu() {
		mobileMenu.classList.add("-translate-x-full");
		mobileMenuOverlay.classList.add("hidden");
		document.body.style.overflow = "auto";
	}

	closeMenu.addEventListener("click", closeMobileMenu);
	mobileMenuOverlay.addEventListener("click", closeMobileMenu);

	window.addEventListener("resize", () => {
		if (window.innerWidth >= 768) {
			closeMobileMenu();
		}
	});
}
