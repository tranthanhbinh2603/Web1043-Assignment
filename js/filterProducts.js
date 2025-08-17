document.addEventListener("DOMContentLoaded", () => {
	const products = JSON.parse(localStorage.getItem("products"));

	if (!products || !Array.isArray(products)) {
		console.error(
			"Lỗi: Dữ liệu sản phẩm trong Local Storage không hợp lệ hoặc không tồn tại."
		);
		return;
	}

	const searchInput = document.getElementById("search-input");
	const priceRange = document.getElementById("price-range");
	const priceValue = document.getElementById("price-value");
	const categoryFiltersContainer = document.getElementById("category-filters");
	const productContainer = document.getElementById(
		"filtered-products-container"
	);
	const productCount = document.getElementById("product-count");
	const resetFiltersButton = document.getElementById("reset-filters");

	let selectedCategories = [];

	// Handle search query from URL
	const params = new URLSearchParams(window.location.search);
	const searchQuery = params.get("s");
	if (searchQuery) {
		searchInput.value = decodeURIComponent(searchQuery);
	}

	const renderProducts = (productsToRender) => {
		productContainer.innerHTML = "";
		productCount.textContent = `Đang hiển thị ${productsToRender.length} sản phẩm.`;

		if (productsToRender.length === 0) {
			productContainer.innerHTML =
				'<p class="text-gray-500 col-span-full text-center">Không tìm thấy sản phẩm nào phù hợp.</p>';
			return;
		}

		productsToRender.forEach((product) => {
			let starsHTML = "";
			for (let i = 0; i < 5; i++) {
				if (product.star_rate >= i + 1)
					starsHTML += `<img loading="lazy" class="w-4 h-4" src="./svg/star-full.svg" alt="Sao đầy">`;
				else if (product.star_rate >= i + 0.5)
					starsHTML += `<img loading="lazy" class="w-4 h-4" src="./svg/star-half.svg" alt="Nửa sao">`;
				else
					starsHTML += `<img loading="lazy" class="w-4 h-4" src="./svg/star-no.svg" alt="Sao rỗng">`;
			}

			let priceHTML = "";
			if (product.discountedPrice < product.originalPrice) {
				priceHTML = `
                    <span class="text-lg font-bold text-red-600">$${product.discountedPrice}</span>
                    <span class="text-sm text-gray-500 line-through ml-2">$${product.originalPrice}</span>
                `;
			} else {
				priceHTML = `<span class="text-lg font-bold text-black">$${product.discountedPrice}</span>`;
			}

			const productCard = document.createElement("a");
			productCard.href = `./product.html#${product.short_url}`;
			productCard.className =
				"group block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col";
			const imagePath = product.image_path.replace("../../", "./");

			productCard.innerHTML = `
                <div class="overflow-hidden">
                    <img loading="lazy" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        src="${imagePath}" alt="${product.title}">
                </div>
                <div class="p-4 flex flex-col flex-grow">
                    <h3 class="font-semibold text-black mb-2 text-lg flex-grow min-h-[5rem]">${product.title}</h3>
                    <div class="flex items-center gap-2 mb-3">
                        <div class="flex">${starsHTML}</div>
                        <p class="text-xs text-gray-500 font-normal">(${product.rate_count})</p>
                    </div>
                    <div class="text-sm text-gray-600 mb-3">
                        ${priceHTML}
                    </div>
                </div>
            `;
			productContainer.appendChild(productCard);
		});
	};

	const filterAndRender = () => {
		const searchTerm = searchInput.value.toLowerCase();
		const maxPrice = parseFloat(priceRange.value);

		const filteredProducts = products.filter((product) => {
			const matchesSearch = product.title.toLowerCase().includes(searchTerm);
			const matchesPrice = product.discountedPrice <= maxPrice;
			const matchesCategory =
				selectedCategories.length === 0 ||
				selectedCategories.includes(product.category);
			return matchesSearch && matchesPrice && matchesCategory;
		});

		renderProducts(filteredProducts);
	};

	const populateCategoryFilters = () => {
		const categories = [...new Set(products.map((p) => p.category))];
		categoryFiltersContainer.innerHTML = ""; // Clear existing
		categories.forEach((category) => {
			const categoryId = `cat-${category.replace(/\s+/g, "-")}`;
			const checkboxWrapper = document.createElement("div");
			checkboxWrapper.className = "flex items-center";
			checkboxWrapper.innerHTML = `
                <input type="checkbox" id="${categoryId}" value="${category}" class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black category-checkbox">
                <label for="${categoryId}" class="ml-3 text-sm text-gray-600 capitalize">${category}</label>
            `;
			categoryFiltersContainer.appendChild(checkboxWrapper);
		});

		document.querySelectorAll(".category-checkbox").forEach((checkbox) => {
			checkbox.addEventListener("change", (e) => {
				if (e.target.checked) {
					selectedCategories.push(e.target.value);
				} else {
					selectedCategories = selectedCategories.filter(
						(cat) => cat !== e.target.value
					);
				}
				filterAndRender();
			});
		});
	};

	// Event Listeners
	searchInput.addEventListener("input", filterAndRender);
	priceRange.addEventListener("input", () => {
		priceValue.textContent = `$${priceRange.value}`;
		filterAndRender();
	});

	resetFiltersButton.addEventListener("click", () => {
		searchInput.value = "";
		priceRange.value = priceRange.max;
		priceValue.textContent = `$${priceRange.max}`;
		selectedCategories = [];

		// Clear search query in URL
		const url = new URL(window.location);
		url.searchParams.delete("s");
		window.history.pushState({}, "", url);

		document
			.querySelectorAll(".category-checkbox")
			.forEach((cb) => (cb.checked = false));
		filterAndRender();
	});

	// Initial Load
	populateCategoryFilters();
	filterAndRender();
});