import express from 'express';
import { Tenant } from '../models/Tenant.ts';
import { User } from '../models/User.ts';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const { name } = req.body;
  try {
    const tenant = await Tenant.create({ name });
    res.status(201).json(tenant);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id/users', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const users = await User.find({ tenantId: req.params.id }).select('-password');
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
