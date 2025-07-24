const latestOrder = JSON.parse(localStorage.getItem("latestOrder"));
const customerNameEl = document.getElementById("customer-name");
const shippingAddressEl = document.getElementById("shipping-address");
const orderedProductsEl = document.getElementById("ordered-products");
const priceSummaryEl = document.getElementById("price-summary");
const currentUser = JSON.parse(localStorage.getItem("user-current"));

// Check if all elements and data exist before proceeding
if (latestOrder && currentUser && customerNameEl) {
	// 1. Display Customer Name
	customerNameEl.textContent = currentUser.name || "Không có thông tin";

	// 2. Display Shipping Address
	shippingAddressEl.textContent = latestOrder.address || "Không có thông tin";

	// 3. Display Ordered Products
	orderedProductsEl.innerHTML = ""; // Clear placeholder content
	if (latestOrder.items && latestOrder.items.length > 0) {
		latestOrder.items.forEach((item) => {
			const li = document.createElement("li");
			// Use item.quantity if available, otherwise default to 1
			li.textContent = `${item.name} (x${item.quantity || 1})`;
			orderedProductsEl.appendChild(li);
		});
	} else {
		orderedProductsEl.innerHTML =
			"<li>Không có sản phẩm nào trong đơn hàng.</li>";
	}

	// 4. Display Price Summary
	priceSummaryEl.innerHTML = `
                    <div class="flex justify-between"><span>Tổng phụ:</span> <span>${latestOrder.prices.subtotal}</span></div>
                    <div class="flex justify-between text-green-600"><span>Giảm giá:</span> <span>${latestOrder.prices.discount}</span></div>
                    <div class="flex justify-between"><span>Thuế (10%):</span> <span>${latestOrder.prices.tax}</span></div>
                    <div class="flex justify-between font-bold text-lg mt-2 border-t pt-2"><span>Thành tiền:</span> <span>${latestOrder.prices.total}</span></div>
                `;
} else if (customerNameEl) {
	// Handle case where there's no order info (e.g., direct navigation)
	const mainContent = document.querySelector(".w-full.max-w-2xl");
	if (mainContent) {
		mainContent.innerHTML = `
                        <h1 class="text-3xl font-bold mb-4">Không tìm thấy thông tin đơn hàng</h1>
                        <p class="text-gray-600 mb-8">Dường như có lỗi xảy ra hoặc bạn chưa hoàn tất mua sắm. Vui lòng quay lại giỏ hàng.</p>
                        <a href="./cart.html" class="inline-block bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors">Về giỏ hàng</a>
                    `;
	}
}
