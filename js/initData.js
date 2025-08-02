(function () {
	const createDefaultAdmin = () => {
		const adminUser = [
			{
				name: "Admin đây",
				email: "admin@gmail.com",
				password: "admin",
				isAdmin: true,
			},
		];
		localStorage.setItem("users", JSON.stringify(adminUser));
	};

	const validateUsersData = (data) => {
		const requiredKeys = ["name", "email", "password", "isAdmin"];
		if (!Array.isArray(data) || data.length === 0) {
			return false;
		}
		const allUsersAreValid = data.every((user) => {
			if (typeof user !== "object" || user === null) return false;
			const userKeys = Object.keys(user);
			return (
				userKeys.length === requiredKeys.length &&
				requiredKeys.every((key) => user.hasOwnProperty(key))
			);
		});
		return allUsersAreValid;
	};
	const usersDataString = localStorage.getItem("users");
	if (!usersDataString) {
		createDefaultAdmin();
	} else {
		try {
			const users = JSON.parse(usersDataString);
			if (!validateUsersData(users)) {
				localStorage.removeItem("users");
				createDefaultAdmin();
			}
		} catch (error) {
			localStorage.removeItem("users");
			createDefaultAdmin();
		}
	}
})();
