import 'dotenv/config';
import prisma from './src/middleware/database.js';

export async function initializeDatabase() {
  try {
    console.log('🔄 Checking and creating database tables if needed...');
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "name" TEXT NOT NULL,
        "university" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'student',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure role and studentId columns exist if User table was created earlier without it
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'student';
    `).catch(() => {});

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "studentId" TEXT;
    `).catch(() => {});

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Department" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT UNIQUE NOT NULL
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Course" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "departmentId" TEXT NOT NULL REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Note" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "fileUrl" TEXT NOT NULL,
        "courseName" TEXT,
        "departmentName" TEXT,
        "universityName" TEXT,
        "authorName" TEXT,
        "downloadCount" INTEGER NOT NULL DEFAULT 0,
        "authorId" TEXT REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "courseId" TEXT REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure Note columns exist if table was created with older schema
    await prisma.$executeRawUnsafe(`ALTER TABLE "Note" ADD COLUMN IF NOT EXISTS "courseName" TEXT;`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "Note" ADD COLUMN IF NOT EXISTS "departmentName" TEXT;`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "Note" ADD COLUMN IF NOT EXISTS "universityName" TEXT;`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "Note" ADD COLUMN IF NOT EXISTS "authorName" TEXT;`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "Note" ADD COLUMN IF NOT EXISTS "downloadCount" INTEGER NOT NULL DEFAULT 0;`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "Note" ALTER COLUMN "authorId" DROP NOT NULL;`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "Note" ALTER COLUMN "courseId" DROP NOT NULL;`).catch(() => {});

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Comment" (
        "id" TEXT PRIMARY KEY,
        "text" TEXT NOT NULL,
        "authorId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "noteId" TEXT NOT NULL REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Rating" (
        "id" TEXT PRIMARY KEY,
        "value" INTEGER NOT NULL,
        "authorId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "noteId" TEXT NOT NULL REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE ("authorId", "noteId")
      );
    `);

    console.log('✅ PostgreSQL database tables created/verified successfully!');
    return true;
  } catch (err) {
    console.warn('⚠️ Direct DB table initialization notice:', err.message);
    return false;
  }
}

initializeDatabase();
