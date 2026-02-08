import pool from '../Database/db.js';

export const updateUsers = async () => {
	try {
		const { rows } = await pool.query(
			"SELECT id FROM patient WHERE status = 'waiting'",
		);

		rows.forEach((user) => {
			const userId = user.id;

			setTimeout(
				async () => {
					try {
						await pool.query(
							"UPDATE patient SET status = 'complete' WHERE id = $1",
							[userId],
						);
						console.log(
							`User ID ${userId} status changed to complete.`,
						);
					} catch (error) {
						console.error(
							`Error updating user ID ${userId}:`,
							error,
						);
					}
				},
				10 * 60 * 1000,
			); // 10 minutes in milliseconds
		});

		console.log('All users scheduled for 10-minute delayed update.');
	} catch (error) {
		console.error('Error fetching users:', error);
	}
};
