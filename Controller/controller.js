import pool from '../Database/db.js';
const rootDir = require('./utils/path');

export const register = async (req, res) => {
	try {
		const { name, phone, date_of_birth, blood_group } = req.body;

		if (!name || !phone || !date_of_birth || !blood_group) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		const blood_groups = req.body.blood_group.toUpperCase();

		const result = await pool.query(
			`INSERT INTO patient (name, phone_number, date_of_birth, blood_group)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, phone_number, date_of_birth, blood_group, token, created_at`,
			[name, phone, date_of_birth, blood_groups],
		);

		const newUser = result.rows[0];

		res.sendFile(201).json({
			message: 'User registered successfully',
			user: newUser,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ message: 'Server error' });
	}
};

//-------------------login-------------------------------------------------------
export const signIn = async (req, res) => {
	try {
		let { phone, Token } = req.body;

		if (!phone || !Token) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		const normalizedToken = Token.toUpperCase();

		const { rows } = await pool.query(
			'SELECT * FROM patient WHERE phone_number = $1 AND token = $2',
			[phone_number, normalizedToken],
		);

		if (rows.length === 0) {
			return res
				.status(404)
				.json({ message: 'User not found or invalid token' });
		}

		return res
			.status(200)
			.json({ message: 'Sign-in successful', user: rows[0] });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

export const userToken = async (req, res) => {};
