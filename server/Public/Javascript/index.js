const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	const tokenData = {
		name: registerForm.name.value.trim(),
		phone_number: registerForm.phone_number.value.trim(),
		account_number: registerForm.account_number.value.trim(),
	};

	if (
		!tokenData.name ||
		!tokenData.phone_number ||
		!tokenData.account_number
	) {
		return alert('Please fill in all fields.');
	}

	const accountRegex = /^ACC\d{4}$/;

	if (!accountRegex.test(tokenData.account_number)) {
		return alert('Account number must be in format ACC0001');
	}

	try {
		const res = await axios.post('/register', tokenData);
		const tokenNumber = res.data.token.toUpperCase();

		alert('Token generated successfully: ' + tokenNumber);
		window.location.href = `/token?token=${tokenNumber}`;
	} catch (err) {
		console.error(err);
		alert(err.response?.data?.message || 'Registration failed');
	}
});

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	const account_number = loginForm.account_number.value.trim();
	const token_number = loginForm.token_number.value.trim().toUpperCase();

	if (!account_number || !token_number) {
		return alert('Please enter both Account Number and Token.');
	}

	try {
		const res = await axios.post('/log-in', {
			account_number,
			token_number,
		});
		const tokenFromServer = res.data.token.toUpperCase();
		window.location.href = `/token?token=${tokenFromServer}`;
	} catch (err) {
		console.error(err);
		alert(err.response?.data?.message || 'Login failed');
	}
});
