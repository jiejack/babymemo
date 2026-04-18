import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 动态导入User模型
const User = (async () => {
  const { default: UserModel } = await import('../../../../backend/models/user');
  return UserModel;
})();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const UserModel = await User;

    // 查找用户
    const user = await UserModel.findByUsername(username);
    if (!user) {
      return new Response(JSON.stringify({ status: 'error', message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ status: 'error', message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 生成 token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    // 移除密码字段
    const { password: _, ...userWithoutPassword } = user;

    return new Response(JSON.stringify({ status: 'success', message: 'Login successful', data: { user: userWithoutPassword, token } }), {
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
