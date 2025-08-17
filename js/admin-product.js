document.addEventListener("DOMContentLoaded", () => {
	// --- AUTHENTICATION ---
	const loggedInUser = JSON.parse(localStorage.getItem("user-current"));
	if (!loggedInUser || !loggedInUser.isAdmin) {
		window.location.href = "./index.html";
		return; // Stop script execution
	}

	// --- DOM ELEMENTS ---
	const productTableBody = document.getElementById("product-table-body");
	const modal = document.getElementById("product-modal");
	const modalTitle = document.getElementById("modal-title");
	const closeModalBtn = document.getElementById("close-modal-btn");
	const cancelBtn = document.getElementById("cancel-btn");
	const productForm = document.getElementById("product-form");
	const saleCheckbox = document.getElementById("product-sale");
	const salePriceContainer = document.getElementById("sale-price-container");
	const addProductBtn = document.getElementById("add-product-btn");

	let products = [];

	// --- DATA HANDLING ---
	const loadProducts = () => {
		const storedProducts = localStorage.getItem("products");
		// If 'products' isn't in localStorage, initData.js should have run and set it.
		// We parse it directly. If it's still missing, it's an issue with initData.js
		products = storedProducts ? JSON.parse(storedProducts) : [];
		renderTable();
	};

	const saveProducts = () => {
		localStorage.setItem("products", JSON.stringify(products));
	};

	// --- RENDERING ---
	const renderTable = () => {
		productTableBody.innerHTML = "";
		if (products.length === 0) {
			productTableBody.innerHTML =
				'<tr><td colspan="6" class="text-center py-4">Không có sản phẩm nào.</td></tr>';
			return;
		}

		products.forEach((product) => {
			const row = document.createElement("tr");
			row.className = "hover:bg-gray-50";
			row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <img src="${product.image_path}" alt="${
				product.title
			}" class="w-16 h-16 object-cover rounded-md">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${
											product.title
										}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600 capitalize">${
											product.category
										}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-800">$${
											product.originalPrice
										}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm ${
											product.discountedPrice != product.originalPrice
												? "text-red-600 font-bold"
												: "text-gray-500"
										}">
                        ${
													product.discountedPrice != product.originalPrice
														? `$${product.discountedPrice}`
														: "Không"
												}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <button data-id="${
											product.id
										}" class="edit-btn text-indigo-600 hover:text-indigo-900">Sửa</button>
                    <button data-id="${
											product.id
										}" class="delete-btn text-red-600 hover:text-red-900">Xóa</button>
                </td>
            `;
			productTableBody.appendChild(row);
		});
	};

	// --- MODAL HANDLING ---
	const openModal = (product = null) => {
		productForm.reset();
		const imageSelect = document.getElementById("product-image");
		imageSelect.innerHTML = "";
		for (let i = 1; i <= 10; i++) {
			const imageName = `Product-${i}.webp`;
			const option = document.createElement("option");
			option.value = imageName;
			option.textContent = imageName;
			imageSelect.appendChild(option);
		}

		if (product) {
			// Edit mode
			modalTitle.textContent = "Chỉnh sửa sản phẩm";
			document.getElementById("product-id").value = product.id;
			document.getElementById("product-name").value = product.name;
			document.getElementById("product-description").value =
				product.description;
			document.getElementById("product-category").value = product.category;
			document.getElementById("product-price").value = product.price;
			saleCheckbox.checked = product.sale;
			document.getElementById("product-sale-price").value =
				product.salePrice || "";
			imageSelect.value = product.image;
		} else {
			// Add mode
			modalTitle.textContent = "Thêm sản phẩm mới";
			document.getElementById("product-id").value = ""; // Clear ID for new product
		}

		toggleSalePriceVisibility();
		modal.classList.remove("hidden");
	};

	const closeModal = () => {
		modal.classList.add("hidden");
	};

	const toggleSalePriceVisibility = () => {
		salePriceContainer.style.display = saleCheckbox.checked ? "block" : "none";
	};

	// --- CRUD OPERATIONS ---
	const handleFormSubmit = (e) => {
		e.preventDefault();
		const productId = document.getElementById("product-id").value;

		const productData = {
			name: document.getElementById("product-name").value,
			image: document.getElementById("product-image").value,
			description: document.getElementById("product-description").value,
			category: document.getElementById("product-category").value,
			price: parseFloat(document.getElementById("product-price").value),
			sale: saleCheckbox.checked,
			salePrice: saleCheckbox.checked
				? parseFloat(document.getElementById("product-sale-price").value)
				: null,
			rating: 5, // Default value for new products
			reviews: 0, // Default value for new products
		};

		if (productId) {
			// Update existing product
			const productIndex = products.findIndex((p) => p.id == productId);
			if (productIndex !== -1) {
				products[productIndex] = {
					...products[productIndex],
					...productData,
					id: parseInt(productId),
				};
			}
		} else {
			// Add new product
			const newId =
				products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
			products.push({ ...productData, id: newId });
		}

		saveProducts();
		closeModal();
		renderTable();
	};

	const handleDelete = (productId) => {
		if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
			products = products.filter((p) => p.id !== productId);
			saveProducts();
			renderTable();
		}
	};

	// --- EVENT LISTENERS ---
	productTableBody.addEventListener("click", (e) => {
		const target = e.target;
		const productId = parseInt(target.dataset.id, 10);

		if (target.classList.contains("edit-btn")) {
			const product = products.find((p) => p.id === productId);
			if (product) openModal(product);
		} else if (target.classList.contains("delete-btn")) {
			handleDelete(productId);
		}
	});

	addProductBtn.addEventListener("click", () => openModal());
	closeModalBtn.addEventListener("click", closeModal);
	cancelBtn.addEventListener("click", closeModal);
	productForm.addEventListener("submit", handleFormSubmit);
	saleCheckbox.addEventListener("change", toggleSalePriceVisibility);

	window.addEventListener("click", (e) => {
		if (e.target === modal) {
			closeModal();
		}
	});

	// --- INITIAL LOAD ---
	loadProducts();
});
