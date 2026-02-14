import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// THIS LINE IS THE FIX
const rootDir = path.resolve(__dirname, '..');

export default rootDir;
