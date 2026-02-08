import express from 'express';
import dotenv from 'dotenv';

import { register, signIn, userToken } from './Controller/controller.js';
import { updateUsers } from './UpdatingStatus/updating.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', register);
app.post('/log-in', signIn);
app.get('/register', userToken);

updateUsers();

app.listen(PORT, () => {
	console.log(`http://127.0.0.1:${PORT}`);
});
