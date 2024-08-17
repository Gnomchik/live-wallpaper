import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { extractThumbnail } from '../helper/extractThumbnail ';

const prisma = new PrismaClient();

export const uploadVideo = async (req: Request, res: Response) => {
  const { title, categoryIds, qualityId, authorId, description } = req.body;
  const videoFile = req.file;

  if (!videoFile) {
    return res.status(400).json({ error: 'Необходимо загрузить видеофайл' });
  }

  if (!authorId) {
    return res.status(401).json({ error: 'Необходима авторизация для загрузки видео' });
  }

  try {
    const categoryArray = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
    const categories = categoryArray.map((id: string) => ({
      category: { connect: { id: parseInt(id, 10) } }
    }));

    const videoPath = videoFile.path;
    const thumbnailPath = await extractThumbnail(videoPath);

    const newVideo = await prisma.video.create({
      data: {
        title,
        path: path.basename(videoFile.path),
        preview: path.basename(thumbnailPath),
        qualityId: parseInt(qualityId, 10),
        authorId: parseInt(authorId, 10),
        description,
        categories: {
          create: categories,
        },
      },
    });

    await Promise.all(
      categoryArray.map((categoryId: string) =>
        prisma.category.update({
          where: { id: parseInt(categoryId, 10) },
          data: { videoCount: { increment: 1 } },
        })
      )
    );

    if (qualityId) {
      await prisma.quality.update({
        where: { id: parseInt(qualityId, 10) },
        data: { videoCount: { increment: 1 } },
      });
    }

    res.json(newVideo);
  } catch (error) {
    console.error('Ошибка при загрузке видео:', error);
    res.status(500).json({ error: 'Не удалось загрузить видео' });
  }
};



export const getVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        author: { select: { name: true, photo: true } },
        categories: { include: { category: true } },
        quality: true,
      },
    });

    if (!video) {
      return res.status(404).json({ error: 'Видео не найдено' });
    }
    console.log(video);

    res.status(200).json(video);
  } catch (error) {
    console.error('Ошибка при получении видео:', error);
    res.status(500).json({ error: 'Ошибка при получении видео' });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  const { category, quality, sortByQuality } = req.query;

  try {
    const filters: any = {};
    if (category) {
      filters.categories = {
        some: { categoryId: parseInt(category as string, 10) }
      };
    }
    if (quality) {
      filters.qualityId = parseInt(quality as string, 10);
    }
    const orderBy = sortByQuality
      ? {
        quality: {
          name: sortByQuality as 'asc' | 'desc'
        }
      }
      : {};

    const videos = await prisma.video.findMany({
      where: filters,
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } },
        quality: true,
        likes: true
      },
      orderBy,
    });

    res.json(videos);
  } catch (error) {
    console.error('Ошибка при получении видео:', error);
    res.status(500).json({ error: 'Ошибка при получении видео' });
  }
};

export const searchVideo = async (req: Request, res: Response) => {
  const { title } = req.query;
  try {
    const search = await prisma.video.findMany({
      where: {
        title: {
          contains: title as string,
        },
      },
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } },
        quality: true,
      },
    });
    res.json(search);
  } catch (error) {
    console.error('Ошибка при поиске видео:', error);
    res.status(500).json({ error: 'Ошибка при поиске видео' });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const videoToDelete = await prisma.video.findUnique({
      where: { id: parseInt(id, 10) },
      include: { categories: true, quality: true },
    });

    if (!videoToDelete) {
      return res.status(404).json({ error: 'Видео не найдено' });
    }

    await prisma.video.delete({
      where: { id: parseInt(id, 10) },
    });

    await Promise.all(
      videoToDelete.categories.map(category =>
        prisma.category.update({
          where: { id: category.categoryId },
          data: { videoCount: { decrement: 1 } },
        })
      )
    );

    if (videoToDelete.qualityId) {
      await prisma.quality.update({
        where: { id: videoToDelete.qualityId },
        data: { videoCount: { decrement: 1 } },
      });
    }

    // Обновление счетчиков после удаления видео
    await updateCategoryVideoCounts();
    await updateQualityVideoCounts();

    res.status(204).end();
  } catch (error) {
    console.error('Ошибка при удалении видео:', error);
    res.status(500).json({ error: 'Ошибка при удалении видео' });
  }
};

const updateCategoryVideoCounts = async () => {
  const categories = await prisma.category.findMany();

  await Promise.all(
    categories.map(async (category) => {
      const videoCount = await prisma.videoCategory.count({
        where: { categoryId: category.id }
      });

      await prisma.category.update({
        where: { id: category.id },
        data: { videoCount }
      });
    })
  );
};

// Функция для пересчета количества видео по качеству
const updateQualityVideoCounts = async () => {
  const qualities = await prisma.quality.findMany();

  await Promise.all(
    qualities.map(async (quality) => {
      const videoCount = await prisma.video.count({
        where: { qualityId: quality.id }
      });

      await prisma.quality.update({
        where: { id: quality.id },
        data: { videoCount }
      });
    })
  );
};

export const getCategories = async (req: Request, res: Response) => {
  await updateCategoryVideoCounts();
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        videoCount: true
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
};

export const getQualities = async (req: Request, res: Response) => {
  await updateQualityVideoCounts();
  try {
    const qualities = await prisma.quality.findMany({
      select: {
        id: true,
        name: true,
        videoCount: true
      }
    });
    res.json(qualities);
  } catch (error) {
    console.error('Ошибка при получении качеств:', error);
    res.status(500).json({ error: 'Ошибка при получении качеств' });
  }
};

export const getVideosByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const videos = await prisma.video.findMany({
      where: {
        categories: {
          some: {
            categoryId: parseInt(categoryId, 10),
          },
        },
      },
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } },
        quality: true,
      },
    });

    res.json(videos);
  } catch (error) {
    console.error('Ошибка при получении видео по категории:', error);
    res.status(500).json({ error: 'Ошибка при получении видео по категории' });
  }
};

export const getVideosByQuality = async (req: Request, res: Response) => {
  const { qualityId } = req.params;

  try {
    const videos = await prisma.video.findMany({
      where: {
        qualityId: parseInt(qualityId, 10),
      },
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } },
        quality: true,
      },
    });

    res.json(videos);
  } catch (error) {
    console.error('Ошибка при получении видео по качеству:', error);
    res.status(500).json({ error: 'Ошибка при получении видео по качеству' });
  }
};

export const downloadVideo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!video) {
      return res.status(404).json({ error: 'Видео не найдено' });
    }

    const videoPath = path.join('data/uploads', video.path);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    const extname = path.extname(videoPath);
    const sanitizedFileName = video.title.replace(/[<>:"/\\|?*]/g, '_') + extname;

    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFileName}"`);
    res.setHeader('Content-Type', 'video/mp4');

    const fileStream = fs.createReadStream(videoPath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error('Ошибка при чтении файла:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Ошибка при чтении файла' });
      }
    });
  } catch (error) {
    console.error('Ошибка при получении видео:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Ошибка при получении видео' });
    }
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  const { userId, videoId } = req.body;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId: userId,
          videoId: videoId,
        },
      },
    });

    let updatedLikeCount;
    let liked;

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_videoId: {
            userId: userId,
            videoId: videoId,
          },
        },
      });

      const video = await prisma.video.update({
        where: { id: videoId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });

      updatedLikeCount = video.likeCount;
      liked = false;
    } else {
      await prisma.like.create({
        data: {
          userId: userId,
          videoId: videoId,
        },
      });

      const video = await prisma.video.update({
        where: { id: videoId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      updatedLikeCount = video.likeCount;
      liked = true;
    }

    res.status(200).json({
      message: 'Like toggled successfully',
      likeCount: updatedLikeCount,
      liked: liked,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Error toggling like' });
  }
};

export const getTopVideos = async (req: Request, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      select: {
        id: true,
        title: true,
        path: true,
        preview: true,
        qualityId: true,
        authorId: true,
        description: true,
        likeCount: true,
      },
      orderBy: {
        likeCount: 'desc',
      }
    });

    res.json(videos);
  } catch (error) {
    console.error('Ошибка при получении топ видео:', error);
    res.status(500).json({ error: 'Ошибка при получении топ видео' });
  }
};