const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const vikingsImage = await prisma.image.create({
    data: {
      name: 'viking-raid',
      title: 'Viking Raid',
      url: 'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//vikings.webp',
      characters: {
        create: [
          {
            name: 'Piggy',
            xPercent: 38.7,
            yPercent: 52.55,
          },
          { name: 'Clown', xPercent: 35.9, yPercent: 32.7 },
        ],
      },
    },
  });

  const wallyImage = await prisma.image.create({
    data: {
      name: 'wally-factory',
      title: 'Wally in the Factory',
      url: 'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//wally-factory.jpg',
      characters: {
        create: [
          {
            name: 'Wally',
            xPercent: 50,
            yPercent: 6.2,
          },
          { name: 'Jim', xPercent: 95.5, yPercent: 53.08 },
        ],
      },
    },
  });

  const superMarioImage = await prisma.image.create({
    data: {
      name: 'super-mario-world',
      title: 'Super Mario World',
      url: 'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//super-mario.webp',
      characters: {
        create: [
          {
            name: 'King Boo',
            xPercent: 30.5,
            yPercent: 54.9,
          },
          { name: 'Princess Peach', xPercent: 30, yPercent: 34 },
          { name: 'Cappy', xPercent: 59.5, yPercent: 76.1 },
        ],
      },
    },
  });

  console.log('Images added: ', vikingsImage, wallyImage, superMarioImage);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
