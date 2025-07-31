document.addEventListener("DOMContentLoaded", function () {
	const params = new URLSearchParams(window.location.search);
	const productIndex = parseInt(params.get("index"), 10);
	if (
		typeof dataProduct === "undefined" ||
		isNaN(productIndex) ||
		productIndex < 0 ||
		productIndex >= dataProduct.length
	) {
		document.querySelector("main").innerHTML =
			'<p class="text-center text-red-500">Sản phẩm không tồn tại!</p>';
		return;
	}
	const product = dataProduct[productIndex];
	document.title = `Chi tiết sản phẩm | ${product.title}`;
	document
		.getElementById("meta-description")
		.setAttribute(
			"content",
			`Khám phá chi tiết về ${product.title}. Giá: $${product.price}.`
		);
	const productImage = document.getElementById("product-image");
	productImage.src = product.image_path;
	productImage.alt = product.title;
	document.getElementById("product-title").textContent = product.title;
	document.getElementById("product-price").textContent = `$${product.price}`;
	document.getElementById(
		"product-rate-count"
	).textContent = `(${product.rate_count} đánh giá)`;
	document.getElementById("product-description").innerHTML =
		product.description;
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
