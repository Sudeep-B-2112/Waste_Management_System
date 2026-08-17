import express from 'express';
import WasteRequest from '../models/WasteRequest.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', auth(), async (req, res) => {
  let q = {};
  if (req.user.role === 'user') q.user = req.user.id;
  if (req.user.role === 'collector') q.assignedCollector = req.user.id;

  const [total, pending, assigned, collected, completed] = await Promise.all(
    ['Pending', 'Assigned', 'Collected', 'Completed']
      .map((s) => WasteRequest.countDocuments({ ...q, status: s }))
      .concat([WasteRequest.countDocuments(q)])
  );

  res.json({ totalRequests: total, pending, assigned, collected, completed });
});

export default router;