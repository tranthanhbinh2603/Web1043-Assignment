document.addEventListener("DOMContentLoaded", () => {
	if (typeof dataProduct === "undefined") {
		console.error("Lỗi: Dữ liệu sản phẩm (dataProduct) không được định nghĩa.");
		return;
	}
	const sliderData = dataProduct
		.map((product, index) => ({ ...product, originalIndex: index }))
		.filter((p) => p.banner_image_path && p.sort_description);
	if (sliderData.length === 0) return;
	const sliderContainer = document.getElementById("slider-container");
	const dotsContainer = document.getElementById("slider-dots");
	const prevButton = document.getElementById("prev-slide");
	const nextButton = document.getElementById("next-slide");
	let currentIndex = 0;
	let slideInterval;
	const initializeSlider = () => {
		sliderContainer.innerHTML = "";
		dotsContainer.innerHTML = "";
		sliderData.forEach((product, index) => {
			const slideItem = document.createElement("div");
			slideItem.className =
				"slider-item absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out";
			slideItem.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${product.banner_image_path}')`;
			slideItem.style.opacity = index === 0 ? "1" : "0";
			slideItem.style.pointerEvents = index === 0 ? "auto" : "none";
			const isEven = index % 2 === 0;
			const contentAlignment = isEven ? "" : "justify-end";
			const textAlign = isEven ? "" : "text-right";
			slideItem.innerHTML = `
                <div class="container mx-auto h-full flex items-center px-4 ${contentAlignment}">
                    <div class="text-white font-bold w-full md:w-1/2 lg:w-1/3 p-4 md:p-0 ${textAlign}">
                        <h1 class="text-4xl lg:text-5xl mb-6">${product.title}</h1>
                        <p class="text-xl lg:text-2xl mb-6">${product.sort_description}</p>
                        <a href="./product.html?index=${product.originalIndex}"
                            class="button left border-solid border-1 pt-2 pb-2 pr-4 pl-4 mt-3 inline-block">
                            <span>Tìm hiểu thêm</span>
                        </a>
                    </div>
                </div>
            `;
			sliderContainer.appendChild(slideItem);
			const dot = document.createElement("button");
			dot.className =
				"slider-dot w-3 h-3 rounded-full transition-colors duration-300";
			dot.classList.add(index === 0 ? "bg-white" : "bg-white/50");
			dot.addEventListener("click", () => {
				showSlide(index);
				resetInterval();
			});
			dotsContainer.appendChild(dot);
		});
	};
	const showSlide = (index) => {
		const slides = document.querySelectorAll(".slider-item");
		const dots = document.querySelectorAll(".slider-dot");
		slides.forEach((slide, i) => {
			slide.style.opacity = i === index ? "1" : "0";
			slide.style.pointerEvents = i === index ? "auto" : "none";
		});
		dots.forEach((dot, i) => {
			dot.classList.toggle("bg-white", i === index);
			dot.classList.toggle("bg-white/50", i !== index);
		});
		currentIndex = index;
	};
	const next = () => showSlide((currentIndex + 1) % sliderData.length);
	const prev = () =>
		showSlide((currentIndex - 1 + sliderData.length) % sliderData.length);
	const resetInterval = () => {
		clearInterval(slideInterval);
		slideInterval = setInterval(next, 5000);
	};
	nextButton.addEventListener("click", () => {
		next();
		resetInterval();
	});
	prevButton.addEventListener("click", () => {
		prev();
		resetInterval();
	});
	initializeSlider();
	resetInterval();
});
