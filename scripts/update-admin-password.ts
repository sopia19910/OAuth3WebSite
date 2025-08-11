import bcrypt from 'bcryptjs';
import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

async function updateAdminPassword() {
  try {
    const adminEmail = 'admin@oauth3.io';
    const newPassword = '123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // 관리자 계정 업데이트
    const result = await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.email, adminEmail))
      .returning();
    
    if (result.length > 0) {
      console.log('✅ 관리자 비밀번호가 업데이트되었습니다!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 이메일:', adminEmail);
      console.log('🔐 새 비밀번호:', newPassword);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.log('❌ 관리자 계정을 찾을 수 없습니다.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 비밀번호 업데이트 실패:', error);
    process.exit(1);
  }
}

updateAdminPassword();