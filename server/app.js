import express from 'express';
import dotenv from 'dotenv';

import {
  register,
  signIn,
  userToken,
  registerPage,
  tokenPage,
  userLogout
} from './Controller/controller.js';



dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('Public'));

const PORT = process.env.PORT || 3000;

// Routes
app.get('/', registerPage);
app.post('/register', register);
app.post('/log-in', signIn);
app.get('/token', tokenPage);
app.get('/api/token/:token_number', userToken);
app.post('/logout', userLogout);



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
