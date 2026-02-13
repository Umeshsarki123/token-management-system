import express from 'express';
import { updateUsers } from './updating.js';

const app = express();
const PORT = 5050;

setInterval(async () => {
	try {
		await updateUsers();
	} catch (err) {
		console.error(err);
	}
}, 5000);

app.listen(PORT, () => {
	console.log('Data-base-is-UPDATING');
});
