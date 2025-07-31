document.addEventListener("DOMContentLoaded", () => {
	if (typeof dataProduct === "undefined") {
		console.error("Lỗi: Dữ liệu sản phẩm (dataProduct) không được định nghĩa.");
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
	const filtersForm = document.getElementById("filters-form");
	let selectedCategories = [];
	const params = new URLSearchParams(window.location.search);
	const searchQuery = params.get("s");
	if (searchQuery) {
		searchInput.value = decodeURIComponent(searchQuery);
	}
	const renderProducts = (products) => {
		productContainer.innerHTML = "";
		productCount.textContent = `Đang hiển thị ${products.length} sản phẩm.`;
		if (products.length === 0) {
			productContainer.innerHTML =
				'<p class="text-gray-500 col-span-full text-center">Không tìm thấy sản phẩm nào phù hợp.</p>';
			return;
		}
		products.forEach((product) => {
			let starsHTML = "";
			for (let i = 0; i < 5; i++) {
				if (product.star_rate >= i + 1)
					starsHTML += `<img class="w-4 h-4" src="./svg/star-full.svg" alt="Sao đầy">`;
				else if (product.star_rate >= i + 0.5)
					starsHTML += `<img class="w-4 h-4" src="./svg/star-half.svg" alt="Nửa sao">`;
				else
					starsHTML += `<img class="w-4 h-4" src="./svg/star-no.svg" alt="Sao rỗng">`;
			}
			const productCard = document.createElement("a");
			productCard.href = `./product.html?index=${product.id}`;
			productCard.className =
				"group block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col";
			const imagePath = product.image_path.replace("../../", "./");
			productCard.innerHTML = `
                <div class="overflow-hidden">
                    <img class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        src="${imagePath}" alt="${product.title}">
                </div>
                <div class="p-4 flex flex-col flex-grow">
                    <h3 class="font-semibold text-black mb-2 text-lg flex-grow">${product.title}</h3>
                    <div class="flex items-center gap-2 mb-3">
                        <div class="flex">${starsHTML}</div>
                        <p class="text-xs text-gray-500 font-normal">(${product.rate_count})</p>
                    </div>
                    <p class="text-sm text-gray-600">Từ <span class="text-lg font-bold text-black">$${product.price}</span></p>
                </div>
            `;
			productContainer.appendChild(productCard);
		});
	};
	const filterAndRender = () => {
		const searchTerm = searchInput.value.toLowerCase();
		const maxPrice = parseFloat(priceRange.value);
		let filteredProducts = dataProduct.filter((product) => {
			const matchesSearch = product.title.toLowerCase().includes(searchTerm);
			const matchesPrice = product.price <= maxPrice;
			const matchesCategory =
				selectedCategories.length === 0 ||
				selectedCategories.includes(product.category);
			return matchesSearch && matchesPrice && matchesCategory;
		});
		renderProducts(filteredProducts);
	};
	const initializeFilters = () => {
		const categories = [
			...new Set(dataProduct.map((p) => p.category).filter(Boolean)),
		];
		categoryFiltersContainer.innerHTML = categories
			.map(
				(category) => `
            <div class="flex items-center">
                <input type="checkbox" id="cat-${category.replace(
									/\s+/g,
									"-"
								)}" value="${category}" class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black category-checkbox">
                <label for="cat-${category.replace(
									/\s+/g,
									"-"
								)}" class="ml-3 text-sm text-gray-600">${category}</label>
            </div>
        `
			)
			.join("");
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
	searchInput.addEventListener("input", filterAndRender);
	priceRange.addEventListener("input", () => {
		priceValue.textContent = `$${priceRange.value}`;
		filterAndRender();
	});
	resetFiltersButton.addEventListener("click", () => {
		searchInput.value = "";
		priceRange.value = priceRange.max;
		const url = new URL(window.location);
		url.searchParams.delete("s");
		window.history.pushState({}, "", url);
		priceValue.textContent = `$${priceRange.max}`;
		selectedCategories = [];
		document
			.querySelectorAll(".category-checkbox")
			.forEach((cb) => (cb.checked = false));
		filterAndRender();
	});
	initializeFilters();
	filterAndRender();
});
