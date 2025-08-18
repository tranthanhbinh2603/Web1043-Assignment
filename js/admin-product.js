document.addEventListener("DOMContentLoaded", () => {
	tinymce.init({
		selector: "#product-description",
		plugins: "lists link code",
		toolbar: "undo redo | blocks | bold italic | bullist numlist | link | code",
		menubar: false,
		height: 300,
		setup: function (editor) {
			editor.on("change", function () {
				editor.save();
			});
		},
	});
	const loggedInUser = JSON.parse(localStorage.getItem("user-current"));
	if (!loggedInUser || !loggedInUser.isAdmin) {
		window.location.href = "./index.html";
		return;
	}
	const productTableBody = document.getElementById("product-table-body");
	const modal = document.getElementById("product-modal");
	const modalTitle = document.getElementById("modal-title");
	const closeModalBtn = document.getElementById("close-modal-btn");
	const cancelBtn = document.getElementById("cancel-btn");
	const productForm = document.getElementById("product-form");
	const saleCheckbox = document.getElementById("product-sale");
	const salePriceContainer = document.getElementById("sale-price-container");
	const addProductBtn = document.getElementById("add-product-btn");
	const imageGrid = document.getElementById("product-image-grid");
	const imageValueInput = document.getElementById("product-image-value");
	const showError = (input, message) => {
		const inputGroup = input.closest(".input-group");
		if (inputGroup) {
			const errorDisplay = inputGroup.querySelector(".error-message");
			if (errorDisplay) {
				errorDisplay.innerText = message;
			}
		}
		if (input.id === "product-description") {
			const editorContainer = inputGroup.querySelector(".tox");
			if (editorContainer) {
				editorContainer.classList.add("error");
				editorContainer.classList.remove("success");
			}
		} else {
			input.classList.add("error");
			input.classList.remove("success");
		}
	};
	const showSuccess = (input) => {
		const inputGroup = input.closest(".input-group");
		if (inputGroup) {
			const errorDisplay = inputGroup.querySelector(".error-message");
			if (errorDisplay) {
				errorDisplay.innerText = "";
			}
		}
		if (input.id === "product-description") {
			const editorContainer = inputGroup.querySelector(".tox");
			if (editorContainer) {
				editorContainer.classList.add("success");
				editorContainer.classList.remove("error");
			}
		} else {
			input.classList.add("success");
			input.classList.remove("error");
		}
	};
	const checkRequired = (input) => {
		if (input.value.trim() === "") {
			showError(input, "Vui lòng không để trống trường này.");
			return false;
		}
		showSuccess(input);
		return true;
	};
	const nameInput = document.getElementById("product-name");
	const descriptionInput = document.getElementById("product-description");
	const categoryInput = document.getElementById("product-category");
	const quantityInput = document.getElementById("product-quantity");
	const shortUrlInput = document.getElementById("product-short-url");
	const priceInput = document.getElementById("product-price");
	const salePriceInput = document.getElementById("product-sale-price");
	const validateShortUrl = () => {
		if (!checkRequired(shortUrlInput)) return false;
		const urlValue = shortUrlInput.value.trim();
		if (urlValue.includes(" ")) {
			showError(shortUrlInput, "URL ngắn không được chứa khoảng trắng.");
			return false;
		}
		const currentProductId = document.getElementById("product-id").value;
		const isDuplicate = products.some((product) => {
			return (
				product.short_url === urlValue && product.short_url !== currentProductId
			);
		});
		if (isDuplicate) {
			showError(
				shortUrlInput,
				"URL ngắn đã tồn tại. Vui lòng chọn một URL khác."
			);
			return false;
		}
		showSuccess(shortUrlInput);
		return true;
	};
	const validatePrices = () => {
		if (!checkRequired(priceInput)) return false;
		const originalPrice = parseFloat(priceInput.value);
		const salePrice = parseFloat(salePriceInput.value);
		const isOnSale = saleCheckbox.checked;
		if (isOnSale) {
			if (!checkRequired(salePriceInput)) return false;
			if (salePrice >= originalPrice) {
				showError(salePriceInput, "Giá khuyến mãi phải nhỏ hơn giá gốc.");
				return false;
			}
		}
		showSuccess(priceInput);
		showSuccess(salePriceInput);
		return true;
	};
	const validateImage = () => {
		if (imageValueInput.value === "") {
			const imageGroup = imageGrid.closest(".input-group");
			const errorDisplay = imageGroup.querySelector(".error-message");
			if (errorDisplay) {
				errorDisplay.innerText = "Vui lòng chọn một hình ảnh cho sản phẩm.";
			}
			imageGrid.classList.add("error");
			return false;
		} else {
			const imageGroup = imageGrid.closest(".input-group");
			const errorDisplay = imageGroup.querySelector(".error-message");
			if (errorDisplay) {
				errorDisplay.innerText = "";
			}
			imageGrid.classList.remove("error");
			return true;
		}
	};
	const validateDescription = () => {
		const content = tinymce.get("product-description").getContent();
		if (content.trim() === "") {
			showError(descriptionInput, "Vui lòng nhập mô tả cho sản phẩm.");
			return false;
		}
		showSuccess(descriptionInput);
		return true;
	};
	let products = [];
	const loadProducts = () => {
		const storedProducts = localStorage.getItem("products");
		products = storedProducts ? JSON.parse(storedProducts) : [];
		renderTable();
	};
	const saveProducts = () => {
		localStorage.setItem("products", JSON.stringify(products));
	};
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
											product.discountedPrice !== product.originalPrice
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
											product.short_url
										}" class="edit-btn text-indigo-600 hover:text-indigo-900">Sửa</button>
                    <button data-id="${
											product.short_url
										}" class="delete-btn text-red-600 hover:text-red-900">Xóa</button>
                </td>
            `;
			productTableBody.appendChild(row);
		});
	};
	const selectImage = (imageName) => {
		imageValueInput.value = imageName;
		const allImages = imageGrid.querySelectorAll("img");
		allImages.forEach((img) => {
			if (img.dataset.value === imageName) {
				img.classList.add("ring-2", "ring-blue-500");
				img.classList.remove("border-transparent");
			} else {
				img.classList.remove("ring-2", "ring-blue-500");
				img.classList.add("border-transparent");
			}
		});
	};
	const openModal = (product = null) => {
		productForm.reset();
		imageGrid.innerHTML = "";
		for (let i = 1; i <= 10; i++) {
			const imageName = `Product-${i}.webp`;
			const img = document.createElement("img");
			img.src = `./img/${imageName}`;
			img.alt = `Product ${i}`;
			img.dataset.value = imageName;
			img.className =
				"w-24 h-24 object-cover rounded-md cursor-pointer border-2 border-transparent hover:ring-2 hover:ring-blue-400";
			imageGrid.appendChild(img);
		}
		if (product) {
			modalTitle.textContent = "Chỉnh sửa sản phẩm";
			document.getElementById("product-id").value = product.short_url;
			document.getElementById("product-name").value = product.title;
			tinymce.get("product-description").setContent(product.description || "");
			document.getElementById("product-category").value = product.category;
			document.getElementById("product-quantity").value = product.quantity;
			document.getElementById("product-short-url").value = product.short_url;
			document.getElementById("product-price").value = product.originalPrice;
			const isOnSale = product.discountedPrice !== product.originalPrice;
			saleCheckbox.checked = isOnSale;
			if (isOnSale) {
				document.getElementById("product-sale-price").value =
					product.discountedPrice;
			}
			const imageName = product.image_path.split("/").pop();
			selectImage(imageName);
		} else {
			modalTitle.textContent = "Thêm sản phẩm mới";
			document.getElementById("product-id").value = "";
			tinymce.get("product-description").setContent("");
			imageValueInput.value = "";
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
	const handleFormSubmit = (e) => {
		e.preventDefault();
		const isNameValid = checkRequired(nameInput);
		const isImageValid = validateImage();
		const isDescriptionValid = validateDescription();
		const isCategoryValid = checkRequired(categoryInput);
		const isQuantityValid = checkRequired(quantityInput);
		const isUrlValid = validateShortUrl();
		const arePricesValid = validatePrices();
		if (
			!isNameValid ||
			!isImageValid ||
			!isDescriptionValid ||
			!isCategoryValid ||
			!isQuantityValid ||
			!isUrlValid ||
			!arePricesValid
		) {
			return;
		}
		const description = tinymce.get("product-description").getContent();
		const productShortUrl = document.getElementById("product-id").value;
		const originalPrice = parseFloat(
			document.getElementById("product-price").value
		);
		const isOnSale = saleCheckbox.checked;
		const salePriceInput = document.getElementById("product-sale-price");
		const discountedPrice =
			isOnSale && salePriceInput.value
				? parseFloat(salePriceInput.value)
				: originalPrice;
		const productData = {
			title: document.getElementById("product-name").value,
			image_path: `./img/${imageValueInput.value}`,
			description: description,
			category: document.getElementById("product-category").value,
			quantity: parseInt(document.getElementById("product-quantity").value, 10),
			short_url: document.getElementById("product-short-url").value,
			originalPrice: originalPrice,
			discountedPrice: discountedPrice,
		};
		if (productShortUrl) {
			const productIndex = products.findIndex(
				(p) => p.short_url === productShortUrl
			);
			if (productIndex !== -1) {
				const existingProduct = products[productIndex];
				products[productIndex] = {
					...existingProduct,
					...productData,
				};
			}
		} else {
			products.push({
				...productData,
				sort_description: "",
				banner_image_path: "",
				star_rate: 5,
				rate_count: Math.floor(Math.random() * (100 - 10 + 1)) + 10,
			});
		}
		saveProducts();
		closeModal();
		renderTable();
	};
	const handleDelete = (productShortUrl) => {
		if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
			products = products.filter((p) => p.short_url !== productShortUrl);
			saveProducts();
			renderTable();
		}
	};
	nameInput.addEventListener("blur", () => checkRequired(nameInput));
	categoryInput.addEventListener("blur", () => checkRequired(categoryInput));
	quantityInput.addEventListener("blur", () => checkRequired(quantityInput));
	shortUrlInput.addEventListener("blur", validateShortUrl);
	priceInput.addEventListener("blur", validatePrices);
	salePriceInput.addEventListener("blur", validatePrices);
	tinymce.get("product-description").on("blur", validateDescription);
	imageGrid.addEventListener("click", (e) => {
		if (e.target.tagName === "IMG") {
			const imageName = e.target.dataset.value;
			selectImage(imageName);
			validateImage();
		}
	});
	productTableBody.addEventListener("click", (e) => {
		const target = e.target;
		if (
			target.classList.contains("edit-btn") ||
			target.classList.contains("delete-btn")
		) {
			const productId = target.dataset.id;
			if (target.classList.contains("edit-btn")) {
				const product = products.find((p) => p.short_url === productId);
				if (product) openModal(product);
			} else if (target.classList.contains("delete-btn")) {
				handleDelete(productId);
			}
		}
	});
	addProductBtn.addEventListener("click", () => openModal());
	closeModalBtn.addEventListener("click", closeModal);
	cancelBtn.addEventListener("click", closeModal);
	productForm.addEventListener("submit", handleFormSubmit);
	saleCheckbox.addEventListener("change", toggleSalePriceVisibility);
	window.addEventListener("mousedown", (e) => {
		if (e.target === modal) {
			closeModal();
		}
	});
	loadProducts();
});
