import * as api from "./lib/api.mjs";

api.loadFiles();

api.createWebFrameApplet('File Mgr', './apps/filemgr/');
api.createWebFrameApplet('LSCode', 'https://battledash-2.github.io/Live-IDE');

api.saveFiles();

setInterval(api.loadFiles, 5000);
