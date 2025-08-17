const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keydown", function (event) {
	if (event.key === "Enter") {
		event.preventDefault();
		const searchTerm = searchInput.value.trim();
		if (searchTerm) {
			window.location.href = `filter.html?s=${encodeURIComponent(searchTerm)}`;
		}
	}
});
