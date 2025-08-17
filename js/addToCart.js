document.addEventListener("DOMContentLoaded", () => {
	const addToCartButton = document.getElementById("add-to-cart-button");
	const toastNotification = document.getElementById("toast-notification");
	let toastTimeout;

	// Hàm hiển thị thông báo toast chung
	function showToast(message, isSuccess = true) {
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

	// Hàm cập nhật hiển thị tồn kho trên trang sản phẩm
	function updateStockDisplay(product) {
		const stockContainer = document.getElementById("product-stock-status");
		if (!stockContainer) return;

		if (product.quantity > 10) {
			stockContainer.innerHTML = `<p class="font-semibold text-green-600">Còn hàng</p>`;
		} else if (product.quantity > 0) {
			stockContainer.innerHTML = `<p class="font-semibold text-yellow-600">Còn ${product.quantity} sản phẩm!</p>`;
		} else {
			stockContainer.innerHTML = `<p class="font-semibold text-red-600">Hết hàng</p>`;
			// Vô hiệu hóa nút thêm vào giỏ hàng nếu hết hàng
			if (addToCartButton) {
				addToCartButton.disabled = true;
				addToCartButton.classList.add("bg-gray-400", "cursor-not-allowed");
				addToCartButton.classList.remove("bg-black", "hover:bg-gray-800");
			}
		}
	}

	if (addToCartButton) {
		addToCartButton.addEventListener("click", () => {
			const currentUser = JSON.parse(localStorage.getItem("user-current"));
			if (!currentUser) {
				window.location.href = "./login.html";
				return;
			}

			const productShortUrl = window.location.hash.substring(1);
			const products = JSON.parse(localStorage.getItem("products")) || [];
			const productIndex = products.findIndex(
				(p) => p.short_url === productShortUrl
			);

			if (productIndex === -1) {
				showToast("Lỗi: Không tìm thấy sản phẩm.", false);
				return;
			}

			const product = products[productIndex];
			const quantityToAdd = 1; // Mặc định số lượng là 1

			if (product.quantity < quantityToAdd) {
				showToast(
					`Sản phẩm đã hết hàng.`,
					false
				);
				return;
			}

			// Trừ số lượng trong kho
			products[productIndex].quantity -= quantityToAdd;
			localStorage.setItem("products", JSON.stringify(products));

			// Thêm vào giỏ hàng
			let cart = JSON.parse(localStorage.getItem("cart")) || [];
			const existingCartItemIndex = cart.findIndex(
				(item) => item.short_url === productShortUrl
			);

			if (existingCartItemIndex > -1) {
				// Nếu sản phẩm đã có, cập nhật số lượng
				cart[existingCartItemIndex].quantity += quantityToAdd;
			} else {
				// Nếu chưa có, thêm mới
				cart.push({
					name: product.title,
					price: product.discountedPrice,
					image: product.image_path,
					quantity: quantityToAdd,
					short_url: product.short_url, // Thêm short_url để định danh
				});
			}

			localStorage.setItem("cart", JSON.stringify(cart));

			showToast("Đã thêm vào giỏ hàng!");
			updateStockDisplay(products[productIndex]); // Cập nhật lại hiển thị tồn kho

			// Cập nhật số lượng trên icon giỏ hàng (nếu có)
			if (typeof show_number_item_in_cart === "function") {
				show_number_item_in_cart();
			}
		});
	}
});
