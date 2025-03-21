const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const vikingsImage = await prisma.image.create({
    data: {
      name: 'viking-raid',
      title: 'Viking Raid',
      url: 'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//viking-raid.jpeg',
      characters: {
        create: [
          {
            name: 'Piggy',
            xPercent: 38.7,
            yPercent: 52.55,
            iconUrl:
              'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//piggy.jpeg',
          },
          {
            name: 'Clown',
            xPercent: 35.9,
            yPercent: 32.7,
            iconUrl:
              'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//clown.jpeg',
          },
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
            iconUrl:
              'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//wally.svg',
          },
          {
            name: 'Jim',
            xPercent: 95.5,
            yPercent: 53.08,
            iconUrl:
              'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//jim.jpeg',
          },
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
            iconUrl:
              'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//king-boo.webp',
          },
          {
            name: 'Princess Peach',
            xPercent: 30,
            yPercent: 34,
            iconUrl:
              'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//Peach.webp',
          },
          {
            name: 'Cappy',
            xPercent: 59.5,
            yPercent: 76.1,
            iconUrl:
              'https://pyjgwcgwqpglbxwsfnbg.supabase.co/storage/v1/object/public/seekers-paradise//cappy.webp',
          },
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
