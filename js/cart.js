// Lấy dữ liệu sản phẩm và giỏ hàng từ localStorage
let products = JSON.parse(localStorage.getItem("products")) || [];
let rawCartData = JSON.parse(localStorage.getItem("cart")) || [];

// Làm sạch dữ liệu giỏ hàng để đảm bảo tính nhất quán
let cartData = rawCartData.map((item) => {
	let price = 0;
	if (typeof item.price === "string") {
		price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
	} else if (typeof item.price === "number") {
		price = item.price;
	}
	return {
		...item,
		price: isNaN(price) ? 0 : price,
		quantity: Number(item.quantity) || 1,
	};
});

const rightColumnContainer = document.getElementById("right-column");
const cartItemsContainer = document.getElementById("cart-items");

function renderCart() {
	if (!cartItemsContainer) return;

	cartItemsContainer.innerHTML = "";
	if (cartData.length === 0) {
		cartItemsContainer.innerHTML = `
            <div class="col-span-full min-h-[45vh]">
                <p class="text-gray-500">Giỏ hàng của bạn đang trống.</p>
                <a class="text-blue-600 hover:underline" href="index.html">Tiếp tục mua sắm</a>
                <div class="h-64"></div>
            </div>`;
		if (rightColumnContainer) rightColumnContainer.style.display = "none";
	} else {
		if (rightColumnContainer) rightColumnContainer.style.display = "block";
		cartData.forEach((item) => {
			// --- CẬP NHẬT: Tính toán số lượng tối đa cho input ---
			const productInStock = products.find(
				(p) => p.short_url === item.short_url
			);
			const currentStock = productInStock ? productInStock.quantity : 0;
			const maxQuantity = currentStock + item.quantity;

			const itemElement = document.createElement("div");
			itemElement.className =
				"bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4";
			itemElement.innerHTML = `
                <img src="${item.image}" alt="${
				item.name
			}" class="w-24 h-24 object-cover rounded-md flex-shrink-0">
                <div class="flex-grow">
                    <h3 class="font-bold text-lg">${item.name}</h3>
                    <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-4 flex-shrink-0">
                    <input type="number" value="${
											item.quantity
										}" min="1" max="${maxQuantity}" 
                           class="w-16 p-2 border rounded-md text-center quantity-input" 
                           data-url="${item.short_url}" 
                           title="Tối đa: ${maxQuantity}">
                    <button class="text-red-500 hover:text-red-700 remove-btn" data-url="${
											item.short_url
										}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            `;
			cartItemsContainer.appendChild(itemElement);
		});
	}
	updateTotals();
	addEventListeners();
}

let discountRate = 0;
function updateTotals() {
	const subtotal = cartData.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const discountAmount = subtotal * discountRate;
	const tax = subtotal * 0.1;
	const total = subtotal - discountAmount + tax;

	document.getElementById("subtotal-price").textContent = `$${subtotal.toFixed(
		2
	)}`;
	document.getElementById("tax-price").textContent = `$${tax.toFixed(2)}`;
	document.getElementById(
		"discount-price"
	).textContent = `-$${discountAmount.toFixed(2)}`;
	document.getElementById("total-price").textContent = `$${total.toFixed(2)}`;
}

const couponInput = document.getElementById("coupon");
const applyCouponBtn = document.querySelector("button.w-36");
if (applyCouponBtn) {
	applyCouponBtn.addEventListener("click", () => {
		const couponCode = couponInput.value.trim().toUpperCase();
		if (couponCode === "COUPON_10PERCENT") {
			discountRate = 0.1;
			alert("Áp dụng mã giảm giá 10% thành công!");
		} else if (couponCode === "COUPON_20PERCENT") {
			discountRate = 0.2;
			alert("Áp dụng mã giảm giá 20% thành công!");
		} else {
			discountRate = 0;
			if (couponCode) {
				alert("Mã giảm giá không hợp lệ.");
			}
		}
		updateTotals();
	});
}

function saveCartAndProducts() {
	localStorage.setItem("cart", JSON.stringify(cartData));
	localStorage.setItem("products", JSON.stringify(products));
}

function addEventListeners() {
	document.querySelectorAll(".quantity-input").forEach((input) => {
		input.addEventListener("focus", function () {
			this.oldValue = this.value;
		});

		input.addEventListener("change", (e) => {
			const shortUrl = e.target.dataset.url;
			let newQuantity = parseInt(e.target.value);
			const oldQuantity = parseInt(e.target.oldValue);
			const max = parseInt(e.target.max);

			// Trình duyệt sẽ tự động điều chỉnh nếu giá trị vượt max, ta chỉ cần đảm bảo nó là số hợp lệ
			if (isNaN(newQuantity) || newQuantity < 1) {
				newQuantity = oldQuantity; // Nếu không hợp lệ, quay về giá trị cũ
			}
			if (newQuantity > max) {
				newQuantity = max; // Đảm bảo không vượt max
			}
			e.target.value = newQuantity; // Cập nhật lại input phòng trường hợp trình duyệt không xử lý

			const cartItemIndex = cartData.findIndex((i) => i.short_url === shortUrl);
			const productIndex = products.findIndex((p) => p.short_url === shortUrl);

			if (cartItemIndex === -1 || productIndex === -1) return;

			const quantityDifference = newQuantity - oldQuantity;

			products[productIndex].quantity -= quantityDifference;
			cartData[cartItemIndex].quantity = newQuantity;

			e.target.oldValue = newQuantity;
			updateTotals();
			saveCartAndProducts();
			// Sau khi thay đổi, ta cần render lại giỏ hàng để cập nhật lại thuộc tính 'max' cho các input khác
			renderCart();
		});
	});

	document.querySelectorAll(".remove-btn").forEach((button) => {
		button.addEventListener("click", (e) => {
			const shortUrl = e.currentTarget.dataset.url;
			const cartItemIndex = cartData.findIndex((i) => i.short_url === shortUrl);

			if (cartItemIndex > -1) {
				const removedQuantity = cartData[cartItemIndex].quantity;
				const productIndex = products.findIndex(
					(p) => p.short_url === shortUrl
				);
				if (productIndex > -1) {
					products[productIndex].quantity += removedQuantity;
				}
				cartData.splice(cartItemIndex, 1);
				saveCartAndProducts();
				renderCart();
			}
		});
	});
}

renderCart();

const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
	checkoutBtn.addEventListener("click", (e) => {
		e.preventDefault();
		const address = document.getElementById("address").value;
		if (!address.trim()) {
			alert("Vui lòng nhập địa chỉ giao hàng hoặc chọn trên bản đồ.");
			return;
		}
		if (cartData.length === 0) {
			alert(
				"Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán."
			);
			return;
		}
		const subtotal = document.getElementById("subtotal-price").textContent;
		const tax = document.getElementById("tax-price").textContent;
		const discount = document.getElementById("discount-price").textContent;
		const total = document.getElementById("total-price").textContent;
		const orderDetails = {
			address: address,
			items: cartData,
			prices: { subtotal, tax, discount, total },
		};
		localStorage.setItem("latestOrder", JSON.stringify(orderDetails));
		localStorage.removeItem("cart");
		window.location.href = "./order-success.html";
	});
}
