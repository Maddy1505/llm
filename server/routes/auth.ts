import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.ts';
import { Tenant } from '../models/Tenant.ts';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

router.post('/register', async (req, res) => {
  const { name, email, password, tenantName } = req.body;

  try {
    let tenant;
    if (tenantName) {
      tenant = await Tenant.create({ name: tenantName });
    } else {
      // Default tenant if none provided
      tenant = await Tenant.findOne({ name: 'Default Organization' });
      if (!tenant) {
        tenant = await Tenant.create({ name: 'Default Organization' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      tenantId: tenant._id,
      role: 'Admin', // First user in tenant is Admin
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, tenantId: user.tenantId } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user: any = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, tenantId: user.tenantId } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
