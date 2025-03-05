const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * GET /playlists - Retrieve all playlists owned by the logged-in user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { userId: req.user.userId }
    });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching playlists." });
  }
});

/**
 * GET /playlists/:id - Retrieve a specific playlist, including all tracks
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const playlistId = parseInt(req.params.id, 10);
    if (isNaN(playlistId)) return res.status(400).json({ error: "Invalid playlist ID" });

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: { tracks: true }
    });

    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    if (playlist.userId !== req.user.userId) {
      return res.status(403).json({ error: "Forbidden - You do not own this playlist" });
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the playlist." });
  }
});

/**
 * POST /playlists - Create a new playlist owned by the logged-in user
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, trackIds } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    if (!Array.isArray(trackIds)) {
      return res.status(400).json({ error: "trackIds must be an array" });
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId: req.user.userId,
        tracks: { connect: trackIds.map(id => ({ id })) }
      }
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the playlist." });
  }
});

module.exports = router;
