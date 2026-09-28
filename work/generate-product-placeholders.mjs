import sharp from '../delicias-rosicleia/node_modules/sharp/lib/index.js';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const outputDirectory = join(
  process.cwd(),
  'public',
  'produtos',
);

await mkdir(outputDirectory, { recursive: true });

const palettes = [
  ['#FBF8F2', '#C6A15C', '#9C7B33'],
  ['#FFFDF9', '#EFE3C8', '#6B5D45'],
  ['#2B2216', '#C6A15C', '#F2E9D8'],
];

for (const [index, [background, accent, ink]] of palettes.entries()) {
  const offset = 80 + index * 55;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <filter id="grain">
          <feTurbulence baseFrequency="0.7" numOctaves="2" seed="${index + 8}" type="fractalNoise" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="table" tableValues="0 0.08" /></feComponentTransfer>
        </filter>
      </defs>
      <rect width="1200" height="900" fill="${background}" />
      <circle cx="${1050 - offset}" cy="${115 + offset}" r="330" fill="none" stroke="${accent}" stroke-width="2" />
      <circle cx="${150 + offset}" cy="${820 - offset}" r="420" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="2" />
      <path d="M0 ${300 + offset} C 310 ${180 + offset}, 720 ${520 - offset}, 1200 ${245 + offset}" fill="none" stroke="${accent}" stroke-width="3" opacity="0.72" />
      <rect width="1200" height="900" filter="url(#grain)" opacity="0.4" />
      <text x="76" y="760" fill="${ink}" font-family="Arial, sans-serif" font-size="28" letter-spacing="1.5">Imagem do produto em breve</text>
    </svg>`;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
    .toFile(join(outputDirectory, `placeholder-${index + 1}.jpg`));
}

console.log('Três imagens provisórias criadas em public/produtos.');
