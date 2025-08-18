document.addEventListener("DOMContentLoaded", () => {
	let dataProduct = [];
	const productsFromLS = localStorage.getItem("products");
	if (productsFromLS) {
		dataProduct = JSON.parse(productsFromLS);
	} else {
		console.log('Không tìm thấy dữ liệu "products" trong LocalStorage.');
	}
	const sliderData = dataProduct
		.map((product, index) => ({ ...product, originalIndex: index }))
		.filter((p) => p.banner_image_path && p.sort_description && p.quantity > 0);
	if (sliderData.length === 0) return;
	const sliderContainer = document.getElementById("slider-container");
	const dotsContainer = document.getElementById("slider-dots");
	const prevButton = document.getElementById("prev-slide");
	const nextButton = document.getElementById("next-slide");
	let currentIndex = 0;
	let slideInterval;

	const showProductModal = (product) => {
		// Create modal elements
		const modalOverlay = document.createElement("div");
		modalOverlay.className =
			"fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";
		modalOverlay.id = "product-modal-overlay";

		const modalContent = document.createElement("div");
		modalContent.className =
			"bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-w-4xl transform transition-transform duration-300 scale-95";

		modalContent.innerHTML = `
            <div class="p-6 relative">
                <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="md:w-1/2">
                        <img src="${product.image_path}" alt="${
			product.title
		}" class="w-full h-auto rounded-md object-cover">
                    </div>
                    <div class="md:w-1/2 flex flex-col">
                        <h2 class="text-3xl font-bold mb-3">${
													product.title
												}</h2>
                        <p class="text-gray-600 mb-6 flex-grow">${
													product.sort_description
												}</p>
                        <div class="text-2xl font-bold text-gray-800 mb-6">$${product.discountedPrice.toLocaleString(
													"vi-VN"
												)}</div>
                        <button id="modal-buy-now-btn" data-short-url="${
													product.short_url
												}" class="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors">Mua ngay</button>
                    </div>
                </div>
            </div>
        `;

		modalOverlay.appendChild(modalContent);
		document.body.appendChild(modalOverlay);

		// Add animations
		setTimeout(() => {
			modalOverlay.classList.add("opacity-100");
			modalContent.classList.add("scale-100");
		}, 10);

		// Close modal functionality
		const closeModal = () => {
			modalContent.classList.remove("scale-100");
			modalOverlay.classList.remove("opacity-100");
			setTimeout(() => {
				document.body.removeChild(modalOverlay);
			}, 300);
		};

		document.getElementById("close-modal-btn").onclick = closeModal;
		modalOverlay.onclick = (e) => {
			if (e.target === modalOverlay) {
				closeModal();
			}
		};

		// "Mua ngay" button functionality
		document
			.getElementById("modal-buy-now-btn")
			.addEventListener("click", (e) => {
				const currentUser = JSON.parse(localStorage.getItem("user-current"));
				if (!currentUser) {
					window.location.href = "./login.html";
					return;
				}

				const productShortUrl = e.target.getAttribute("data-short-url");
				const products = JSON.parse(localStorage.getItem("products")) || [];
				const productIndex = products.findIndex(
					(p) => p.short_url === productShortUrl
				);

				if (productIndex === -1) {
					showToast("Lỗi: Không tìm thấy sản phẩm.", false);
					return;
				}

				const product = products[productIndex];
				const quantityToAdd = 1;

				if (product.quantity < quantityToAdd) {
					showToast("Sản phẩm đã hết hàng.", false);
					return;
				}

				products[productIndex].quantity -= quantityToAdd;
				localStorage.setItem("products", JSON.stringify(products));

				let cart = JSON.parse(localStorage.getItem("cart")) || [];
				const existingCartItemIndex = cart.findIndex(
					(item) => item.short_url === productShortUrl
				);

				if (existingCartItemIndex > -1) {
					cart[existingCartItemIndex].quantity += quantityToAdd;
				} else {
					cart.push({
						name: product.title,
						price: product.discountedPrice,
						image: product.image_path,
						quantity: quantityToAdd,
						short_url: product.short_url,
					});
				}

				localStorage.setItem("cart", JSON.stringify(cart));

				showToast("Đã thêm vào giỏ hàng!");
				closeModal();

				// Update cart icon count
				if (typeof show_number_item_in_cart === "function") {
					show_number_item_in_cart();
				}
			});
	};

	// Toast notification function (copied from addToCart.js for standalone use)
	let toastTimeout;
	function showToast(message, isSuccess = true) {
		let toastNotification = document.getElementById("toast-notification");
		if (!toastNotification) {
			toastNotification = document.createElement("div");
			toastNotification.id = "toast-notification";
			document.body.appendChild(toastNotification);
		}
		const icon = isSuccess ? "✅" : "❌";
		toastNotification.innerHTML = `
            <span class="font-medium">${icon} ${message}</span>
            ${
							isSuccess
								? '<a href="./cart.html" class="underline hover:text-blue-500">Xem giỏ hàng</a>'
								: ""
						}
        `;
		toastNotification.classList.add("show");
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			toastNotification.classList.remove("show");
		}, 5000);
	}
	// --- End Modal Logic ---

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
			const buttonAlignment = isEven ? "justify-start" : "justify-end";
			slideItem.innerHTML = `
                <div class="container mx-auto h-full flex items-center px-4 ${contentAlignment}">
                    <div class="text-white font-bold w-full md:w-1/2 lg:w-1/3 p-4 md:p-0 ${textAlign}">
                        <h1 class="text-4xl lg:text-5xl mb-6">${product.title}</h1>
                        <p class="text-xl lg:text-2xl mb-6">${product.sort_description}</p>
                        <div class="flex ${buttonAlignment} items-start">
                          <a href="./product.html#${product.short_url}" class="button left border-solid border-1 pt-2 pb-2 pr-4 pl-4 mt-3 inline-block">
                              <span>Tìm hiểu thêm</span>
                          </a>
                          <button data-index="${index}" class="buy-now-btn button left border-solid border-1 pt-2 pb-2 pr-4 pl-4 mt-3 inline-block ml-4">
                              <span>Mua ngay</span>
                          </button>
                        </div>
                        
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

		// Add event listeners for the new "Mua ngay" buttons
		document.querySelectorAll(".buy-now-btn").forEach((button) => {
			button.addEventListener("click", (e) => {
				const productIndex = e.currentTarget.getAttribute("data-index");
				showProductModal(sliderData[productIndex]);
			});
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
