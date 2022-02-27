let z = 0;

// ------ Errors ------
// FILES
export class AUFNSP extends Error {}; // attempted, usage, (of), file, not, sufficent, permissions
export class IORDNX extends Error {}; // in out, read, not (x)exist (like EOENT)
export class AOFUTL extends Error {}; // attempted, open, file, unknown, type, (during), launch

/*<div class="application">
		<div class="application-header">
			<h1>Title</h1>
			<div class="application-controls">
				<button class="app-ctrl-min">-</button>
				<button class="app-ctrl-fs">▉</button>
				<button class="app-ctrl-close">X</button>
			</div>
		</div>
		<div class="application-body">
			Hello, world!
		</div>
	</div>*/
const elm = (e='')=>document.createElement(e);

const createDiv = ()=>elm('div');
const createH1 = ()=>elm('h1');
const createBtn = (c)=>{let a = elm('button');a.classList.add(c);return a;};

const makeDraggableWith = (item, header) => { // from w3schools
	const drag = (e) => {
		e = e || window.event;
		e.preventDefault();
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		item.style.top = (item.offsetTop - pos2) + 'px';
		item.style.left = (item.offsetLeft - pos1) + 'px';
	}
	const closeDrag = () => {
		document.onmouseup = null;
		document.onmousemove = null;
	}
	const mouseDown = (e) => {
		e = e || window.event;
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDrag;
		document.onmousemove = drag;
	}
	let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (typeof header !== 'undefined') header.onmousedown = mouseDown;
	else item.onmousedown = mouseDown;
}

const _application = () => {
	const applicationDiv = createDiv();
	applicationDiv.classList.add('application');
	
	const header = createDiv();
	header.classList.add('application-header');

	const headerText = createH1();
	headerText.innerText = 'Title';

	const body = createDiv();
	body.classList.add('application-body');

	header.appendChild(headerText);

	const controls = createDiv();
	controls.classList.add('application-controls');

	const min = createBtn('app-ctrl-min');
	min.innerText = '-';
	const fs = createBtn('app-ctrl-fs');
	fs.innerText = '▉';
	const close = createBtn('app-ctrl-close');
	close.innerText = 'X';

	controls.appendChild(min);
	controls.appendChild(fs);
	controls.appendChild(close);

	header.appendChild(controls);
	applicationDiv.appendChild(header);
	applicationDiv.appendChild(body);
	
	return {
		item: applicationDiv,
		title: headerText,
		header,
		body,
		controls: {
			min,
			fs,
			close,
		}
	};
}
export function createApplication(title, body, isModule=false, onMinimize=()=>{}, onFullscreen=()=>{}, onClose=()=>{}, width, height) {
	const application = _application();
	application.item.addEventListener('mousedown', ()=>{
		application.item.style.zIndex = ++z;
	});
	application.title.innerText = title;
	application.body.innerHTML = body ?? '';

	if (typeof width !== 'undefined') application.item.style.width = width + 'px';
	if (typeof height !== 'undefined') application.item.style.height = height + 'px';


	makeDraggableWith(application.item, application.header);

	let minimized = false;

	application.controls.min.addEventListener('click', ()=>{
		onMinimize(minimized);
		// minimize
		let od = application.item.style.display; // original display
		application.item.style.display = 'none';
		createTask(title, (task)=>{
			task.parentElement.removeChild(task);
			application.item.style.display = od;
		});
	});
	application.controls.fs.addEventListener('click', ()=>{
		onFullscreen();
		// fullscreen
		application.item.classList.toggle('fullscreen');
	});
	application.controls.close.addEventListener('click', ()=>{
		onClose();
		// close
		application.item.parentElement.removeChild(application.item);
	});
	
	if (!isModule) document.body.appendChild(application.item);
	return application;
}

/*
<div class="task">
		run.kos
	</div>
	*/
export function createTask(taskC='',onOpen=()=>{}) {
	const task = createDiv();
	task.classList.add('task');
	task.innerText = taskC;
	task.addEventListener('click', ()=>onOpen(task));
	document.querySelector('#tasks').appendChild(task);
	return task;
}

/*
<div id="desktop-application">
		<span class="desktop-inner">
			run.kos<br/>
		</span>
	</div>
	*/
export function createDesktopItem(itemName='', onOpen=()=>{}) {
	const task = createDiv();
	task.classList.add('desktop-application');

	const span = elm('span');
	span.classList.add('desktop-inner');
	span.innerText = itemName;

	task.appendChild(span);

	let clicked = false;

	task.addEventListener('click', ()=>{
		onOpen(clicked);
		clicked = true;
	});

	document.querySelector('#desktop').appendChild(task);
	return task;
}

export let ifiles = {};
export function saveFiles(files) {
	files = files ?? ifiles;
	localStorage.setItem('files', JSON.stringify(files));
}
export function loadFiles(isModule=false, files) {
	files = files ?? ifiles;
	let res = localStorage.getItem('files');
	if (res == null) return files;
	files = JSON.parse(res);
	ifiles = files;
	if (!isModule) {
		document.querySelector('#desktop').innerHTML = '';
		for (let item in files) {
			createDesktopItem(item, ()=>{
				openFile(item);
			});
		}
	}
	
	return files;
}

export function createFile(fileName='unknown.txt', fileBody='', isModule=false, files) {
	files = files ?? ifiles;
	if (typeof files[fileName] === 'undefined' && !isModule) createDesktopItem(fileName, ()=>{
		openFile(fileName);
	});
	files[fileName] = {
		type: 'text',
		body: fileBody,
	}
}
export function createCmdShort(fileName='unknown.cmd', command='console.log("Hello, world!");', isModule=false, files) {
	files = files ?? ifiles;
	if (typeof files[fileName] === 'undefined' && !isModule) createDesktopItem(fileName, ()=>{
		openFile(fileName);
	});
	files[fileName] = {
		type: 'cmd',
		body: command,
	};
}
export function createAppletL(fileName='unknown.app', applet='<!DOCTYPE html>\n<html><body>\n\t<h1>Hello, world!</h1>\n</body>\n</html>', scripts='', isModule=false, files) {
	files = files ?? ifiles;
	if (typeof files[fileName] === 'undefined' && !isModule) createDesktopItem(fileName, ()=>{
		openFile(fileName);
	});
	files[fileName] = {
		type: 'app',
		body: applet,
		script: scripts,
	};
}
export function createWebFrameApplet(fileName='unknown.wap', appletPath='https://google.com', isModule=false, files) {
	files = files ?? ifiles;
	if (typeof files[fileName] === 'undefined' && !isModule) createDesktopItem(fileName, ()=>{
		openFile(fileName);
	});
	files[fileName] = {
		type: 'wap',
		url: appletPath,
	};
}
function _openFile(fileName='unknown.txt', files) {
	files = files ?? ifiles;
	if (typeof files[fileName] === 'undefined') throw new IORDNX(`[Read] attempt to read file '${fileName}' (but it doesn't exist)`);
	return files[fileName];
}
export function openFile(filename='unknown.txt', isModule=false) {
	const file = _openFile(filename);
	let application;
	switch (file.type) {
		case 'text':
			application = createApplication(filename, file.body, isModule);
			break;
		case 'cmd':
			return eval(file.body);
		case 'app': {
			const iframe = document.createElement('iframe');
			iframe.srcdoc = `
			<script type="module">
				// Injected
				import * as api from "./lib/api.mjs"
				window.api = api;
				window.app = '${filename.replace(/'/g, '\\\'')}';
			</script>
			`+file.body;
			application = createApplication(filename, iframe.outerHTML, isModule);
			eval(file.script);
			break;
		}
		case 'wap': {
			application = createApplication(filename, '', isModule);
			const iframe = elm('iframe');
			iframe.src = file.url;
			application.body.appendChild(iframe);
			break;
		}
		default:
			throw new AOFUTL(`[Read] attempt to read file '${filename}' of unknown type '${file.type}' (cannot launch)`);
	}
	return application;
}