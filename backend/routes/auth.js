import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'your_secret_key';

const users = [
  { email: 'user@example.com', password: 'password123', language_id: 'en' }
];

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.email === username && u.password === password);

  if (username && password) {
    const token = jwt.sign({ email: username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;
