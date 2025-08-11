import bcrypt from 'bcryptjs';
import { db } from '../server/db';
import { users } from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    // 관리자 계정 정보
    const adminEmail = 'admin@oauth3.io';
    const adminUsername = 'admin';
    const adminPassword = '123456';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // 기존 관리자 계정 확인
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail));
    
    if (existingAdmin.length > 0) {
      console.log('✅ 관리자 계정이 이미 존재합니다.');
      console.log('📧 이메일:', adminEmail);
      console.log('👤 사용자명:', adminUsername);
      console.log('🔐 비밀번호:', adminPassword);
      return;
    }
    
    // 관리자 계정 생성
    const [admin] = await db.insert(users).values({
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    console.log('✅ 관리자 계정이 생성되었습니다!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 이메일:', adminEmail);
    console.log('👤 사용자명:', adminUsername);
    console.log('🔐 비밀번호:', adminPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  보안을 위해 첫 로그인 후 비밀번호를 변경하세요.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 관리자 계정 생성 실패:', error);
    process.exit(1);
  }
}

// eq import 추가
import { eq } from 'drizzle-orm';

createAdminUser();