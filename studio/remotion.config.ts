import {Config} from '@remotion/cli/config';
import fs from 'fs';
// Use whichever Playwright headless shell the container ships (version folder changes between images).
const root = '/opt/pw-browsers';
const shell = fs.existsSync(root) ? fs.readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .flatMap((d) => [`${root}/${d}/chrome-headless-shell-linux64/chrome-headless-shell`, `${root}/${d}/chrome-linux/headless_shell`]).find((p) => fs.existsSync(p)) : undefined;
if (shell) Config.setBrowserExecutable(shell);
Config.setVideoImageFormat('jpeg');
Config.setConcurrency(4);
