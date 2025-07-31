const ratingStarsContainer = document.getElementById("rating-stars");
if (ratingStarsContainer) {
	const stars = ratingStarsContainer.querySelectorAll("img");
	let currentRating = 0;

	const starFullSrc = "../svg/star-full.svg";
	const starNoSrc = "../svg/star-no.svg";

	function updateStars(rating) {
		stars.forEach((star, index) => {
			star.src = index < rating ? starFullSrc : starNoSrc;
		});
	}

	stars.forEach((star, index) => {
		const ratingValue = index + 1;

		star.addEventListener("mouseover", () => {
			updateStars(ratingValue);
		});

		star.addEventListener("mouseout", () => {
			updateStars(currentRating);
		});

		star.addEventListener("click", () => {
			currentRating = ratingValue;
		});
	});
}
