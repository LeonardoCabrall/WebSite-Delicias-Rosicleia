import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { removeBackground } from '@imgly/background-removal-node';
import ffmpegPath from 'ffmpeg-static';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const source = join(root, 'public', 'brand', 'batatas-douradas.mp4');
const destination = join(
  root,
  'public',
  'brand',
  'batatas-douradas-transparent.webm',
);
const fps = 6;

function runFfmpeg(args) {
  return new Promise((resolveCommand, rejectCommand) => {
    const process = spawn(ffmpegPath, ['-hide_banner', '-loglevel', 'error', ...args], {
      stdio: 'inherit',
    });
    process.once('error', rejectCommand);
    process.once('exit', (code) => {
      if (code === 0) resolveCommand();
      else rejectCommand(new Error(`ffmpeg terminou com código ${code}`));
    });
  });
}

const workspace = await mkdtemp(join(tmpdir(), 'rosicleia-cutout-'));
const sourceFrames = join(workspace, 'source');
const transparentFrames = join(workspace, 'transparent');

try {
  await Promise.all([mkdir(sourceFrames), mkdir(transparentFrames)]);
  await runFfmpeg([
    '-i',
    source,
    '-vf',
    `fps=${fps},scale=540:-2`,
    join(sourceFrames, 'frame-%05d.png'),
  ]);

  const frames = (await readdir(sourceFrames)).sort();
  console.log(`Recortando ${frames.length} quadros com IA…`);

  for (const [index, frame] of frames.entries()) {
    const result = await removeBackground(
      pathToFileURL(join(sourceFrames, frame)).href,
      {
      model: 'small',
      output: { format: 'image/png', quality: 1 },
      },
    );
    await writeFile(
      join(transparentFrames, frame),
      Buffer.from(await result.arrayBuffer()),
    );
    console.log(`Quadro ${index + 1}/${frames.length}`);
  }

  await runFfmpeg([
    '-framerate',
    String(fps),
    '-i',
    join(transparentFrames, 'frame-%05d.png'),
    '-c:v',
    'libvpx-vp9',
    '-pix_fmt',
    'yuva420p',
    '-crf',
    '28',
    '-b:v',
    '0',
    '-row-mt',
    '1',
    '-auto-alt-ref',
    '0',
    '-an',
    '-y',
    destination,
  ]);

  console.log(`Vídeo transparente criado em ${destination}`);
} finally {
  await rm(workspace, { recursive: true, force: true });
}
