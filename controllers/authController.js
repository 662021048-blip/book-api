import db from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, password, name, tel } = req.body;

    if (!username || !password || !name || !tel) {
      return res.status(400).json({ message: "No user data." });
    }
    // //เชคว่ามี Username ซํ้าหรือไม่
    const checkUserSql = "SELECT * FROM users where username = $1";
    const checkUser = await db.query(checkUserSql, [username]);
    // return res.json(checkUser.rowCount);

    //ถ้า username ซํ้า เเจ้ง 400 มีชื่อผู้ใช้นี้เเล้ว
    if (checkUser.rowCount > 0) {
      return res.status(400).json({ message: "Username already exists." });
    }

    //ถ้าไม่ซํ้า เพิ่มข้อมูลใน ตาราง users
    const insertSql =
      "INSERT INTO users(username,password,name, tel) VALUES ($1,$2,$3,$4) RETURNING *";

    const hash_password = await bcrypt.hash(password, 10); // เข้ารหัส password

    const newUser = await db.query(insertSql, [
      username,
      hash_password,
      name,
      tel,
    ]);
    const user = newUser.rows[0];
    return res.status(201).json({ message: "User registered.", user });
  } catch (error) {
    return res.status(500).json({ message: "error:" + error });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username & password are required" });
  }

  try {
    const userSql = "SELECT * FROM users WHERE Username = $1 LIMIT 1";
    const { rows } = await db.query(userSql, [username]);
    const user = rows[0];

    // return res.json({user}); // debug ทดสอบ login
    // ไม่มี ชื่อผู้ใช้
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //ตรวจสอบ password
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.status(400).json({ message: "Wrong password" });
    }
    // username & password ถูกต้อง
    // สร้าง access token เเละ refresh token
    const payload = {
      userid: user.id,
      username: user.username,
      tel: user.tel,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    //return payLoad เเละ Token
    return res.status(200).json({ payload, accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: "error: " + error });
  }
};

export const refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { userId: user.id, username: user.username, tel: user.tel },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    res.status(200).json({ accessToken });
  });
};
