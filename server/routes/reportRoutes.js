import express from 'express';
import WasteRequest from '../models/WasteRequest.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/reports', auth(['admin']), async (req, res) => {
  const [completed, byType] = await Promise.all([
    WasteRequest.countDocuments({ status: 'Completed' }),
    WasteRequest.aggregate([
      { $group: { _id: '$wasteType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.json({ completed, byType });
});

export default router;