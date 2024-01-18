import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const isWatch = process.argv.includes('--watch');
const src = path.parse('./src/index.js');
const out = path.parse('./dist/mergician.d.ts');

function build() {
  // Generated files
  exec(
    `tsc ${src.dir}/${src.base} --outDir ${out.dir} --allowJs --declaration --emitDeclarationOnly --noResolve --preserveWatchOutput --skipLibCheck`,
    (err, stdout, stderr) => {
      // eslint-disable-next-line no-console
      console.log(`${err ? '🔴' : '🟢'} tsc: ${out.dir}/${out.base}`);

      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return;
      }

      fs.renameSync(
        path.resolve(out.dir, `${src.name}.d.ts`),
        path.resolve(out.dir, `${out.base}`)
      );
    }
  );
}

// Build
// =============================================================================
// eslint-disable-next-line no-console
console.log(`Building${isWatch ? ' and watching' : ''} type declarations...\n`);

build();

if (isWatch) {
  fs.watch(src.dir, (eventType, fileName) => {
    if (eventType === 'change') {
      build();
    }
  });
}
