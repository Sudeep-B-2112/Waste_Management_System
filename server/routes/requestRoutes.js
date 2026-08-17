import express from 'express';
import mongoose from 'mongoose';
import WasteRequest from '../models/WasteRequest.js';
import User from '../models/User.js';
import { auth } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/collectors', auth(['admin']), async (req, res) =>
  res.json(await User.find({ role: 'collector' }).select('name email phone'))
);

router.post('/requests', auth(['user']), async (req, res) => {
  try {
    const r = await WasteRequest.create({ ...req.body, user: req.user.id });
    res.status(201).json(r);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/requests', auth(), async (req, res) => {
  let q = {};
  if (req.user.role === 'user') q.user = req.user.id;
  if (req.user.role === 'collector') q.assignedCollector = req.user.id;

  const rows = await WasteRequest.find(q)
    .populate('user', 'name phone email')
    .populate('assignedCollector', 'name email phone')
    .populate('verifiedBy', 'name');

  res.json(rows);
});

router.put('/requests/:id/assign', auth(['admin']), async (req, res) => {
  try {
    const { collectorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(collectorId)) {
      return res.status(400).json({ message: 'Please select a valid collector' });
    }

    const c = await User.findOne({ _id: collectorId, role: 'collector' });
    if (!c) return res.status(404).json({ message: 'Collector not found' });

    const r = await WasteRequest.findByIdAndUpdate(
      req.params.id,
      { assignedCollector: collectorId, status: 'Assigned', verificationStatus: 'Not Submitted' },
      { new: true }
    );

    if (!r) return res.status(404).json({ message: 'Waste request not found' });

    res.json(r);
  } catch (e) {
    res.status(500).json({ message: 'Failed to assign collector' });
  }
});

router.put('/requests/:id/status', auth(['collector']), async (req, res) => {
  const r = await WasteRequest.findOneAndUpdate(
    { _id: req.params.id, assignedCollector: req.user.id },
    { status: req.body.status },
    { new: true }
  );

  if (!r) return res.status(404).json({ message: 'Assigned request not found' });

  res.json(r);
});

router.post('/requests/:id/photo', auth(['collector']), upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Photo is required' });

  const r = await WasteRequest.findOneAndUpdate(
    { _id: req.params.id, assignedCollector: req.user.id },
    {
      collectionPhoto: '/uploads/' + req.file.filename,
      status: 'Collected',
      verificationStatus: 'Pending Verification',
    },
    { new: true }
  );

  if (!r) return res.status(404).json({ message: 'Assigned request not found' });

  res.json(r);
});

router.put('/requests/:id/verify', auth(['admin']), async (req, res) => {
  const { approved, rejectionReason } = req.body;

  const update = approved
    ? { status: 'Completed', verificationStatus: 'Verified', verifiedBy: req.user.id, rejectionReason: null }
    : {
        status: 'Collected',
        verificationStatus: 'Rejected',
        rejectionReason: rejectionReason || 'Proof rejected',
        verifiedBy: null,
      };

  const r = await WasteRequest.findByIdAndUpdate(req.params.id, update, { new: true });

  if (!r) return res.status(404).json({ message: 'Waste request not found' });

  res.json(r);
});

export default router;