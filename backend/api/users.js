const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      if (req.url.includes('/register')) {
        return register(req, res);
      } else if (req.url.includes('/login')) {
        return login(req, res);
      } else if (req.url.includes('/password')) {
        return updatePassword(req, res);
      }
      break;
    case 'GET':
      if (req.url.includes('/me')) {
        return getCurrentUser(req, res);
      }
      break;
    case 'PUT':
      if (req.url.includes('/me')) {
        return updateUser(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function register(req, res) {
  try {
    const { username, password, name } = req.body;
    
    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Username already exists' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create(username, hashedPassword, name, null);

    res.status(201).json({ status: 'success', message: 'User registered successfully', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // 生成 token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    // 移除密码字段
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ status: 'success', message: 'Login successful', data: { user: userWithoutPassword, token } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getCurrentUser(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    // 移除密码字段
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({ status: 'success', data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, avatar } = req.body;

    const updatedUser = await User.update(decoded.id, { name, avatar });

    res.status(200).json({ status: 'success', message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updatePassword(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { old_password, new_password } = req.body;

    // 验证旧密码
    const user = await User.findById(decoded.id);
    const isPasswordValid = await bcrypt.compare(old_password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'error', message: 'Old password is incorrect' });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await User.updatePassword(decoded.id, hashedPassword);

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
