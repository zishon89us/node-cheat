import { Router } from 'express';

const router = Router();

// curl -X POST http://localhost:3000/bar/hello
router.post('/hello', (req, res) => {
  res.send('It is POST');
});

// curl http://localhost:3000/bar/hi
router.get('/hi', (req, res) => {
  res.send('It is GET');
});

export default router;
