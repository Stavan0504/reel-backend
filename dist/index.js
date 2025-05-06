"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Health check endpoint
app.get('/', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});
app.post('/get-video', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Request received for video extraction');
        const { url } = req.body;
        console.log("URL:", url);
        if (!url) {
            console.log('Error: URL is required');
            res.status(400).json({ error: "URL is required" });
        }
        console.log('Executing yt-dlp command...');
        const { stdout, stderr } = yield execAsync(`yt-dlp -g "${url}"`);
        console.log('Command executed successfully');
        if (stderr && !stderr.includes("WARNING:")) {
            console.error(`Error: ${stderr}`);
            res.status(500).json({ error: 'Failed to get video URL' });
        }
        const videoUrl = stdout.trim();
        console.log(`Video URL extracted successfully`);
        res.status(200).json({ videoUrl: videoUrl });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
