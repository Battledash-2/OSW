import * as OPD from "./opcodes.js"
import * as API from "../api.mjs"

export default class VML {
	#ip;
	#stack;
	#item;
	#selected;
	#op;

	constructor(source=[], autoInsertHalt=true, OP) {
		if (typeof OP === 'undefined') OP = OPD;
		this.#op = OP;
		if (autoInsertHalt && source[source.length-1] !== OP.HALT) source.push(OP.HALT);
		this.source = source;
		this.#ip = 0;
		this.#stack = [];
	}
	
	#read() {
		return this.source[this.#ip++];
	}
	#push_stack(value) {
		this.#stack.push(value);
	}
	#pop_stack() {
		return this.#stack.pop();
	}

	evaluate(OP) {
		if (typeof OP === 'undefined') OP = OPD;
		if (typeof this.#op !== 'undefined') OP = this.#op;
		for (;;) {
			const byte = this.#read();
			switch (byte) {
				case OP.HALT:
					return this.#stack[this.#stack.length - 1];
				case OP.CONST:
					this.#push_stack(this.#read());
					break;
				
				case OP.ADD: {
					let a = this.#pop_stack();
					let b = this.#pop_stack();
					this.#push_stack(b + a);
					break;
				}
				case OP.SUB: {
					let a = this.#pop_stack();
					let b = this.#pop_stack();
					this.#push_stack(b - a);
					break;
				}
				case OP.MUL: {
					let a = this.#pop_stack();
					let b = this.#pop_stack();
					this.#push_stack(b * a);
					break;
				}
				case OP.DIV: {
					let a = this.#pop_stack();
					let b = this.#pop_stack();
					this.#push_stack(b / a);
					break;
				}
				case OP.EXP: {
					let a = this.#pop_stack();
					let b = this.#pop_stack();
					this.#push_stack(b ** a);
					break;
				}
				case OP.ARB:
					this.#push_stack(eval(this.#read()));
					break;
				case OP.CAPP: {
					let title = this.#pop_stack();
					let app = API.createApplication(title, '');
					this.#selected = app;
					break;
				}
				case OP.GYP: {
					let s = this.#selected.item.style.top;
					if (s === "" || typeof s === 'undefined') s = '0';
					this.#push_stack(parseInt(s));
					break;
				}
				case OP.GXP: {
					let s = this.#selected.item.style.left;
					if (s === "" || typeof s === 'undefined') s = '0';
					this.#push_stack(parseInt(s));
					break;
				}
				case OP.XPOS: {
					let b = this.#read();
					if (typeof b !== 'string') b = b.toString() + 'px';
					this.#selected.item.style.left = b;
					break;
				}
				case OP.YPOS: {
					let b = this.#read();
					if (typeof b !== 'string') b = b.toString() + 'px';
					this.#selected.item.style.top = b;
					break;
				}
				case OP.CELM: {
					let item = document.createElement(this.#read());
					this.#item = item;
					this.#selected.body.appendChild(item);
					break;
				}
				case OP.ELMP: {
					let path = this.#read();
					let obj = this.#item;
					for (let i = 0; i<path.split('.').length-1; i++) {
						obj = obj[path.split('.')[i]];
					}
					obj[path.split('.')[path.split('.').length-1]] = this.#pop_stack();
					break;
				}
				case OP.GELM: {
					let path = this.#read();
					let obj = this.#item;
					for (let i = 0; i<path.split('.').length-1; i++) {
						obj = obj[path.split('.')[i]];
					}
					this.#push_stack(obj[path.split('.')[path.split('.').length-1]]);
					break;	
				}
				case OP.STYLE: {
					let path = this.#read();
					path = 'style.'+path;
					let obj = this.#item;
					for (let i = 0; i<path.split('.').length-1; i++) {
						obj = obj[path.split('.')[i]];
					}
					obj[path.split('.')[path.split('.').length-1]] = this.#pop_stack();
					break;
				}
			}
		}
	}
}
export const VM = VML;
export const OP = OPD;