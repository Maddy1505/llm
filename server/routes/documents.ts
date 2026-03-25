import express from 'express';
import multer from 'multer';
import { Document } from '../models/Document.ts';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.single('file'), async (req: AuthRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const document = await Document.create({
      title: req.body.title || req.file.originalname,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      tenantId: req.user.tenantId,
      uploadedBy: req.user._id,
    });

    res.status(201).json(document);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const documents = await Document.find({ tenantId: req.user.tenantId })
      .populate('uploadedBy', 'name');
    res.json(documents);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const document = await Document.findOneAndDelete({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ message: 'Document deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
