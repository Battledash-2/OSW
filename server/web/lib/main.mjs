import * as api from "./api.mjs";

api.loadFiles();
api.createAppletL('myapp.app', `
<!DOCTYPE html>
<html>
<head>
	<title>Document</title>
</head>
<body>
	<input placeholder="Name" id="name">
	<input type="password" placeholder="Pwd" id="password">
	<button id="sub" type="submit">Submit</button>
	<p id="c">...</p>
</body>
</html>
`,
`
document.querySelector("#sub").addEventListener('click', ()=>{
	const ni = document.querySelector("#name");
	const pwd = document.querySelector("#password");
	if (ni.value === 'Battledash' && pwd.value === '2') {
		document.querySelector("#c").innerHTML = "<span style='color: lightgreen'>Correct</span>";
	} else {
		document.querySelector("#c").innerHTML = "<span style='color: red'>Incorrect</span>";
	}
});
`);
api.saveFiles();

console.log('poo.txt:', api.openFile('poo.txt'));