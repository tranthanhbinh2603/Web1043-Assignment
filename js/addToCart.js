document.addEventListener("DOMContentLoaded", () => {
	const addToCartButton = document.getElementById("add-to-cart-button");
	const toastNotification = document.getElementById("toast-notification");
	let toastTimeout;
	function showToast() {
		toastNotification.innerHTML = `
                    <span class="font-medium">✅ Đã thêm vào giỏ hàng!</span>
                    <a href="./cart.html" class="underline hover:text-blue-500">Xem giỏ hàng</a>
                `;
		toastNotification.classList.add("show");
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			toastNotification.classList.remove("show");
		}, 5000);
	}

	if (addToCartButton) {
		addToCartButton.addEventListener("click", () => {
			const currentUser = JSON.parse(localStorage.getItem("user-current"));
			if (currentUser) {
				const productName = document.querySelector("h1").innerText;
				const productPriceElement = document.getElementById("product-price");
				const productImageElement = document.getElementById("product-image");
				if (!productName || !productPriceElement || !productImageElement) {
					console.error(
						"Không thể tìm thấy thông tin sản phẩm để thêm vào giỏ."
					);
					return;
				}
				const product = {
					name: productName,
					price: productPriceElement.innerText,
					image: productImageElement.src,
				};
				let cart = JSON.parse(localStorage.getItem("cart")) || [];
				cart.push(product);
				localStorage.setItem("cart", JSON.stringify(cart));
				showToast();
				if (typeof show_number_item_in_cart === "function") {
					show_number_item_in_cart();
				}
			} else {
				window.location.href = "./login.html";
			}
		});
	}
});
