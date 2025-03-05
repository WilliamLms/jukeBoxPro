const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * GET /tracks - Retrieve all tracks
 */
router.get('/', async (req, res) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching tracks." });
  }
});

/**
 * GET /tracks/:id - Retrieve a specific track
 * If logged in, also include the user's playlists containing this track
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const trackId = parseInt(req.params.id, 10);
    if (isNaN(trackId)) return res.status(400).json({ error: "Invalid track ID" });

    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: req.user
        ? {
            playlists: {
              where: { userId: req.user.userId } // Only include user's playlists
            }
          }
        : {}
    });

    if (!track) return res.status(404).json({ error: "Track not found" });

    res.json(track);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the track." });
  }
});

module.exports = router;
