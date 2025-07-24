const rawCartData = JSON.parse(localStorage.getItem("cart")) || [];
const cartData = rawCartData.map((item, index) => {
	const priceNumber = parseFloat(item.price.replace("$", ""));
	return {
		id: index, // Tạo ID đơn giản dựa trên vị trí
		name: item.name,
		price: isNaN(priceNumber) ? 0 : priceNumber,
		quantity: item.quantity || 1, // Mặc định số lượng là 1 nếu không có
		image: item.image,
	};
});
const rightColumnContainer = document.getElementById("right-column");
if (cartData.length === 0) {
	rightColumnContainer.style.display = "none";
}

const cartItemsContainer = document.getElementById("cart-items");

function renderCart() {
	if (!cartItemsContainer) return; // Thoát nếu không có giỏ hàng trên trang này
	cartItemsContainer.innerHTML = "";
	if (cartData.length === 0) {
		cartItemsContainer.innerHTML =
			'<p class="text-gray-500">Giỏ hàng của bạn đang trống.</p><a class="text-blue-600" href="index.html">Vui lòng trở lại trang chủ tại đây và thêm sản phẩm.</a><div style="margin-bottom: 300px"></div>';
	} else {
		cartData.forEach((item) => {
			const itemElement = document.createElement("div");
			itemElement.className =
				"bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4";
			itemElement.innerHTML = `
                        <img src="${item.image}" alt="${
				item.name
			}" class="w-24 h-24 object-cover rounded-md flex-shrink-0">
                        <div class="flex-grow">
                            <h3 class="font-bold text-lg">${item.name}</h3>
                            <p class="text-gray-600">$${item.price.toFixed(
															2
														)}</p>
                        </div>
                        <div class="flex items-center gap-4 flex-shrink-0">
                            <input type="number" value="${
															item.quantity
														}" min="1" class="w-16 p-2 border rounded-md text-center quantity-input" data-id="${
				item.id
			}">
                            <button class="text-red-500 hover:text-red-700 remove-btn" data-id="${
															item.id
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
let discountRate = 0; // 0 = không giảm giá, 0.1 = 10%, 0.2 = 20%
function updateTotals() {
	const subtotal = cartData.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const discountAmount = subtotal * discountRate;
	const tax = subtotal * 0.1; // Thuế tính trên tổng phụ ban đầu
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
			discountRate = 0; // Reset nếu mã không hợp lệ
			if (couponCode) {
				// Chỉ thông báo nếu người dùng đã nhập gì đó
				alert("Mã giảm giá không hợp lệ.");
			}
		}
		updateTotals(); // Cập nhật lại giá sau khi áp dụng coupon
	});
}

function saveCartToLocalStorage() {
	// Chuyển đổi cartData về định dạng gốc để lưu trữ
	const rawCartToSave = cartData.map((item) => {
		return {
			name: item.name,
			price: `$${item.price.toFixed(2)}`, // Đảm bảo giá có định dạng string như ban đầu
			quantity: item.quantity,
			image: item.image,
		};
	});
	localStorage.setItem("cart", JSON.stringify(rawCartToSave));
}

function addEventListeners() {
	document.querySelectorAll(".quantity-input").forEach((input) => {
		input.addEventListener("change", (e) => {
			const id = parseInt(e.target.dataset.id);
			const newQuantity = parseInt(e.target.value);
			const item = cartData.find((i) => i.id === id);
			if (item) {
				item.quantity = newQuantity;
				updateTotals();
				saveCartToLocalStorage(); // <-- THÊM VÀO ĐÂY
			}
		});
	});

	document.querySelectorAll(".remove-btn").forEach((button) => {
		button.addEventListener("click", (e) => {
			const id = parseInt(e.currentTarget.dataset.id);
			const itemIndex = cartData.findIndex((i) => i.id === id);
			if (itemIndex > -1) {
				cartData.splice(itemIndex, 1);
				saveCartToLocalStorage(); // <-- THÊM VÀO ĐÂY
				renderCart(); // Gọi sau khi đã lưu và xoá
			}
		});
	});
}
renderCart();

const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
	checkoutBtn.addEventListener("click", (e) => {
		e.preventDefault(); // Ngăn chuyển trang ngay

		// Lấy tất cả thông tin cần thiết
		const address = document.getElementById("address").value;
		const subtotal = document.getElementById("subtotal-price").textContent;
		const tax = document.getElementById("tax-price").textContent;
		const discount = document.getElementById("discount-price").textContent;
		const total = document.getElementById("total-price").textContent;

		// Biến cartData đã có sẵn từ logic giỏ hàng của bạn
		const itemsInCart = cartData;

		if (!address.trim()) {
			alert("Vui lòng nhập địa chỉ giao hàng hoặc chọn trên bản đồ.");
			return;
		}

		// Tạo đối tượng chi tiết đơn hàng
		const orderDetails = {
			address: address,
			items: itemsInCart,
			prices: {
				subtotal: subtotal,
				tax: tax,
				discount: discount,
				total: total,
			},
		};

		// Lưu vào localStorage để trang success.html có thể đọc
		localStorage.setItem("latestOrder", JSON.stringify(orderDetails));

		// Xóa giỏ hàng hiện tại sau khi đã đặt hàng
		localStorage.removeItem("cart");

		// Chuyển đến trang thành công
		window.location.href = "./order-success.html";
	});
}
