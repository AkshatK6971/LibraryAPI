import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: 'jane.doe@example.com',
      passwordHash: '$2a$10$b5AAigvp6XKoVUkI0jgLD.UN9LNvtnrx6TOaA01YhOFQshABiRhw.',
      refreshToken: null,
    },
  });

  // Add books for that user
  const books = await prisma.book.createMany({
    data: [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        pages: 180,
        genre: 'Classic',
        userId: user.id,
      },
      {
        title: '1984',
        author: 'George Orwell',
        pages: 328,
        genre: 'Dystopian',
        userId: user.id,
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        pages: 464,
        genre: 'Programming',
        userId: user.id,
      },
    ],
  });

  console.log('User and books seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });