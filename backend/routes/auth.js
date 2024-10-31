import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js'; 
import dotenv from 'dotenv';

dotenv.config(); 

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/auth/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // hash the password first
    const hashedPassword = await bcrypt.hash(password, 10);
    // insert into the User table
    const result = await pool.query(
      'INSERT INTO "User" (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );

    const userId = result.rows[0].id;
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });

    return res.status(201).json({ user_id: userId, token });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user.id }, SECRET_KEY, { expiresIn: '1h' });
      return res.status(200).json({ user_id: user.id, token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
