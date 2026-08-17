import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.json({ message: 'EcoTrack API running' }));

app.use('/api/auth', authRoutes);
app.use('/api', requestRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', reportRoutes);

async function seed() {
  const demos = [
    ['Admin', 'admin@example.com', 'admin123', 'admin'],
    ['Demo User', 'user@example.com', 'user123', 'user'],
    ['Demo Collector', 'collector@example.com', 'collector123', 'collector'],
  ];

  for (const [name, email, password, role] of demos) {
    if (!(await User.findOne({ email }))) {
      await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
    }
  }
}

connectDB()
  .then(async () => {
    await seed();
    app.listen(process.env.PORT || 5000, () =>
      console.log(`API running on ${process.env.PORT || 5000}`)
    );
  })
  .catch((e) => {
    console.error('Startup error:', e);
    process.exit(1);
  });