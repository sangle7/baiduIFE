export default function() {
    let colorpicker = document.getElementById('colorpicker')
    let canvas2 = document.getElementById('canvas2');
    let context2 = canvas2.getContext('2d');
    canvas2.width = 20;
    canvas2.height = 400;

    let gar2 = context2.createLinearGradient(0, 0, 0, 400);
    gar2.addColorStop(0, 'rgb(255,0,0)');
    gar2.addColorStop('0.166', 'rgb(255,255,0)');
    gar2.addColorStop('0.33', 'rgb(0,255,0)');
    gar2.addColorStop('0.5', 'rgb(0,255,255)');
    gar2.addColorStop('0.67', 'rgb(0,0,255)');
    gar2.addColorStop('0.837', 'rgb(255,0,255)');
    gar2.addColorStop(1, 'rgb(255,0,0)');
    context2.fillStyle = gar2;
    context2.fillRect(0, 0, 20, 400);

    let _inputRGB = document.getElementsByClassName('testTxt');

    let red = _inputRGB[0].value = 255,
        green = _inputRGB[1].value = 0,
        blue = _inputRGB[2].value = 0;
    _inputRGB[3].value = 0;
    _inputRGB[4].value = 1;
    _inputRGB[5].value = 0.5;
    document.getElementsByClassName('canvas1')[0].style.backgroundColor = 'rgb(255,0,0)'
    document.getElementsByClassName('circle1')[0].style.top = -colorpicker.offsetTop - 9 + 'px';
    document.getElementsByClassName('circle1')[0].style.left = colorpicker.offsetLeft + 400 - 9 + 'px';
    canvas2.onclick = function(e) {
        let c = context2.getImageData(e.clientX - canvas2.offsetLeft, e.clientY - colorpicker.offsetTop, 1, 1).data;
        red = c[0];
        green = c[1];
        blue = c[2];
        document.getElementsByClassName('circle2')[0].style.top = e.clientY - colorpicker.offsetTop - 9 + 'px';
        document.getElementsByClassName('canvas1')[0].style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
        calculateColor(document.getElementsByClassName('circle1')[0].offsetLeft + 9, document.getElementsByClassName('circle1')[0].offsetTop + 9, red, green, blue)
    }
    document.getElementsByClassName('canvas1')[0].onclick = function(e) {
        let _bgcolor = document.getElementsByClassName('canvas1')[0].style.backgroundColor,
            _bgred = parseInt(_bgcolor.slice(4, -1).split(',')[0]),
            _bggreen = parseInt(_bgcolor.slice(4, -1).split(',')[1]),
            _bgblue = parseInt(_bgcolor.slice(4, -1).split(',')[2]);
        document.getElementsByClassName('circle1')[0].style.top = e.clientY - colorpicker.offsetTop - 9 + 'px';
        document.getElementsByClassName('circle1')[0].style.left = e.clientX - 9 + 'px';
        calculateColor(e.clientX - colorpicker.offsetLeft, e.clientY - colorpicker.offsetTop, _bgred, _bggreen, _bgblue)
    }

    function calculateColor(x, y, r, g, b) {
        _inputRGB[0].value = calculateRGB(r);
        _inputRGB[1].value = calculateRGB(g);
        _inputRGB[2].value = calculateRGB(b)
        RGBToHSL(_inputRGB[0].value, _inputRGB[1].value, _inputRGB[2].value)

        function calculateRGB(num) {
            return Math.round((255 - (255 - num) * (x / 400)) * (1 - y / 400))
        }
    }

    generateNewColor()

    function generateNewColor() {
        let _canvas1 = document.getElementsByClassName('canvas1')[0]
        for (let i = 0; i < 3; i++) {
            _inputRGB[i].onkeyup = function() {
                if (this.value > 255) {
                    this.value = 255
                }
                if (this.value < 0) {
                    this.value = 0
                }
                RGBToHSL(_inputRGB[0].value, _inputRGB[1].value, _inputRGB[2].value)
                changeColorByInputRGB();
            }
            _inputRGB[i].onchange = function() {
                if (this.value > 255) {
                    this.value = 255
                }
                if (this.value < 0) {
                    this.value = 0
                }
                RGBToHSL(_inputRGB[0].value, _inputRGB[1].value, _inputRGB[2].value)
                changeColorByInputRGB();
            }
        }
        for (let i = 3; i < 6; i++) {
            _inputRGB[i].onkeyup = function() {
                if (this.value < 0) {
                    this.value = 0
                }
                if (this.value > 1) {
                    this.value = 1
                }
                HSLToRGB(_inputRGB[3].value, _inputRGB[4].value, _inputRGB[5].value);
                changeColorByInputRGB();
            };
            _inputRGB[i].onchange = function() {
                if (this.value < 0) {
                    this.value = 0
                }
                if (this.value > 1) {
                    this.value = 1
                }
                HSLToRGB(_inputRGB[3].value, _inputRGB[4].value, _inputRGB[5].value);
                changeColorByInputRGB();
            };
        }

        function changeColorByInputRGB() {
            let R = {
                    name: 'r',
                    value: _inputRGB[0].value,
                    calculate: null
                },
                G = {
                    name: 'g',
                    value: _inputRGB[1].value,
                    calculate: null
                },
                B = {
                    name: 'b',
                    value: _inputRGB[2].value,
                    calculate: null
                },
                _array = [R, G, B];
            _array.sort(function(b, a) {
                return a.value - b.value
            })
            if (_array[0].value == _array[1].value) {
                _array[0].calculate = 255;
                _array[1].calculate = 255;
                _array[2].calculate = 0;
                _canvas1.style.backgroundColor = 'rgb(' + R.calculate + ',' + G.calculate + ',' + B.calculate + ')';
                let y = 400 * (1 - _array[0].value / 255),
                    x = 400 * (1 - _array[2].value / _array[0].value);
                document.getElementsByClassName('circle1')[0].style.top = y - 9 + 'px';
                document.getElementsByClassName('circle1')[0].style.left = colorpicker.offsetLeft + x - 9 + 'px';

            } else {
                _array[0].calculate = 255;
                _array[2].calculate = 0;
                let y = 400 * (1 - _array[0].value / 255),
                    x = 400 * (1 - _array[2].value / _array[0].value);
                _array[1].calculate = 255 - (400 / x) * (255 - 400 * _array[1].value / (400 - y))
                _canvas1.style.backgroundColor = 'rgb(' + Math.round(R.calculate) + ',' + Math.round(G.calculate) + ',' + Math.round(B.calculate) + ')';
                document.getElementsByClassName('circle1')[0].style.top = y - 9 + 'px';
                document.getElementsByClassName('circle1')[0].style.left = colorpicker.offsetLeft + x - 9 + 'px';
            }
        }
    }


    function RGBToHSL(r, g, b) {
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
        _inputRGB[3].value = h.toFixed(2);
        _inputRGB[4].value = s.toFixed(2);
        _inputRGB[5].value = l.toFixed(2);
    }

    function HSLToRGB(h, s, l) {
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
        _inputRGB[0].value = Math.round(_r * 255);
        _inputRGB[1].value = Math.round(_g * 255);
        _inputRGB[2].value = Math.round(_b * 255);
    }
}