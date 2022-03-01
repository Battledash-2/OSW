import * as api from "./api.mjs";


api.createWebFrameApplet('File Mgr', '/apps/filemgr/');

api.loadFiles();
api.saveFiles();

setInterval(api.loadFiles, 5000);