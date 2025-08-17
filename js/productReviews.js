document.addEventListener("DOMContentLoaded", () => {
	// === THAY ĐỔI 1: Lấy ID sản phẩm từ hash của URL ===
	const hash = window.location.hash;
	const productId = hash.substring(1); // Bỏ dấu '#'

	// Nếu không có product ID trên URL, dừng thực thi
	if (!productId) {
		console.error(
			"Lỗi: Không tìm thấy ID của sản phẩm trên URL (ví dụ: #product-id)."
		);
		return;
	}

	// Giữ nguyên logic cũ, nhưng giờ nó đã có đúng productIndex
	const localStorageKey = `product_${productId}_reviews`;
	const reviewForm = document.getElementById("review-form");
	const reviewsContainer = document.getElementById("reviews-container");
	const reviewerNameInput = document.getElementById("reviewer-name");
	const reviewTextInput = document.getElementById("review-text");
	const ratingStarsContainer = document.getElementById("rating-stars-input");
	let currentRating = 0;

	const setupRating = () => {
		console.log("Setup Rating");
		const stars = ratingStarsContainer.querySelectorAll("img");
		const updateStars = (rating) => {
			stars.forEach((star, index) => {
				star.src = index < rating ? "./svg/star-full.svg" : "./svg/star-no.svg";
			});
		};
		stars.forEach((star, index) => {
			star.addEventListener("click", () => {
				currentRating = index + 1;
				updateStars(currentRating);
			});
			star.addEventListener("mouseover", () => {
				updateStars(index + 1);
			});
			star.addEventListener("mouseout", () => {
				updateStars(currentRating);
			});
		});
	};

	const loadReviews = () => {
		const reviews = JSON.parse(localStorage.getItem(localStorageKey));

		reviewsContainer.innerHTML = "";
		if (reviews == null || reviews.length === 0) {
			reviewsContainer.innerHTML =
				'<p class="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>';
			return;
		}
		reviews.forEach((review) => {
			const reviewElement = document.createElement("div");
			reviewElement.className = "flex gap-4 border-b pb-6";
			let starsHTML = "";
			for (let i = 0; i < 5; i++) {
				starsHTML += `<img loading="lazy" class="w-4" src="${
					i < review.rating ? "./svg/star-full.svg" : "./svg/star-no.svg"
				}" alt="Sao">`;
			}
			reviewElement.innerHTML = `
                <img loading="lazy" src="./svg/profile.svg" alt="Reviewer Avatar" class="w-12 h-12 rounded-full flex-shrink-0 icon-reviewer">
                <div class="w-full">
                    <div class="flex justify-between items-center">
                        <h3 class="font-bold">${review.name}</h3>
                        <p class="text-sm text-gray-500">${review.date}</p>
                    </div>
                    <div class="flex items-center my-1">${starsHTML}</div>
                    <p class="text-gray-700">${review.text}</p>
                </div>`;
			reviewsContainer.appendChild(reviewElement);
		});
	};

	reviewForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const name = reviewerNameInput.value.trim();
		const text = reviewTextInput.value.trim();

		if (!name || !text || currentRating === 0) {
			alert("Vui lòng nhập tên, đánh giá và chọn số sao!");
			return;
		}

		const newReview = {
			name,
			rating: currentRating,
			text,
			date: new Date().toLocaleDateString("vi-VN", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}),
		};

		const localReviews =
			JSON.parse(localStorage.getItem(localStorageKey)) || [];
		localReviews.unshift(newReview);
		localStorage.setItem(localStorageKey, JSON.stringify(localReviews));

		reviewForm.reset();
		currentRating = 0;
		const stars = ratingStarsContainer.querySelectorAll("img");
		stars.forEach((star) => (star.src = "./svg/star-no.svg"));
		loadReviews();
	});

	setupRating();
	loadReviews();
});
