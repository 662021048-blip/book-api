import pool from '../db/index.js'


export const addBook = async (req, res) => {
    const { title, author, published_year } = req.body;

    try {
    const result = await pool.query(
        'INSERT INTO books (title, author, published_year) VALUES ($1, $2, $3) RETURNING *',
        [title, author, published_year] 
    );
    res.status(201).json(result.rows[0]);
    } catch (err) {
        return res.status(500).json({ message: "error: " + err });
    }
};