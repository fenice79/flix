import express from 'express';
import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { LocalVideo, VideoMetadata } from '../types';
import { getVideoMetadata } from '../services/tmdb';

const router = express.Router();

// Lista tutti i video disponibili
router.get('/videos', async (req, res) => {
  try {
    const files = fs.readdirSync(config.videoPath);
    const videos: LocalVideo[] = files
      .filter(file => config.supportedFormats.includes(path.extname(file)))
      .map(file => {
        const filePath = path.join(config.videoPath, file);
        const stats = fs.statSync(filePath);
        
        return {
          id: Buffer.from(file).toString('base64'),
          fileName: file,
          path: filePath,
          format: path.extname(file),
          size: stats.size
        };
      });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei video' });
  }
});

// Streaming video
router.get('/videos/:id/stream', (req, res) => {
  try {
    const videoId = Buffer.from(req.params.id, 'base64').toString();
    const videoPath = path.join(config.videoPath, videoId);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: 'Video non trovato' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
      const chunksize = (end-start)+1;
      const file = fs.createReadStream(videoPath, {start, end});
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ error: 'Errore nello streaming del video' });
  }
});

// Metadata del video
router.get('/videos/:id/metadata', async (req, res) => {
  try {
    const videoId = Buffer.from(req.params.id, 'base64').toString();
    const videoPath = path.join(config.videoPath, videoId);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: 'Video non trovato' });
    }

    // Qui puoi implementare la logica per estrarre il TMDB ID dal nome del file
    // Per esempio: "Movie.Name.2023.1080p.[tmdb-12345].mp4"
    const tmdbIdMatch = videoId.match(/\[tmdb-(\d+)\]/);
    const tmdbId = tmdbIdMatch ? parseInt(tmdbIdMatch[1]) : undefined;

    if (tmdbId) {
      const metadata = await getVideoMetadata(tmdbId);
      res.json(metadata);
    } else {
      res.json({
        id: Buffer.from(videoId).toString('base64'),
        fileName: videoId,
        path: videoPath,
        format: path.extname(videoId),
        size: fs.statSync(videoPath).size
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei metadata' });
  }
});

export default router;