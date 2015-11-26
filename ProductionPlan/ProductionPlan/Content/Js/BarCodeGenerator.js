/*!
 *  BarCode Coder Library (BCC Library)
 *  BCCL Version 2.0
 *    
 *  Porting : jQuery barcode plugin 
 *  Version : 2.0.3
 *   
 *  Date    : 2013-01-06
 *  Author  : DEMONTE Jean-Baptiste <jbdemonte@gmail.com>
 *            HOUREZ Jonathan
 *             
 *  Web site: http://barcode-coder.com/
 *  dual licence :  http://www.cecill.info/licences/Licence_CeCILL_V2-fr.html
 *                  http://www.gnu.org/licenses/gpl.html
 */
(function ($) {

    var barcode = {
        settings: {
            barWidth: 1,
            barHeight: 50,
            moduleSize: 5,
            showHRI: true,
            addQuietZone: true,
            marginHRI: 5,
            bgColor: "#FFFFFF",
            color: "#000000",
            fontSize: 10,
            output: "css",
            posX: 0,
            posY: 0
        },
        intval: function (val) {
            var type = typeof (val);
            if (type == 'string') {
                val = val.replace(/[^0-9-.]/g, "");
                val = parseInt(val * 1, 10);
                return isNaN(val) || !isFinite(val) ? 0 : val;
            }
            return type == 'number' && isFinite(val) ? Math.floor(val) : 0;
        },
        ean: {
            encoding: [
                ["0001101", "0100111", "1110010"],
                ["0011001", "0110011", "1100110"],
                ["0010011", "0011011", "1101100"],
                ["0111101", "0100001", "1000010"],
                ["0100011", "0011101", "1011100"],
                ["0110001", "0111001", "1001110"],
                ["0101111", "0000101", "1010000"],
                ["0111011", "0010001", "1000100"],
                ["0110111", "0001001", "1001000"],
                ["0001011", "0010111", "1110100"]
            ],
            first: ["000000", "001011", "001101", "001110", "010011", "011001", "011100", "010101", "010110", "011010"],
            getDigit: function (code, type) {
                // Check len (12 for ean13, 7 for ean8)
                var len = type == "ean8" ? 7 : 12;
                code = code.substring(0, len);
                if (code.length != len) return ("");
                // Check each digit is numeric
                var c;
                for (var i = 0; i < code.length; i++) {
                    c = code.charAt(i);
                    if ((c < '0') || (c > '9')) return ("");
                }
                // get checksum
                code = this.compute(code, type);

                // process analyse
                var result = "101"; // start

                if (type == "ean8") {

                    // process left part
                    for (var i = 0; i < 4; i++) {
                        result += this.encoding[barcode.intval(code.charAt(i))][0];
                    }

                    // center guard bars
                    result += "01010";

                    // process right part
                    for (var i = 4; i < 8; i++) {
                        result += this.encoding[barcode.intval(code.charAt(i))][2];
                    }

                } else { // ean13
                    // extract first digit and get sequence
                    var seq = this.first[barcode.intval(code.charAt(0))];

                    // process left part
                    for (var i = 1; i < 7; i++) {
                        result += this.encoding[barcode.intval(code.charAt(i))][barcode.intval(seq.charAt(i - 1))];
                    }

                    // center guard bars
                    result += "01010";

                    // process right part
                    for (var i = 7; i < 13; i++) {
                        result += this.encoding[barcode.intval(code.charAt(i))][2];
                    }
                } // ean13

                result += "101"; // stop
                return (result);
            },
            compute: function (code, type) {
                var len = type == "ean13" ? 12 : 7;
                code = code.substring(0, len);
                var sum = 0,
                    odd = true;
                for (i = code.length - 1; i > -1; i--) {
                    sum += (odd ? 3 : 1) * barcode.intval(code.charAt(i));
                    odd = !odd;
                }
                return (code + ((10 - sum % 10) % 10).toString());
            }
        },
        // little endian convertor
        lec: {
            // convert an int
            cInt: function (value, byteCount) {
                var le = '';
                for (var i = 0; i < byteCount; i++) {
                    le += String.fromCharCode(value & 0xFF);
                    value = value >> 8;
                }
                return le;
            },
            // return a byte string from rgb values 
            cRgb: function (r, g, b) {
                return String.fromCharCode(b) + String.fromCharCode(g) + String.fromCharCode(r);
            },
            // return a byte string from a hex string color
            cHexColor: function (hex) {
                var v = parseInt('0x' + hex.substr(1));
                var b = v & 0xFF;
                v = v >> 8;
                var g = v & 0xFF;
                var r = v >> 8;
                return (this.cRgb(r, g, b));
            }
        },
        hexToRGB: function (hex) {
            var v = parseInt('0x' + hex.substr(1));
            var b = v & 0xFF;
            v = v >> 8;
            var g = v & 0xFF;
            var r = v >> 8;
            return ({
                r: r,
                g: g,
                b: b
            });
        },
        // test if a string is a hexa string color (like #FF0000)
        isHexColor: function (value) {
            var r = new RegExp("#[0-91-F]", "gi");
            return value.match(r);
        },
        // encode data in base64
        base64Encode: function (value) {
            var r = '',
                c1, c2, c3, b1, b2, b3, b4;
            var k = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var i = 0;
            while (i < value.length) {
                c1 = value.charCodeAt(i++);
                c2 = value.charCodeAt(i++);
                c3 = value.charCodeAt(i++);
                b1 = c1 >> 2;
                b2 = ((c1 & 3) << 4) | (c2 >> 4);
                b3 = ((c2 & 15) << 2) | (c3 >> 6);
                b4 = c3 & 63;
                if (isNaN(c2)) b3 = b4 = 64;
                else if (isNaN(c3)) b4 = 64;
                r += k.charAt(b1) + k.charAt(b2) + k.charAt(b3) + k.charAt(b4);
            }
            return r;
        },
        // convert a bit string to an array of array of bit char
        bitStringTo2DArray: function (digit) {
            var d = [];
            d[0] = [];
            for (var i = 0; i < digit.length; i++) d[0][i] = digit.charAt(i);
            return (d);
        },
        // clear jQuery Target
        resize: function ($container, w) {
            $container
                .css("padding", "0px")
                .css("overflow", "auto")
                .css("width", w + "px")
                .html("");
            return $container;
        },

        // canvas barcode renderer
        digitToCanvasRenderer: function ($container, settings, digit, hri, xi, yi, mw, mh) {

            var canvas = $container.get(0);
            if (!canvas || !canvas.getContext) return; // not compatible

            var lines = digit.length;
            var columns = digit[0].length;

            var ctx = canvas.getContext('2d');
            ctx.lineWidth = 1;
            ctx.lineCap = 'butt';
            ctx.fillStyle = settings.bgColor;
            ctx.fillRect(xi, yi, columns * mw, lines * mh);

            ctx.fillStyle = settings.color;

            for (var y = 0; y < lines; y++) {
                var len = 0;
                var current = digit[y][0];
                for (var x = 0; x < columns; x++) {
                    if (current == digit[y][x]) {
                        len++;
                    } else {
                        if (current == '1') {
                            ctx.fillRect(xi + (x - len) * mw, yi + y * mh, mw * len, mh);
                        }
                        current = digit[y][x];
                        len = 1;
                    }
                }
                if ((len > 0) && (current == '1')) {
                    ctx.fillRect(xi + (columns - len) * mw, yi + y * mh, mw * len, mh);
                }
            }
            if (settings.showHRI) {
                //var dim = ctx.measureText(hri);
                //ctx.fillText(hri, xi + Math.floor((columns * mw - dim.width) / 2), yi + lines * mh + settings.fontSize + settings.marginHRI);
            }
        },
        // canvas 1D barcode renderer
        digitToCanvas: function ($container, settings, digit, hri) {
            var w = barcode.intval(settings.barWidth);
            var h = barcode.intval(settings.barHeight);
            var x = barcode.intval(settings.posX);
            var y = barcode.intval(settings.posY);
            this.digitToCanvasRenderer($container, settings, this.bitStringTo2DArray(digit), hri, x, y, w, h);
        },
        
    };

    $.fn.extend({
        barcode: function (code, type, settings) {
            var digit = "",
                hri = "";
            if (code == "") return (false);

            if (typeof (settings) == "undefined") settings = [];
            for (var name in barcode.settings) {
                if (settings[name] == undefined) settings[name] = barcode.settings[name];
            }

            digit = barcode.ean.getDigit(code, type);
            hri = barcode.ean.compute(code, type);

            if (digit.length == 0) return ($(this));

            var $this = $(this);
            barcode.digitToCanvas($this, settings, digit, hri);

            return ($this);
        }
    });

}(jQuery));