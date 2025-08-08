document.addEventListener("DOMContentLoaded", () => {
	const params = new URLSearchParams(window.location.search);
	const productIndex = params.get("index");
	if (productIndex === null) {
		return;
	}
	const localStorageKey = `product_${productIndex}_reviews`;
	const reviewForm = document.getElementById("review-form");
	const reviewsContainer = document.getElementById("reviews-container");
	const reviewerNameInput = document.getElementById("reviewer-name");
	const reviewTextInput = document.getElementById("review-text");
	const ratingStarsContainer = document.getElementById("rating-stars-input");
	let currentRating = 0;
	const setupRating = () => {
		const stars = ratingStarsContainer.querySelectorAll("img");
		const updateStars = (rating) => {
			stars.forEach((star, index) => {
				if (index < rating) {
					star.src = "./svg/star-full.svg";
				} else {
					star.src = "./svg/star-no.svg";
				}
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
		const reviews = JSON.parse(localStorage.getItem(localStorageKey)) || [];
		reviewsContainer.innerHTML = "";
		if (reviews.length === 0) {
			reviewsContainer.innerHTML =
				'<p class="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>';
			return;
		}
		reviews.forEach((review) => {
			const reviewElement = document.createElement("div");
			reviewElement.className = "flex gap-4 border-b pb-6";
			let starsHTML = "";
			for (let i = 0; i < 5; i++) {
				if (i < review.rating) {
					starsHTML += `<img loading="lazy" class="w-4" src="./svg/star-full.svg" alt="Sao đầy">`;
				} else {
					starsHTML += `<img loading="lazy" class="w-4" src="./svg/star-no.svg" alt="Sao rỗng">`;
				}
			}
			reviewElement.innerHTML = `
                <img loading="lazy" src="./svg/profile.svg" alt="Reviewer Avatar" class="w-12 h-12 rounded-full flex-shrink-0 icon-reviewer">
                <div class="w-full">
                    <div class="flex justify-between items-center">
                        <h3 class="font-bold">${review.name}</h3>
                        <p class="text-sm text-gray-500">${review.date}</p>
                    </div>
                    <div class="flex items-center my-1">
                        ${starsHTML}
                    </div>
                    <p class="text-gray-700">${review.text}</p>
                </div>
            `;
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
			name: name,
			rating: currentRating,
			text: text,
			date: new Date().toLocaleDateString("vi-VN", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}),
		};
		const reviews = JSON.parse(localStorage.getItem(localStorageKey)) || [];
		reviews.unshift(newReview);
		localStorage.setItem(localStorageKey, JSON.stringify(reviews));
		reviewForm.reset();
		currentRating = 0;
		const stars = ratingStarsContainer.querySelectorAll("img");
		stars.forEach((star) => (star.src = "./svg/star-no.svg"));
		loadReviews();
	});
	setupRating();
	loadReviews();
});
