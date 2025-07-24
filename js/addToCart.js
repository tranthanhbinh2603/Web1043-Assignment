document.addEventListener("DOMContentLoaded", () => {
	const addToCartButton = document.getElementById("add-to-cart-button");
	const toastNotification = document.getElementById("toast-notification");
	let toastTimeout;
	function showToast() {
		// Tạo nội dung cho toast
		toastNotification.innerHTML = `
                    <span class="font-medium">✅ Đã thêm vào giỏ hàng!</span>
                    <a href="../../cart.html">Xem giỏ hàng</a>
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
				const productPrice = document.querySelector(
					".text-3xl.font-bold.text-gray-800"
				).innerText;
				const productImage = document.querySelector(".md\\:w-1\\/3 img").src;
				const product = {
					name: productName,
					price: productPrice,
					image: productImage,
				};
				let cart = JSON.parse(localStorage.getItem("cart")) || [];
				cart.push(product);
				localStorage.setItem("cart", JSON.stringify(cart));
				showToast();
			} else {
				alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
				window.location.href = "../../login.html";
			}
		});
	}
});
