import fs from 'fs';
import path from 'path';
import process from 'process';
const __dirnames = process.cwd();
export default function https() {
  if (fs.existsSync('https')) {
    return {
      key: fs.readFileSync(path.join(__dirnames, 'https', 'ssl.key')),
      cert: fs.readFileSync(path.join(__dirnames, 'https', 'ssl.crt')),
    };
  }
}
