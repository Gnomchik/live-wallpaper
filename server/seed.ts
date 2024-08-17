import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // const categories = [
  //   { name: 'Абстракция' },
  //   { name: 'Анимация' },
  //   { name: 'Аниме' },
  //   { name: 'Автомобили' },
  //   { name: 'Города' },
  //   { name: 'Графика' },
  //   { name: 'Игры' },
  //   { name: 'Животные' },
  //   { name: 'Киберпанк' },
  //   { name: 'Космос' },
  //   { name: 'Минимализм' },
  //   { name: 'Музыка' },
  //   { name: 'Природа' },
  //   { name: 'Пейзажи' },
  //   { name: 'Сюрреализм' },
  //   { name: 'Спорт' },
  //   { name: 'Технологии' },
  //   { name: 'Фильмы' },
  //   { name: 'Фэнтези' },
  //   { name: 'Цветы' }
  // ];
  // const qualities = [
  //   { name: '480p' },
  //   { name: '720p' },
  //   { name: '1080p' },
  //   { name: '2K' },
  //   { name: '4K' }
  // ];

  // await prisma.category.deleteMany(); // Очистка таблицы category
  // await prisma.quality.deleteMany(); // Очистка таблицы quality

  // await prisma.category.createMany({
  //   data: categories,
  // });

  // await prisma.quality.createMany({
  //   data: qualities,
  // });

  //await prisma.video.deleteMany();
  //await prisma.user.deleteMany();

  console.log('Seed data has been added.');
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
