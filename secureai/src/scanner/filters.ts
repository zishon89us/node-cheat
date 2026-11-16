export const MAX_FILE_BYTES = 1024 * 1024;

const SKIP_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.webp',
  '.bmp',
  '.pdf',
  '.zip',
  '.tar',
  '.gz',
  '.tgz',
  '.rar',
  '.7z',
  '.exe',
  '.dll',
  '.so',
  '.dylib',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.otf',
  '.mp4',
  '.avi',
  '.mov',
  '.mp3',
  '.wav',
  '.ogg',
  '.webm',
  '.lock',
  '.map',
  '.min.js',
]);

const SKIP_DIRECTORIES = [
  'node_modules/',
  'dist/',
  'build/',
  '.git/',
  'coverage/',
  'vendor/',
  '__pycache__/',
];

export function shouldScanPath(filePath: string): boolean {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('package-lock.json')) return false;
  for (const ext of SKIP_EXTENSIONS) {
    if (lower.endsWith(ext)) return false;
  }
  const withSlash = `/${lower}`;
  return !SKIP_DIRECTORIES.some(dir => withSlash.includes(`/${dir}`));
}

export function isProbablyBinary(content: string): boolean {
  return content.includes('\u0000');
}
