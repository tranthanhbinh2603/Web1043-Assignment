document.addEventListener("DOMContentLoaded", () => {
	// Lấy dữ liệu sản phẩm từ localStorage
	const allProducts = JSON.parse(localStorage.getItem("products"));

	// Kiểm tra dữ liệu sản phẩm
	if (!allProducts || !Array.isArray(allProducts)) {
		console.error("Lỗi: Dữ liệu sản phẩm không hợp lệ hoặc không tồn tại.");
		document.getElementById("filtered-products-container").innerHTML =
			'<p class="text-red-500 col-span-full text-center">Không thể tải dữ liệu sản phẩm.</p>';
		return;
	}

	// --- CÀI ĐẶT BAN ĐẦU ---

	// Lọc trước tất cả sản phẩm CÒN HÀNG. Đây là nguồn dữ liệu chính cho mọi thao tác lọc.
	const inStockProducts = allProducts.filter((p) => p.quantity > 0);

	// Ánh xạ từ category (tiếng Việt) sang type (tiếng Anh) để xử lý logic
	const categoryToTypeMap = {
		"bàn phím": "keyboard",
		chuột: "mouse",
		keycap: "keycap",
		khác: "other",
	};

	// Lấy tất cả các phần tử DOM cần thiết
	const searchInput = document.getElementById("search-input");
	const priceRange = document.getElementById("price-range");
	const priceValue = document.getElementById("price-value");
	const typeFiltersContainer = document.getElementById("type-filters");
	const productContainer = document.getElementById(
		"filtered-products-container"
	);
	const productCount = document.getElementById("product-count");
	const resetFiltersButton = document.getElementById("reset-filters");
	const paginationContainer = document.getElementById("pagination-container");

	const PRODUCTS_PER_PAGE = 8;
	let selectedTypes = []; // **THAY ĐỔI**: Biến để lưu các loại sản phẩm được chọn

	// --- CÁC HÀM RENDER GIAO DIỆN ---

	/**
	 * Render danh sách sản phẩm ra màn hình
	 * @param {Array} productsToRender - Mảng sản phẩm cần hiển thị
	 * @param {number} page - Trang hiện tại
	 */
	const renderProducts = (productsToRender, page) => {
		productContainer.innerHTML = "";
		productCount.textContent = `Hiển thị ${productsToRender.length} sản phẩm.`;

		if (productsToRender.length === 0) {
			productContainer.innerHTML =
				'<p class="text-gray-500 col-span-full text-center">Không tìm thấy sản phẩm nào phù hợp.</p>';
			return;
		}

		const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
		const paginatedProducts = productsToRender.slice(
			startIndex,
			startIndex + PRODUCTS_PER_PAGE
		);

		paginatedProducts.forEach((product) => {
			let starsHTML = "";
			for (let i = 0; i < 5; i++) {
				if (product.star_rate >= i + 1)
					starsHTML += `<img loading="lazy" class="w-4 h-4" src="./svg/star-full.svg" alt="Sao đầy">`;
				else if (product.star_rate >= i + 0.5)
					starsHTML += `<img loading="lazy" class="w-4 h-4" src="./svg/star-half.svg" alt="Nửa sao">`;
				else
					starsHTML += `<img loading="lazy" class="w-4 h-4" src="./svg/star-no.svg" alt="Sao rỗng">`;
			}

			const priceHTML =
				product.discountedPrice < product.originalPrice
					? `<span class="text-lg font-bold text-red-600">$${product.discountedPrice}</span>
                 <span class="text-sm text-gray-500 line-through ml-2">$${product.originalPrice}</span>`
					: `<span class="text-lg font-bold text-black">$${product.discountedPrice}</span>`;

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
                    <div class="text-sm text-gray-600 mb-3">${priceHTML}</div>
                </div>`;
			productContainer.appendChild(productCard);
		});
	};

	/**
	 * Render các nút phân trang
	 * @param {number} currentPage - Trang hiện tại
	 * @param {number} totalProducts - Tổng số sản phẩm (sau khi đã lọc)
	 */
	const renderPagination = (currentPage, totalProducts) => {
		paginationContainer.innerHTML = "";
		const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
		if (totalPages <= 1) return;

		const createPageLink = (
			page,
			text,
			isDisabled = false,
			isActive = false
		) => {
			const li = document.createElement("li");
			const a = document.createElement("a");
			const url = new URL(window.location);
			url.searchParams.set("page", page);
			a.href = url.href;
			a.textContent = text;
			a.className = `px-3 py-2 leading-tight border border-gray-300 ${
				isDisabled
					? "bg-white text-gray-500 cursor-not-allowed"
					: "bg-white text-blue-600 hover:bg-gray-100 hover:text-gray-700"
			} ${isActive ? "bg-blue-50 text-blue-600 border-blue-300" : ""}`;
			if (isActive) a.setAttribute("aria-current", "page");
			if (!isDisabled) {
				a.addEventListener("click", (e) => {
					e.preventDefault();
					window.history.pushState({ page: page }, "", url.href);
					applyFiltersAndRender();
				});
			}
			li.appendChild(a);
			return li;
		};

		const ul = document.createElement("ul");
		ul.className = "inline-flex -space-x-px";
		ul.appendChild(createPageLink(currentPage - 1, "Trước", currentPage === 1));
		for (let i = 1; i <= totalPages; i++) {
			ul.appendChild(createPageLink(i, i, false, i === currentPage));
		}
		ul.appendChild(
			createPageLink(currentPage + 1, "Sau", currentPage === totalPages)
		);
		paginationContainer.appendChild(ul);
	};

	/**
	 * **THAY ĐỔI**: Tạo và hiển thị các checkbox cho "Loại sản phẩm"
	 */
	const populateTypeFilters = () => {
		const productTypes = [
			{ value: "keycap", label: "Keycap" },
			{ value: "keyboard", label: "Bàn phím" },
			{ value: "mouse", label: "Chuột" },
			{ value: "other", label: "Khác" },
		];

		productTypes.forEach((type) => {
			const typeId = `type-${type.value}`;
			const checkboxWrapper = document.createElement("div");
			checkboxWrapper.className = "flex items-center";
			checkboxWrapper.innerHTML = `
                <input type="checkbox" id="${typeId}" value="${type.value}" class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black type-checkbox">
                <label for="${typeId}" class="ml-3 text-sm text-gray-600">${type.label}</label>`;
			typeFiltersContainer.appendChild(checkboxWrapper);
		});
	};

	// --- HÀM LỌC VÀ RENDER CHÍNH ---

	/**
	 * Hàm trung tâm: áp dụng tất cả các bộ lọc và cập nhật lại toàn bộ giao diện
	 */
	const applyFiltersAndRender = () => {
		const searchTerm = searchInput.value.toLowerCase();
		const maxPrice = parseFloat(priceRange.value);
		// **THAY ĐỔI**: Logic lọc giờ dựa vào mảng selectedTypes
		const filteredProducts = inStockProducts.filter((product) => {
			const productTypeInEnglish =
				categoryToTypeMap[product.category.toLowerCase()];

			const matchesSearch = product.title.toLowerCase().includes(searchTerm);
			const matchesPrice = product.discountedPrice <= maxPrice;
			// Nếu không có type nào được chọn, hiển thị tất cả. Nếu có, sản phẩm phải thuộc 1 trong các type đó.
			const matchesType =
				selectedTypes.length === 0 ||
				selectedTypes.includes(productTypeInEnglish);

			return matchesSearch && matchesPrice && matchesType;
		});

		const params = new URLSearchParams(window.location.search);
		const currentPage = parseInt(params.get("page"), 10) || 1;

		renderProducts(filteredProducts, currentPage);
		renderPagination(currentPage, filteredProducts.length);
	};

	// --- KHỞI TẠO TRANG ---

	/**
	 * Hàm chạy một lần duy nhất khi tải trang
	 */
	const initializePage = () => {
		populateTypeFilters();

		const params = new URLSearchParams(window.location.search);
		const searchQuery = params.get("s") || "";
		// **THAY ĐỔI**: Đọc nhiều type từ URL, ví dụ: ?type=keyboard,mouse
		const typeQuery = params.get("type") || "";
		selectedTypes = typeQuery ? typeQuery.split(",") : [];

		searchInput.value = decodeURIComponent(searchQuery);
		// **THAY ĐỔI**: Check vào tất cả các checkbox có trong URL
		document.querySelectorAll(".type-checkbox").forEach((checkbox) => {
			if (selectedTypes.includes(checkbox.value)) {
				checkbox.checked = true;
			}
		});

		applyFiltersAndRender();

		const handleFilterChange = () => {
			// **THAY ĐỔI**: Cập nhật mảng selectedTypes dựa trên các checkbox
			selectedTypes = Array.from(
				document.querySelectorAll(".type-checkbox:checked")
			).map((cb) => cb.value);

			const url = new URL(window.location);
			url.searchParams.set("page", "1");
			url.searchParams.set("s", searchInput.value);

			// **THAY ĐỔI**: Cập nhật URL với danh sách các type, nối với nhau bằng dấu phẩy
			if (selectedTypes.length > 0) {
				url.searchParams.set("type", selectedTypes.join(","));
			} else {
				url.searchParams.delete("type");
			}
			window.history.pushState({}, "", url.href);

			applyFiltersAndRender();
		};

		searchInput.addEventListener("input", handleFilterChange);
		priceRange.addEventListener("input", () => {
			priceValue.textContent = `$${priceRange.value}`;
			handleFilterChange();
		});
		// **THAY ĐỔI**: Gắn sự kiện cho các checkbox
		document.querySelectorAll(".type-checkbox").forEach((checkbox) => {
			checkbox.addEventListener("change", handleFilterChange);
		});

		resetFiltersButton.addEventListener("click", () => {
			window.history.pushState({}, "", window.location.pathname);

			searchInput.value = "";
			priceRange.value = priceRange.max;
			priceValue.textContent = `$${priceRange.max}`;
			// **THAY ĐỔI**: Reset mảng và bỏ check tất cả checkbox
			selectedTypes = [];
			document
				.querySelectorAll(".type-checkbox")
				.forEach((checkbox) => (checkbox.checked = false));

			applyFiltersAndRender();
		});

		window.addEventListener("popstate", initializePage);
	};

	// Bắt đầu chạy ứng dụng
	initializePage();
});
