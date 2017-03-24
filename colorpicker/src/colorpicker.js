export class Colorpicker {
    constructor(obj) {
        this.colorpicker = document.getElementById('colorpicker');
        this.initDOM();
        this.canvas2 = document.getElementById('colorpicker_canvas2');
        this.canvas1 = document.getElementsByClassName('canvas1')[0];
        this.circle1 = document.getElementsByClassName('circle')[0];
        this.context2 = this.canvas2.getContext('2d');
        this._inputRGB = document.getElementsByClassName('testTxt');
        this.canvas2.width = 20;
        this.canvas2.height = 400;
        this.initCanvas();
        this.generateNewColor();
        this.bindEvent();
        this.color = 'red';
    }

    initDOM() {
        const str = " <div class='canvas1'><div class='circle circle1'></div><div class='canvas1 ver'></div><div class='canvas1 hiz'></div></div><canvas id='colorpicker_canvas2'></canvas><div class='circle circle2'></div><div id='control'><div id='RGBtype'><label class='colorpickerLabel'>R:<input class='testTxt green' type='number' id='displayR' /></label><label class='colorpickerLabel'>G:<input class='testTxt green' type='number' id='displayG' /></label><label class='colorpickerLabel'>B:<input class='testTxt green' type='number' id='displayB' /></label></div><div id='HSLtype'><label class='colorpickerLabel'>H:<input class='testTxt green' type='number' step='0.01' id='displayH' /></label><label class='colorpickerLabel'>S:<input class='testTxt green' type='number' step='0.01' id='displayS' /></label><label class='colorpickerLabel'>L:<input class='testTxt green' type='number' step='0.01' id='displayL' /></label></div></div>"
        this.colorpicker.innerHTML = str;
    }

    initCanvas() {
        const gar2 = this.context2.createLinearGradient(0, 0, 0, 400);
        gar2.addColorStop(0, 'rgb(255,0,0)');
        gar2.addColorStop('0.166', 'rgb(255,255,0)');
        gar2.addColorStop('0.33', 'rgb(0,255,0)');
        gar2.addColorStop('0.5', 'rgb(0,255,255)');
        gar2.addColorStop('0.67', 'rgb(0,0,255)');
        gar2.addColorStop('0.837', 'rgb(255,0,255)');
        gar2.addColorStop(1, 'rgb(255,0,0)');
        this.context2.fillStyle = gar2;
        this.context2.fillRect(0, 0, 20, 400);
    }


    bindEvent() {
        let red = this._inputRGB[0].value = 255,
            green = this._inputRGB[1].value = 0,
            blue = this._inputRGB[2].value = 0;
        this._inputRGB[3].value = 0;
        this._inputRGB[4].value = 1;
        this._inputRGB[5].value = 0.5;
        this.canvas1.style.backgroundColor = 'rgb(255,0,0)'
        document.getElementsByClassName('circle1')[0].style.top = -this.colorpicker.offsetTop - 9 + 'px';
        document.getElementsByClassName('circle1')[0].style.left = this.colorpicker.offsetLeft + 400 - 9 + 'px';


        this.canvas2.addEventListener("click", (e) => {
            e.preventDefault();
            let c = this.context2.getImageData(e.clientX - this.canvas2.offsetLeft, e.clientY - this.colorpicker.offsetTop, 1, 1).data;
            red = c[0];
            green = c[1];
            blue = c[2];
            document.getElementsByClassName('circle2')[0].style.top = e.clientY - this.colorpicker.offsetTop - 9 + 'px';
            this.canvas1.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
            this.calculateColor(document.getElementsByClassName('circle1')[0].offsetLeft + 9, document.getElementsByClassName('circle1')[0].offsetTop + 9, red, green, blue)
        });

        this.canvas1.addEventListener("click", (e) => {
            e.preventDefault();
            let _bgcolor = this.canvas1.style.backgroundColor,
                _bgred = parseInt(_bgcolor.slice(4, -1).split(',')[0]),
                _bggreen = parseInt(_bgcolor.slice(4, -1).split(',')[1]),
                _bgblue = parseInt(_bgcolor.slice(4, -1).split(',')[2]);
            document.getElementsByClassName('circle1')[0].style.top = e.clientY - this.colorpicker.offsetTop - 9 + 'px';
            document.getElementsByClassName('circle1')[0].style.left = e.clientX - 9 + 'px';
            this.calculateColor(e.clientX - this.colorpicker.offsetLeft, e.clientY - this.colorpicker.offsetTop, _bgred, _bggreen, _bgblue)
        });
    }

    calculateColor(x, y, r, g, b) {
        this._inputRGB[0].value = this.calculateRGB(r, x, y);
        this._inputRGB[1].value = this.calculateRGB(g, x, y);
        this._inputRGB[2].value = this.calculateRGB(b, x, y)
        this.color = 'rgb(' + this.calculateRGB(r, x, y) + ',' + this.calculateRGB(g, x, y) + ',' + this.calculateRGB(b, x, y) + ')'
        this.RGBToHSL(this._inputRGB[0].value, this._inputRGB[1].value, this._inputRGB[2].value)
    }

    calculateRGB(num, x, y) {
        return Math.round((255 - (255 - num) * (x / 400)) * (1 - y / 400))
    }

    generateNewColor() {
        for (let i = 0; i < 3; i++) {
            this._inputRGB[i].addEventListener("keyup", (e) => {
                e.preventDefault();
                if (this._inputRGB[i].value > 255) {
                    this._inputRGB[i].value = 255
                }
                if (this._inputRGB[i].value < 0) {
                    this._inputRGB[i].value = 0
                }
                this.RGBToHSL(this._inputRGB[0].value, this._inputRGB[1].value, this._inputRGB[2].value)
                this.changeColorByInputRGB();
            });
            this._inputRGB[i].addEventListener("change", (e) => {
                e.preventDefault();
                if (this._inputRGB[i].value > 255) {
                    this._inputRGB[i].value = 255
                }
                if (this._inputRGB[i].value < 0) {
                    this._inputRGB[i].value = 0
                }
                this.RGBToHSL(this._inputRGB[0].value, this._inputRGB[1].value, this._inputRGB[2].value)
                this.changeColorByInputRGB();
            });
        }
        for (let i = 3; i < 6; i++) {
            this._inputRGB[i].addEventListener("keyup", (e) => {
                e.preventDefault();
                if (this._inputRGB[i].value > 1) {
                    this._inputRGB[i].value = 1
                }
                if (this._inputRGB[i].value < 0) {
                    this._inputRGB[i].value = 0
                }
                this.HSLToRGB(this._inputRGB[3].value, this._inputRGB[4].value, this._inputRGB[5].value);
                this.changeColorByInputRGB();
            });
            this._inputRGB[i].addEventListener("change", (e) => {
                e.preventDefault();
                if (this._inputRGB[i].value > 1) {
                    this._inputRGB[i].value = 1
                }
                if (this._inputRGB[i].value < 0) {
                    this._inputRGB[i].value = 0
                }
                this.HSLToRGB(this._inputRGB[3].value, this._inputRGB[4].value, this._inputRGB[5].value);
                this.changeColorByInputRGB();
            });
        }
    }

    changeColorByInputRGB() {
        let R = {
                name: 'r',
                value: this._inputRGB[0].value,
                calculate: null
            },
            G = {
                name: 'g',
                value: this._inputRGB[1].value,
                calculate: null
            },
            B = {
                name: 'b',
                value: this._inputRGB[2].value,
                calculate: null
            },
            _array = [R, G, B];
        this.color = 'rgb(' + R.value + ',' + G.value + ',' + B.value + ')'
        _array.sort(function(b, a) {
            return a.value - b.value
        })
        if (_array[0].value == _array[1].value) {
            _array[0].calculate = 255;
            _array[1].calculate = 255;
            _array[2].calculate = 0;
            this.canvas1.style.backgroundColor = 'rgb(' + R.calculate + ',' + G.calculate + ',' + B.calculate + ')';
            let y = 400 * (1 - _array[0].value / 255),
                x = 400 * (1 - _array[2].value / _array[0].value);
            this.circle1.style.top = y - 9 + 'px';
            this.circle1.style.left = this.colorpicker.offsetLeft + x - 9 + 'px';

        } else {
            _array[0].calculate = 255;
            _array[2].calculate = 0;
            let y = 400 * (1 - _array[0].value / 255),
                x = 400 * (1 - _array[2].value / _array[0].value);
            _array[1].calculate = 255 - (400 / x) * (255 - 400 * _array[1].value / (400 - y))
            this.canvas1.style.backgroundColor = 'rgb(' + Math.round(R.calculate) + ',' + Math.round(G.calculate) + ',' + Math.round(B.calculate) + ')';
            this.circle1.style.top = y - 9 + 'px';
            this.circle1.style.left = this.colorpicker.offsetLeft + x - 9 + 'px';
        }
    }

    RGBToHSL(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        this._inputRGB[3].value = h.toFixed(2);
        this._inputRGB[4].value = s.toFixed(2);
        this._inputRGB[5].value = l.toFixed(2);
    }

    HSLToRGB(h, s, l) {
        h = parseFloat(h);
        s = parseFloat(s);
        l = parseFloat(l);
        let _r, _g, _b;
        if (s == 0) {
            _r = _g = _b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            _r = hue2rgb(p, q, h + 1 / 3);
            _g = hue2rgb(p, q, h);
            _b = hue2rgb(p, q, h - 1 / 3);
        }
        this._inputRGB[0].value = Math.round(_r * 255);
        this._inputRGB[1].value = Math.round(_g * 255);
        this._inputRGB[2].value = Math.round(_b * 255);
    }
}
