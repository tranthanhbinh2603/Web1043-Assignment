const mapContainer = document.getElementById("map");
let myMap;
let marker;

if (mapContainer) {
	myMap = L.map("map").setView([10.762622, 106.660172], 13); // Default to Ho Chi Minh City
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(myMap);

	marker = L.marker([10.762622, 106.660172], { draggable: true }).addTo(myMap);
	const addressInput = document.getElementById("address");

	async function updateAddressFromLatLng(latlng) {
		const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`;
		try {
			const response = await fetch(apiUrl, {
				method: "GET",
				headers: {
					"User-Agent": "KeychronStoreApp/1.0 (hoctap.tranthanhbinh@gmail.com)",
				},
			});
			if (!response.ok) {
				throw new Error(`Network response was not ok: ${response.statusText}`);
			}
			const data = await response.json();
			addressInput.value =
				data && data.display_name
					? data.display_name
					: "Không tìm thấy địa chỉ.";
		} catch (error) {
			console.error("Lỗi khi lấy địa chỉ:", error);
			addressInput.value = "Lỗi khi lấy địa chỉ.";
		}
	}

	marker.on("dragend", function (event) {
		const marker = event.target;
		const position = marker.getLatLng();
		myMap.panTo(new L.LatLng(position.lat, position.lng));
		updateAddressFromLatLng(position);
	});

	const getLocationBtn = document.getElementById("get-location-btn");
	getLocationBtn.addEventListener("click", () => {
		if (navigator.geolocation) {
			getLocationBtn.disabled = true;
			getLocationBtn.textContent = "Đang tìm...";
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const lat = position.coords.latitude;
					const lng = position.coords.longitude;
					const latlng = L.latLng(lat, lng);

					// LỖI CHÍNH: Sửa 'map' thành 'myMap'
					myMap.setView(latlng, 15);
					marker.setLatLng(latlng);

					updateAddressFromLatLng(latlng);

					getLocationBtn.disabled = false;
					getLocationBtn.textContent = "Lấy địa điểm hiện tại";
				},
				(error) => {
					console.error("Lỗi Geolocation: ", error);
					addressInput.value = "Không thể lấy vị trí. Vui lòng cấp quyền.";
					getLocationBtn.disabled = false;
					getLocationBtn.textContent = "Lấy địa điểm hiện tại";
				}
			);
		} else {
			addressInput.value = "Trình duyệt không hỗ trợ định vị.";
		}
	});

	// Initial call
	updateAddressFromLatLng(marker.getLatLng());
}
