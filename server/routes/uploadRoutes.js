import express from 'express';

const router = express.Router();

// Accepts an array of image URLs and returns them (no upload handling)
router.post('/', (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ message: 'No image URLs provided' });
  }
  res.json({ urls });
});

export default router;
