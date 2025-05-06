import express, { Request, Response } from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();
const PORT = 5000;

interface RequestBody {
  url: string;
}

interface ExecResult {
  stdout: string;
  stderr: string;
}

app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.post('/get-video', async (req: Request, res: Response) => {
  try {
    console.log('Request received for video extraction');
    const { url } = req.body as RequestBody;
    console.log("URL:", url);
    
    if (!url) {
      console.log('Error: URL is required');
      res.status(400).json({ error: "URL is required" });
    }
    
    console.log('Executing yt-dlp command...');
    const { stdout, stderr }: ExecResult = await execAsync(`yt-dlp -g "${url}"`);
    console.log('Command executed successfully');
    
    if (stderr && !stderr.includes("WARNING:")) {
      console.error(`Error: ${stderr}`);
      res.status(500).json({ error: 'Failed to get video URL' });
    }

    const videoUrl = stdout.trim();
    console.log(`Video URL extracted successfully`);
    
     res.status(200).json({ videoUrl: videoUrl });
  } catch (error) {
    console.error('Error:', error);
     res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});