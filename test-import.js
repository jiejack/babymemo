// 测试导入baby.js文件
import { createBaby, getBabiesByUserId } from './backend/models/baby.js';

console.log('导入成功！');
console.log('createBaby:', typeof createBaby);
console.log('getBabiesByUserId:', typeof getBabiesByUserId);
