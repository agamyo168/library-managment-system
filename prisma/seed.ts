// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
const PEPPER = process.env.BCRYPT_SECRET_PEPPER || '';

// helper: random date between two dates
function randomDateBetween(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomBorrowingTimestamps() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // created_at = borrow date
  const createdAt = randomDateBetween(startOfYear, now);

  // dueDate = 2 weeks after createdAt
  const dueDate = new Date(createdAt);
  dueDate.setDate(createdAt.getDate() + 14);

  // 60% chance the book is returned
  const isReturned = Math.random() < 0.6;
  let returnDate: Date | null = null;

  if (isReturned) {
    const onTime = Math.random() < 0.7;
    if (onTime) {
      returnDate = randomDateBetween(createdAt, dueDate);
    } else returnDate = randomDateBetween(createdAt, now);
  }

  return { createdAt, dueDate, returnDate };
}

async function main() {
  const users = [];
  const plainPassword = `password1`;
  const hash = await bcrypt.hash(plainPassword + PEPPER, SALT_ROUNDS);
  users.push({
    name: `User 1`,
    email: `user1@example.com`,
    password: hash,
    role: 'ADMIN',
  });
  for (let i = 2; i <= 10; i++) {
    const plainPassword = `password${i}`;
    const hash = await bcrypt.hash(plainPassword + PEPPER, SALT_ROUNDS);
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: hash,
    });
  }
  await prisma.user.createMany({ data: users });

  const books = [];
  for (let i = 1; i <= 50; i++) {
    books.push({
      title: `Book Title ${i}`,
      author: `Author ${Math.ceil(i / 5)}`,
      isbn: `ISBN-${1000 + i}`,
      quantity: Math.floor(Math.random() * 3) + 1, // between 1 and 3
      shelfLocation: `Shelf-${String.fromCharCode(65 + (i % 5))}${i}`,
    });
  }
  await prisma.book.createMany({ data: books });

  const allUsers = await prisma.user.findMany();
  const allBooks = await prisma.book.findMany();

  const borrowings = [];
  for (const user of allUsers) {
    const borrowCount = Math.floor(Math.random() * 6); // 0-5 borrowings per user
    const sampledBooks = allBooks
      .sort(() => 0.5 - Math.random())
      .slice(0, borrowCount);

    for (const book of sampledBooks) {
      const { createdAt, dueDate, returnDate } = randomBorrowingTimestamps();
      borrowings.push({
        borrowerId: user.id,
        bookId: book.id,
        dueDate,
        returnDate,
        createdAt,
      });
    }
  }

  if (borrowings.length > 0) {
    await prisma.borrowingProcess.createMany({ data: borrowings });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
