import express from 'express';
import { ENV } from './config/env.js'

const PORT = ENV.PORT;

const app = express();

app.get('/api/health', (_, res) => {
  return res.status(200).json({ success: true, message: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
