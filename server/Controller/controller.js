import pool from '../Database/db.js';
import path from 'path';
import rootDir from '../utils/rootDir.js';

export const registerPage = async (req, res) => {
	res.sendFile(path.join(rootDir, 'Public', 'Pages', 'index.html'));
};

export const tokenPage = (req, res) => {
	res.sendFile(path.join(rootDir, 'Public', 'Pages', 'token.html'));
};

export const register = async (req, res) => {
	try {
		const { name, phone_number, account_number } = req.body;

		if (!name || !phone_number || !account_number) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		const exists = await pool.query(
			`SELECT id, token_number FROM tokens WHERE account_number = $1`,
			[account_number],
		);

		if (exists.rows.length) {
			return res.status(409).json({
				message: 'You already have a token',
				token: exists.rows[0].token_number,
			});
		}

		const { rows } = await pool.query(
			`INSERT INTO tokens (name, phone_number, account_number)
       VALUES ($1, $2, $3) RETURNING token_number`,
			[name, phone_number, account_number],
		);

		return res.status(201).json({
			message: 'Registration successful',
			token: rows[0].token_number,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: 'Server error' });
	}
};

export const signIn = async (req, res) => {
	try {
		const { account_number, token_number } = req.body;

		if (!account_number || !token_number) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		const { rows } = await pool.query(
			`SELECT token_number FROM tokens 
       WHERE account_number = $1 AND UPPER(token_number) = UPPER($2)`,
			[account_number, token_number],
		);

		if (!rows.length) {
			return res.status(404).json({ message: 'Invalid credentials' });
		}

		return res.status(200).json({
			message: 'Sign-in successful',
			token: rows[0].token_number,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ message: 'Server error' });
	}
};

export const userToken = async (req, res) => {
  const token = req.params.token_number;

  
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendData = async () => {
    try {
      const userResult = await pool.query(
        `SELECT id, name, phone_number, account_number, token_number, status, created_at
         FROM tokens
         WHERE UPPER(token_number) = UPPER($1)`,
        [token]
      );

      if (!userResult.rows.length) {
        res.write(`data: ${JSON.stringify({ message: "User not found" })}\n\n`);
        return;
      }

      const waitingUsersResult = await pool.query(
        `SELECT * FROM tokens WHERE LOWER(status) = 'waiting' ORDER BY id ASC`
      );

      const completeUsersResult = await pool.query(
        `SELECT * FROM tokens WHERE LOWER(status) = 'completed' ORDER BY id ASC`
      );

      const ongoingUserResult = await pool.query(
        `SELECT * FROM tokens WHERE LOWER(status) = 'ongoing' LIMIT 1`
      );

      const payload = {
        user: userResult.rows[0],
        waitingUsers: waitingUsersResult.rows,
        completeUsers: completeUsersResult.rows,
        ongoingUser: ongoingUserResult.rows[0] || null
      };

      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch (err) {
      res.write(`data: ${JSON.stringify({ error: "Server error" })}\n\n`);
    }
  };

  
  sendData();


  const interval = setInterval(sendData, 60000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
};

export const userLogout = async (req, res) => {
	try {
		const { token_number } = req.body;

		if (!token_number) {
			return res.status(400).json({ message: 'Token required' });
		}

		const { rows } = await pool.query(
			'SELECT * FROM tokens WHERE UPPER(token_number) = UPPER($1)',
			[token_number],
		);

		if (!rows.length) {
			return res.status(400).json({ message: 'Invalid token' });
		}

		await pool.query(
			'DELETE FROM tokens WHERE UPPER(token_number) = UPPER($1)',
			[token_number],
		);

		res.status(200).json({
			message: 'Logged out successfully, token deleted',
		});
	} catch (error) {
		console.error('Logout error:', error.message);
		res.status(500).json({ message: 'Internal server error' });
	}
};
