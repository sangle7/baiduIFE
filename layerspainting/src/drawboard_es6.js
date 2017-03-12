import {
	Colorpicker
} from './colorpicker_es6.js';

export class Drawboard {
	constructor(obj) {
		this.initDOM();
		this.canvas = document.getElementById('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas.width = 1000;
		this.canvas.height = 500;
		this.newcolorpicker = new Colorpicker({});
		this.bindEvent();
		this.layer = 0;
	}

	initDOM() {
		const str = '<header id="toolbox"><ul class="dowebok"> <li><input type="radio" name="tool" class="labelauty" id="labelauty-42332" value="pen"><label for="labelauty-42332"><span class="labelauty-unchecked-image"></span><span class="labelauty-unchecked">画笔</span><span class="labelauty-checked-image"></span><span class="labelauty-checked">画笔</span></label><select id="penLineWidth"><option value="2">2px</option><option value="4">4px</option><option value="6">6px</option><option value="8">8px</option></select></li><li><input type="radio" name="tool" class="labelauty"  id="labelauty-42333" value="pen"><label for="labelauty-42333"> <span class="labelauty-unchecked-image"></span><span class="labelauty-unchecked">刷子</span><span class="labelauty-checked-image"></span><span class="labelauty-checked">刷子</span></label><select id="brushWidth"><option value="5">5px</option><option value="10">10px</option><option value="15">15px</option><option value="20">20px</option></select></li><li><input type="radio" name="tool" class="labelauty" id="labelauty-42334" value="pengqiang"><label for="labelauty-42334"><span class="labelauty-unchecked-image"></span><span class="labelauty-unchecked">喷枪</span><span class="labelauty-checked-image"></span><span class="labelauty-checked">喷枪</span></label><select id="AirbrushWidth"><option value="10">10px</option><option value="15">15px</option><option value="20">20px</option><option value="30">30px</option></select> </li><div class="btn-group" style="position: absolute;bottom: 0;"></div><button id="opencolorpicker" class="button button-glow button-rounded button-caution">拾色器</button><button type="button" id="setbackground" class="button button-glow button-rounded button-highlight">设置背景</button><ul class="dropdown-menu" id="setbackgrounddropdown"> <li><a>white</a></li><li><a>black</a></li><li><a>transparent</a></li><li><a>拾色器前景色</a></li></ul></ul></header><div id="colorpicker"></div><canvas class="db_canvas" id="canvas"></canvas><canvas class="db_canvas db_add_canvas" id="canvas-bg" height="500" width="1000" style="z-index:-999"></canvas><ul id="layersOption"></ul>'
		document.getElementById('main').innerHTML = str;
	}

	bindEvent() {
		let tools = document.getElementsByName('tool');
		for (let i = 0; i < tools.length; i++) {
			tools[i].onclick = () => {
				let toolArray = [this.drawPen.bind(this), this.drawBrush.bind(this), this.drawAirBrush.bind(this)];
				toolArray[i]();
			}
		}
		document.getElementById('opencolorpicker').onclick = (e) => {
			e.stopPropagation();
			document.getElementById('colorpicker').style.display = 'block';
			document.getElementById('colorpicker').onclick = (e) => {
				e.stopPropagation();
			}
			document.getElementsByTagName('body')[0].onclick = (e) => {
				document.getElementById('colorpicker').style.display = 'none';
			}
		}

		document.getElementById('setbackground').onclick = (e) => {
			e.stopPropagation();
			document.getElementById('setbackgrounddropdown').style.display = 'block';
			let bgcllist = document.getElementById('setbackgrounddropdown').getElementsByTagName('a');

			for (let i = 0; i < bgcllist.length; i++) {
				bgcllist[i].onclick = (e) => {
					e.stopPropagation();
					this.changeBgColor(bgcllist[i].innerHTML)
				}
			}

			document.getElementsByTagName('body')[0].onclick = (e) => {
				document.getElementById('setbackgrounddropdown').style.display = 'none';
			}
		}

	}

	changeBgColor(colorname) {
		let _new = document.getElementById('canvas-bg');
		let _context = _new.getContext('2d');

		_context.clearRect(0, 0, 1000, 500);
		if (colorname == '拾色器前景色') {
			_context.fillStyle = this.newcolorpicker.color;
			_context.fillRect(0, 0, 1000, 500)
		} else if (colorname == 'transparent') {
			let background = new Image();
			background.src = require('./transparentBG.png');
			background.onload = () => {
				var pattern = _context.createPattern(background, 'repeat');
				_context.fillStyle = pattern;
				_context.fillRect(0, 0, 1000, 500)
			}
		} else {
			_context.fillStyle = colorname;
			_context.fillRect(0, 0, 1000, 500)
		}
	}

	drawPen() {
		let canvasRect = this.canvas.getBoundingClientRect();
		//矩形框的左上角坐标
		let canvasLeft = canvasRect.left;
		let canvasTop = canvasRect.top;
		//画图坐标原点
		let sourceX = 0;
		let sourceY = 0;
		//鼠标点击按下事件，画图准备
		this.canvas.onmousedown = (e) => {
			//设置画笔颜色和宽度
			let color = this.newcolorpicker.color;
			let width = document.getElementById('penLineWidth').value;
			//设置原点坐标
			sourceX = e.clientX - canvasLeft;
			sourceY = e.clientY - canvasTop;

			let _new = document.createElement('canvas');
			_new.className = "db_canvas db_add_canvas";
			_new.setAttribute('id', '图层 ' + this.layer)
			document.getElementById('main').appendChild(_new);
			_new.width = 1000;
			_new.height = 500;
			_new.style.zIndex = -1;
			let _context = _new.getContext('2d');

			this.layer++;
			this.canvas.onmousemove = (e) => {

				//当前坐标
				let currX = e.clientX - canvasLeft;
				let currY = e.clientY - canvasTop;
				_context.beginPath();
				_context.moveTo(sourceX, sourceY);
				_context.lineTo(currX, currY);
				_context.strokeStyle = color;
				_context.lineWidth = width;
				_context.stroke();
				//设置原点坐标
				sourceX = currX;
				sourceY = currY;
			}

			this.canvas.onmouseup = (event) => {
				if (e.clientX == event.clientX && e.clientY == event.clientY) {
					document.getElementById('main').removeChild(_new)
					this.layer--
				}
				this.canvas.onmousemove = null;
				this.render(_new)
			};
		}
	}



	drawBrush() {
		let canvasRect = this.canvas.getBoundingClientRect();
		//矩形框的左上角坐标
		let canvasLeft = canvasRect.left;
		let canvasTop = canvasRect.top;
		//画图坐标原点
		let sourceX = 0;
		let sourceY = 0;
		//鼠标点击按下事件，画图准备
		this.canvas.onmousedown = (e) => {
			//设置画笔颜色和宽度
			let color = this.newcolorpicker.color;
			let width = document.getElementById('brushWidth').value;
			//设置原点坐标
			sourceX = e.clientX - canvasLeft;
			sourceY = e.clientY - canvasTop;

			let _new = document.createElement('canvas');
			_new.className = "db_canvas db_add_canvas";
			_new.setAttribute('id', '图层 ' + this.layer)
			document.getElementById('main').appendChild(_new);
			_new.width = 1000;
			_new.height = 500;
			_new.style.zIndex = -1;
			let _context = _new.getContext('2d');

			this.layer++;
			this.canvas.onmousemove = (e) => {
				//当前坐标
				let currX = e.clientX - canvasLeft;
				let currY = e.clientY - canvasTop;
				for (let i = 0; i < width; i++) {
					_context.beginPath();
					_context.moveTo(sourceX, sourceY + i);
					_context.lineTo(currX, currY + i);
					_context.strokeStyle = color;
					_context.strokeWidth = width;
					_context.stroke();
				}
				//设置原点坐标
				sourceX = currX;
				sourceY = currY;
			};
			this.canvas.onmouseup = (event) => {
				if (e.clientX == event.clientX && e.clientY == event.clientY) {
					document.getElementById('main').removeChild(_new)
					this.layer--
				}
				this.canvas.onmousemove = null;
				this.render(_new)
			}
		};
	}

	drawAirBrush() {
		let canvasRect = this.canvas.getBoundingClientRect();
		//矩形框的左上角坐标
		let canvasLeft = canvasRect.left;
		let canvasTop = canvasRect.top;
		//画图坐标原点
		let _sourceX = 0;
		let _sourceY = 0;
		let timer;
		//鼠标点击按下事件，画图准备
		this.canvas.onmousedown = (e) => {
			//设置画笔颜色和宽度
			this.Airbrushwidth = document.getElementById('AirbrushWidth').value;
			//设置原点坐标
			_sourceX = e.clientX - canvasLeft;
			_sourceY = e.clientY - canvasTop;

			let _new = document.createElement('canvas');
			_new.className = "db_canvas db_add_canvas";
			_new.setAttribute('id', '图层 ' + this.layer)
			document.getElementById('main').appendChild(_new);
			_new.width = 1000;
			_new.height = 500;
			_new.style.zIndex = -1;
			let _context = _new.getContext('2d');

			this.layer++;

			timer = setInterval(() => {
				this.drawPoints(_context, _sourceX, _sourceY);
			}, 5)

			this.canvas.onmousemove = (e) => {
				//当前坐标
				var currX = e.clientX - canvasLeft;
				var currY = e.clientY - canvasTop;
				window.clearInterval(timer);
				timer = setInterval(() => {
					this.drawPoints(_context, currX, currY);
				}, 5)
			};
			this.canvas.onmouseup = (e) => {
				this.canvas.onmousemove = null;
				window.clearInterval(timer)
				this.render(_new)
			};
		};
	}

	drawPoints(con, evx, evy) {
		let color = this.newcolorpicker.color;
		let R = this.Airbrushwidth * Math.random();
		let arc = 2 * Math.PI * Math.random();
		let x = R * Math.sin(arc);
		let y = R * Math.cos(arc);
		con.beginPath();
		con.moveTo(evx + x, evy + y);
		con.lineTo(evx + x + 1, evy + y);
		con.strokeStyle = color;
		con.strokeWidth = 1;
		con.stroke();
	}

	render(dom) {
		let str = '<li><i class="fa fa-times" aria-hidden="true"></i> <i class="fa fa-eye showornot" aria-hidden="true"></i>' + dom.id + '</li>'
		document.getElementById('layersOption').innerHTML = str + document.getElementById('layersOption').innerHTML;
		this.initlayersOp();
	}

	initlayersOp() {
		let _canvaslayers = document.getElementsByClassName('db_add_canvas');
		let _layersDel = document.getElementById('layersOption').getElementsByClassName('fa-times');
		let _layersEye = document.getElementById('layersOption').getElementsByClassName('showornot');
		let _layers = document.getElementById('layersOption').getElementsByTagName('li')
		for (let i = 0; i < _layersDel.length; i++) {
			_layersDel[i].onclick = (e) => {
				document.getElementById('layersOption').removeChild(_layers[i])
				document.getElementById('main').removeChild(_canvaslayers[_canvaslayers.length - i - 1])
				this.initlayersOp()
			}
		}
		for (let i = 0; i < _layersEye.length; i++) {
			_layersEye[i].onclick = (e) => {
				if (/eye-slash/.test(_layersEye[i].className)) {
					_layersEye[i].className = _layersEye[i].className.replace(/eye-slash/, 'eye')
					_canvaslayers[_canvaslayers.length - i - 1].style.display = 'initial'
				} else {
					_layersEye[i].className = _layersEye[i].className.replace(/eye/, 'eye-slash')
					_canvaslayers[_canvaslayers.length - i - 1].style.display = 'none'
				}
			}
		}
	}
}