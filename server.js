import express from 'express';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// In development, proxy requests to Vite dev server
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static('public'));
} else {
  app.use(express.static(join(__dirname, 'dist')));
}

const ensureDataDir = async () => {
  const dataDir = join(__dirname, 'src', 'data');
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
  return dataDir;
};

const getSeriesFileName = (seriesId) => {
  switch (seriesId) {
    case 'weekends':
      return 'weekends_2024.json';
    case 'holidays':
      return 'holidays_2024.json';
    case 'vacances':
      return 'vacances_scolaires_2024_2025.json';
    default:
      throw new Error('Invalid series ID');
  }
};

app.get('/api/events/:seriesId', async (req, res) => {
  try {
    const { seriesId } = req.params;
    const dataDir = await ensureDataDir();
    const fileName = getSeriesFileName(seriesId);
    const filePath = join(dataDir, fileName);
    
    const data = await readFile(filePath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading events:', error);
    res.status(500).json({ 
      message: 'Error reading events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { events, seriesId } = req.body;
    if (!Array.isArray(events) || !seriesId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const dataDir = await ensureDataDir();
    const fileName = getSeriesFileName(seriesId);
    const filePath = join(dataDir, fileName);
    
    await writeFile(filePath, JSON.stringify({ events }, null, 2), 'utf8');
    
    res.status(200).json({ message: 'Events saved successfully' });
  } catch (error) {
    console.error('Error saving events:', error);
    res.status(500).json({ 
      message: 'Error saving events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Handle SPA routing
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  } else {
    res.sendFile(join(__dirname, 'index.html'));
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});