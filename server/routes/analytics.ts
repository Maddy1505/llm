import express from 'express';
import { User } from '../models/User.ts';
import { Document } from '../models/Document.ts';
import { Chat } from '../models/Chat.ts';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const totalUsers = await User.countDocuments({ tenantId: req.user.tenantId });
    const totalDocuments = await Document.countDocuments({ tenantId: req.user.tenantId });
    const totalChats = await Chat.countDocuments({ tenantId: req.user.tenantId });

    // Mock query count (sum of messages in all chats)
    const chats = await Chat.find({ tenantId: req.user.tenantId });
    const totalQueries = chats.reduce((acc, chat) => acc + chat.messages.filter(m => m.role === 'user').length, 0);

    // Mock data for charts
    const chartData = [
      { name: 'Jan', queries: 10, docs: 2 },
      { name: 'Feb', queries: 25, docs: 5 },
      { name: 'Mar', queries: totalQueries, docs: totalDocuments },
    ];

    res.json({
      stats: {
        totalUsers,
        totalDocuments,
        totalQueries,
        totalChats,
      },
      chartData,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
