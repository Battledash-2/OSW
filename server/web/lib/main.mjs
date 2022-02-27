import * as api from "./api.mjs";

api.loadFiles();
api.createWebFrameApplet('File Mgr', '/apps/filemgr/');

setInterval(api.loadFiles, 5000);