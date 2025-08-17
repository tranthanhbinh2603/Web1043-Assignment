document.addEventListener("DOMContentLoaded", function () {
	const productShortUrl = window.location.hash.substring(1);
	const products = JSON.parse(localStorage.getItem("products"));

	if (!productShortUrl) {
		document.querySelector("main").innerHTML =
			'<p class="text-center">Vui lòng chọn một sản phẩm.</p>';
		return;
	}

	if (!products || !Array.isArray(products)) {
		document.querySelector("main").innerHTML =
			'<p class="text-center text-red-500">Lỗi: Không thể tải dữ liệu sản phẩm.</p>';
		return;
	}

	const product = products.find((p) => p.short_url === productShortUrl);

	if (!product || product.quantity === 0) {
		document.querySelector("main").innerHTML =
			'<div class="min-h-[60vh] flex flex-col items-center justify-center"><p class="text-center text-red-500 text-2xl mb-4">Sản phẩm không tồn tại!</p><a href="./index.html" class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">Quay về trang chủ</a></div>';
		return;
	}

	// Update metadata
	document.title = `Chi tiết sản phẩm | ${product.title}`;
	document
		.getElementById("meta-description")
		.setAttribute(
			"content",
			`Khám phá chi tiết về ${product.title}. Giá: $${product.discountedPrice}.`
		);

	// Populate product details
	const productImage = document.getElementById("product-image");
	productImage.src = product.image_path;
	productImage.alt = product.title;
	productImage.loading = "lazy";

	document.getElementById("product-category").textContent = product.category;
	document.getElementById("product-title").textContent = product.title;
	document.getElementById(
		"product-rate-count"
	).textContent = `(${product.rate_count} đánh giá)`;
	document.getElementById("product-description").innerHTML =
		product.description;

	// Populate price
	const priceContainer = document.getElementById("product-price");
	if (product.discountedPrice < product.originalPrice) {
		priceContainer.innerHTML = `
        <span class="text-3xl font-bold text-red-600">$${product.discountedPrice}</span>
        <span class="text-xl text-gray-500 line-through ml-3">$${product.originalPrice}</span>
    `;
	} else {
		priceContainer.innerHTML = `<span class="text-3xl font-bold text-gray-800">$${product.discountedPrice}</span>`;
	}

	// Populate stock status
	const stockContainer = document.createElement("div");
	stockContainer.id = "product-stock-status";
	stockContainer.className = "text-lg";
	priceContainer.parentNode.insertBefore(
		stockContainer,
		priceContainer.nextSibling
	);

	if (product.quantity > 10) {
		stockContainer.innerHTML = `<p class="font-semibold text-green-600">Còn hàng</p>`;
	} else if (product.quantity > 0) {
		stockContainer.innerHTML = `<p class="font-semibold text-yellow-600">Còn ${product.quantity} sản phẩm!</p>`;
	}

	// Populate stars
	const starsContainer = document.getElementById("product-stars");
	starsContainer.innerHTML = "";
	for (let i = 0; i < 5; i++) {
		const starImg = document.createElement("img");
		starImg.className = "w-5";
		if (product.star_rate >= i + 1) {
			starImg.src = "./svg/star-full.svg";
			starImg.alt = "Sao đầy";
		} else if (product.star_rate >= i + 0.5) {
			starImg.src = "./svg/star-half.svg";
			starImg.alt = "Nửa sao";
		} else {
			starImg.src = "./svg/star-no.svg";
			starImg.alt = "Sao rỗng";
		}
		starsContainer.appendChild(starImg);
	}
});
