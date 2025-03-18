import { Request, Response } from 'express';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { events } = req.body;
    const filePath = join(process.cwd(), 'src', 'data', 'events.json');
    
    await writeFile(filePath, JSON.stringify({ events }, null, 2), 'utf8');
    
    res.status(200).json({ message: 'Events saved successfully' });
  } catch (error) {
    console.error('Error saving events:', error);
    res.status(500).json({ message: 'Error saving events' });
  }
}