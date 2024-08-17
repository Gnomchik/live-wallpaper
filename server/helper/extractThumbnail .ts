import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

const extractThumbnail = async (videoPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputDir = path.resolve(__dirname, '..', 'data', 'preview');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFileName = path.basename(videoPath, path.extname(videoPath)) + '-thumbnail.png';
    const outputPath = path.join(outputDir, outputFileName);

    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['5'],
        filename: outputFileName,
        folder: outputDir,
        size: '640x480',
      })
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err));
  });
};

export { extractThumbnail };
