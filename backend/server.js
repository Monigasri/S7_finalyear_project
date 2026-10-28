
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import citizenRoutes from './routes/citizenRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'WelfareAI API is running'
  });
});

app.use('/api/citizens', citizenRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/applications', applicationRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

try {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WelfareAI API listening on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start WelfareAI API:', error);
  process.exit(1);
}
