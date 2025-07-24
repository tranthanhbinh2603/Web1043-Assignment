closeMenu.addEventListener("click", closeMobileMenu);
mobileMenuOverlay.addEventListener("click", closeMobileMenu);
window.addEventListener("resize", () => {
	if (window.innerWidth >= 768) {
		closeMobileMenu();
	}
});
const sliderContainer = document.getElementById("slider-container");
if (sliderContainer) {
	const slides = document.querySelectorAll(".slider-item");
	const prevBtn = document.getElementById("prev-slide");
	const nextBtn = document.getElementById("next-slide");
	const dotsContainer = document.getElementById("slider-dots");
	let currentSlide = 0;
	let slideInterval;
	if (slides.length > 1) {
		slides.forEach((_, index) => {
			const dot = document.createElement("button");
			dot.setAttribute("aria-label", `Chuyển đến slide ${index + 1}`);
			dot.classList.add(
				"w-3",
				"h-3",
				"rounded-full",
				"bg-white",
				"bg-opacity-50",
				"transition-all",
				"duration-300",
				"hover:bg-opacity-75"
			);
			dot.addEventListener("click", () => {
				showSlide(index);
				resetInterval();
			});
			dotsContainer.appendChild(dot);
		});
		const dots = dotsContainer.querySelectorAll("button");
		const showSlide = (index) => {
			slides.forEach((slide, i) => {
				slide.classList.toggle("opacity-100", i === index);
				slide.classList.toggle("opacity-0", i !== index);
			});
			dots.forEach((dot, i) => {
				dot.classList.toggle("bg-opacity-100", i === index);
				dot.classList.toggle("bg-opacity-50", i !== index);
			});
			currentSlide = index;
		};
		const nextSlide = () => {
			showSlide((currentSlide + 1) % slides.length);
		};
		const prevSlide = () => {
			showSlide((currentSlide - 1 + slides.length) % slides.length);
		};
		const startInterval = () => {
			slideInterval = setInterval(nextSlide, 15000);
		};
		const resetInterval = () => {
			clearInterval(slideInterval);
			startInterval();
		};
		nextBtn.addEventListener("click", () => {
			nextSlide();
			resetInterval();
		});
		prevBtn.addEventListener("click", () => {
			prevSlide();
			resetInterval();
		});
		showSlide(0);
		startInterval();
	}
}
