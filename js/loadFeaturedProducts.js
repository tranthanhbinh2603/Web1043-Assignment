document.addEventListener("DOMContentLoaded", () => {
	const products = JSON.parse(localStorage.getItem("products"));

	if (!products || !Array.isArray(products)) {
		console.error(
			"Lỗi: Dữ liệu sản phẩm trong Local Storage không hợp lệ hoặc không tồn tại."
		);
		return;
	}

	const renderProducts = (containerId, filterFn, limit) => {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`Lỗi: Không tìm thấy container '${containerId}'.`);
			return;
		}

		const filteredProducts = products.filter(filterFn).slice(0, limit);

		container.innerHTML = "";
		filteredProducts.forEach((product) => {
			let starsHTML = "";
			for (let i = 0; i < 5; i++) {
				if (product.star_rate >= i + 1) {
					starsHTML += `<img loading="lazy" class="w-4 h-4" src="./svg/star-full.svg" alt="Sao đầy">`;
				} else if (product.star_rate >= i + 0.5) {
					starsHTML += `<img loading="lazy" class="w-4 h-4" src="./svg/star-half.svg" alt="Nửa sao">`;
				} else {
					starsHTML += `<img loading="lazy" class="w-4 h-4" src="./svg/star-no.svg" alt="Sao rỗng">`;
				}
			}

			let priceHTML = "";
			if (product.discountedPrice < product.originalPrice) {
				priceHTML = `
                    <span class="text-lg font-bold text-red-600">$${product.discountedPrice}</span>
                    <span class="text-sm text-gray-500 line-through ml-2">$${product.originalPrice}</span>
                `;
			} else {
				priceHTML = `<span class="text-lg font-bold text-black">$${product.discountedPrice}</span>`;
			}

			const productCard = document.createElement("a");
			productCard.href = `./product.html#${product.short_url}`;
			productCard.className =
				"group block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden";
			const imagePath = product.image_path.startsWith("../../")
				? product.image_path.replace("../../", "./")
				: product.image_path;

			productCard.innerHTML = `
                <div class="overflow-hidden">
                    <img loading="lazy" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        src="${imagePath}" alt="${product.title}">
                </div>
                <div class="p-4 flex flex-col h-full">
                    <h3 class="font-semibold text-black mb-2 min-h-[5rem] text-lg">${product.title}</h3>
                    <div class="flex items-center gap-2 mb-3">
                        <div class="flex">
                            ${starsHTML}
                        </div>
                        <p class="text-xs text-gray-500 font-normal">(${product.rate_count})</p>
                    </div>
                    <div class="text-sm text-gray-600 mb-3">
                        ${priceHTML}
                    </div>
                    <div class="flex flex-wrap gap-2 mt-auto">
                         <span class="text-xs font-medium py-1 px-3 border rounded-full capitalize">${product.category}</span>
                    </div>
                </div>
            `;
			container.appendChild(productCard);
		});
	};

	// Render sections
	renderProducts(
		"discounted-products-container",
		(p) => p.discountedPrice < p.originalPrice,
		8
	);
	renderProducts(
		"keyboard-products-container",
		(p) => p.category === "bàn phím",
		8
	);
	renderProducts("mouse-products-container", (p) => p.category === "chuột", 8);
	renderProducts("other-products-container", (p) => p.category === "khác" || p.category === "keycap", 8);
});