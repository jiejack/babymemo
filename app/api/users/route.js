import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 动态导入User模型
const User = (async () => {
  const { default: UserModel } = await import('../../../backend/models/user');
  return UserModel;
})();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    const { username, password, name } = await request.json();
    const UserModel = await User;
    
    // 检查用户名是否已存在
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      return new Response(JSON.stringify({ status: 'error', message: 'Username already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await UserModel.create(username, hashedPassword, name, null);

    return new Response(JSON.stringify({ status: 'success', message: 'User registered successfully', data: user }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ status: 'error', message: 'No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const UserModel = await User;
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return new Response(JSON.stringify({ status: 'error', message: 'User not found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 移除密码字段
    const { password, ...userWithoutPassword } = user;

    return new Response(JSON.stringify({ status: 'success', data: userWithoutPassword }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
