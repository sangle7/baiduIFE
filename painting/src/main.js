import colorpicker from './colorpicker.js'

let tools = document.getElementsByName('tool');
let state = {
	color: 'rgb(255,0,0)',
}

let toolArray = [drawPen, drawBrush, drawAirBrush, eraser]
for (let i = 0; i < tools.length; i++) {
	tools[i].onclick = toolArray[i]
}
document.getElementById('cleanAll').onclick = cleanAll;

colorpicker();
document.getElementById('opencolorpicker').onclick = function(e) {
	e.stopPropagation();
	document.getElementById('colorpicker').style.display = 'block';
	document.getElementById('colorpicker').onclick = function(e) {
		e.stopPropagation();
	}
	document.getElementsByTagName('body')[0].onclick = function(e) {
		e.stopPropagation();
		let RGBinput = document.getElementsByClassName('testTxt');
		state.color = 'rgb(' + RGBinput[0].value + ',' + RGBinput[1].value + ',' + RGBinput[2].value + ')';
		console.log(state.color)
		document.getElementById('colorpicker').style.display = 'none';
	}
}

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 500;

function drawPen() {
	var canvasRect = canvas.getBoundingClientRect();
	//矩形框的左上角坐标
	var canvasLeft = canvasRect.left;
	var canvasTop = canvasRect.top;

	//画图坐标原点
	var sourceX = 0;
	var sourceY = 0;

	// var layerIndex = layer;
	// var layerName = "layer";

	//鼠标点击按下事件，画图准备
	canvas.onmousedown = function(e) {

			//设置画笔颜色和宽度
			var color = state.color;
			var width = document.getElementById('penLineWidth').value;

			//设置原点坐标
			sourceX = e.clientX - canvasLeft;
			sourceY = e.clientY - canvasTop;

			//鼠标移动事件，画图
			canvas.onmousemove = function(e) {

				// layerIndex++;
				// layer++;
				// layerName += layerIndex;
				//当前坐标
				var currX = e.clientX - canvasLeft;
				var currY = e.clientY - canvasTop;

				context.beginPath();
				context.moveTo(sourceX, sourceY);
				context.lineTo(currX, currY);
				context.strokeStyle = color;
				context.lineWidth = width;
				context.stroke();

				//设置原点坐标
				sourceX = currX;
				sourceY = currY;
			}
		}
		//鼠标没有按下了，画图结束
	canvas.onmouseup = function(e) {
		canvas.onmousemove = null;
	}
}

function drawBrush() {
	var canvasRect = canvas.getBoundingClientRect();
	//矩形框的左上角坐标
	var canvasLeft = canvasRect.left;
	var canvasTop = canvasRect.top;

	//画图坐标原点
	var sourceX = 0;
	var sourceY = 0;

	// var layerIndex = layer;
	// var layerName = "layer";

	//鼠标点击按下事件，画图准备
	canvas.onmousedown = function(e) {

			//设置画笔颜色和宽度
			var color = state.color;
			var width = document.getElementById('brushWidth').value;

			//设置原点坐标
			sourceX = e.clientX - canvasLeft;
			sourceY = e.clientY - canvasTop;

			//鼠标移动事件，画图
			canvas.onmousemove = function(e) {

				// layerIndex++;
				// layer++;
				// layerName += layerIndex;
				//当前坐标
				var currX = e.clientX - canvasLeft;
				var currY = e.clientY - canvasTop;

				for (let i = 0; i < width; i++) {
					context.beginPath();
					context.moveTo(sourceX, sourceY + i);
					context.lineTo(currX, currY + i);
					context.strokeStyle = color;
					context.strokeWidth = width;
					context.stroke();
				}

				//设置原点坐标
				sourceX = currX;
				sourceY = currY;
			}
		}
		//鼠标没有按下了，画图结束
	canvas.onmouseup = function(e) {
		canvas.onmousemove = null;
	}
}

function drawAirBrush() {
	var canvasRect = canvas.getBoundingClientRect();
	//矩形框的左上角坐标
	var canvasLeft = canvasRect.left;
	var canvasTop = canvasRect.top;

	//画图坐标原点
	var sourceX = 0;
	var sourceY = 0;

	let timer;
	// var layerIndex = layer;
	// var layerName = "layer";

	//鼠标点击按下事件，画图准备
	canvas.onmousedown = function(e) {

			//设置画笔颜色和宽度
			var color = state.color;
			var width = document.getElementById('AirbrushWidth').value;;

			//设置原点坐标
			sourceX = e.clientX - canvasLeft;
			sourceY = e.clientY - canvasTop;

			timer = setInterval(function() {
				drawPoints(sourceX, sourceY);
			}, 5)

			function drawPoints(evx, evy) {
				let R = width * Math.random();
				let arc = 2 * Math.PI * Math.random();
				let x = R * Math.sin(arc);
				let y = R * Math.cos(arc);
				context.beginPath();
				context.moveTo(evx + x, evy + y);
				context.lineTo(evx + x + 1, evy + y);
				context.strokeStyle = color;
				context.strokeWidth = 1;
				context.stroke();
			}
			//鼠标移动事件， 画图

			canvas.onmousemove = function(e) {
				var currX = e.clientX - canvasLeft;
				var currY = e.clientY - canvasTop;
				window.clearInterval(timer);
				timer = setInterval(function() {
					drawPoints(currX, currY);
				}, 5)
			}
		}
		//鼠标没有按下了，画图结束
	canvas.onmouseup = function(e) {
		canvas.onmousemove = null;
		window.clearInterval(timer)
	}
}

function eraser() {
	var canvasRect = canvas.getBoundingClientRect();
	//矩形框的左上角坐标
	var canvasLeft = canvasRect.left;
	var canvasTop = canvasRect.top;

	//画图坐标原点
	var sourceX = 0;
	var sourceY = 0;

	// var layerIndex = layer;
	// var layerName = "layer";

	//鼠标点击按下事件，画图准备
	canvas.onmousedown = function(e) {

			//设置画笔颜色和宽度
			var color = 'white';
			var width = 8;

			//设置原点坐标
			sourceX = e.clientX - canvasLeft;
			sourceY = e.clientY - canvasTop;

			//鼠标移动事件，画图
			canvas.onmousemove = function(e) {

				// layerIndex++;
				// layer++;
				// layerName += layerIndex;
				//当前坐标
				var currX = e.clientX - canvasLeft;
				var currY = e.clientY - canvasTop;

				context.beginPath();
				context.moveTo(sourceX, sourceY);
				context.lineTo(currX, currY);
				context.strokeStyle = color;
				context.lineWidth = width;
				context.stroke();

				//设置原点坐标
				sourceX = currX;
				sourceY = currY;
			}
		}
		//鼠标没有按下了，画图结束
	canvas.onmouseup = function(e) {
		canvas.onmousemove = null;
	}
}

function cleanAll() {
	context.clearRect(0, 0, 1000, 500);

}