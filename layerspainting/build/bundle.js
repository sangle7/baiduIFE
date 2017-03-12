/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function () {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}
	var convertSourceMap = __webpack_require__(5);
	var sourceMapping = convertSourceMap.fromObject(cssMapping).toComment({ multiline: true });
	var sourceURLs = cssMapping.sources.map(function (source) {
		return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
	});
	return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _drawboard_es = __webpack_require__(12);

__webpack_require__(16);

__webpack_require__(15);

var ss = new _drawboard_es.Drawboard({});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function placeHoldersCount(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
}

function byteLength(b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64);
}

function toByteArray(b64) {
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;
  placeHolders = placeHoldersCount(b64);

  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 0xFF;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 0x3F];
    output += lookup[tmp << 2 & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('');
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(3);
var ieee754 = __webpack_require__(6);
var isArray = __webpack_require__(7);

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength();

function typedArraySupport() {
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
        return 42;
      } };
    return arr.foo() === 42 && // typed array instances can be augmented
    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
  } catch (e) {
    return false;
  }
}

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length');
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    });
  }
}

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
  }
  return createBuffer(that, size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that;
}

function fromObject(that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
  }
  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length);
}

Buffer.isBuffer = function isBuffer(b) {
  return !!(b != null && b._isBuffer);
};

Buffer.compare = function compare(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;
      case 'hex':
        return len >>> 1;
      case 'base64':
        return base64ToBytes(string).length;
      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0;

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
    // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return '';
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;

        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {/* eslint-disable */

// XXXXX: This file should not exist. Working around a core level bug
// that prevents using fs at loaders.
//var fs = require('fs'); // XXX

var path = __webpack_require__(8);

var commentRx = /^\s*\/(?:\/|\*)[@#]\s+sourceMappingURL=data:(?:application|text)\/json;(?:charset[:=]\S+?;)?base64,(?:.*)$/mg;
var mapFileCommentRx =
//Example (Extra space between slashes added to solve Safari bug. Exclude space in production):
//     / /# sourceMappingURL=foo.js.map           /*# sourceMappingURL=foo.js.map */
/(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/){1}[ \t]*$)/mg;

function decodeBase64(base64) {
  return new Buffer(base64, 'base64').toString();
}

function stripComment(sm) {
  return sm.split(',').pop();
}

function readFromFileMap(sm, dir) {
  // NOTE: this will only work on the server since it attempts to read the map file

  mapFileCommentRx.lastIndex = 0;
  var r = mapFileCommentRx.exec(sm);

  // for some odd reason //# .. captures in 1 and /* .. */ in 2
  var filename = r[1] || r[2];
  var filepath = path.resolve(dir, filename);

  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch (e) {
    throw new Error('An error occurred while trying to read the map file at ' + filepath + '\n' + e);
  }
}

function Converter(sm, opts) {
  opts = opts || {};

  if (opts.isFileComment) sm = readFromFileMap(sm, opts.commentFileDir);
  if (opts.hasComment) sm = stripComment(sm);
  if (opts.isEncoded) sm = decodeBase64(sm);
  if (opts.isJSON || opts.isEncoded) sm = JSON.parse(sm);

  this.sourcemap = sm;
}

Converter.prototype.toJSON = function (space) {
  return JSON.stringify(this.sourcemap, null, space);
};

Converter.prototype.toBase64 = function () {
  var json = this.toJSON();
  return new Buffer(json).toString('base64');
};

Converter.prototype.toComment = function (options) {
  var base64 = this.toBase64();
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return options && options.multiline ? '/*# ' + data + ' */' : '//# ' + data;
};

// returns copy instead of original
Converter.prototype.toObject = function () {
  return JSON.parse(this.toJSON());
};

Converter.prototype.addProperty = function (key, value) {
  if (this.sourcemap.hasOwnProperty(key)) throw new Error('property %s already exists on the sourcemap, use set property instead');
  return this.setProperty(key, value);
};

Converter.prototype.setProperty = function (key, value) {
  this.sourcemap[key] = value;
  return this;
};

Converter.prototype.getProperty = function (key) {
  return this.sourcemap[key];
};

exports.fromObject = function (obj) {
  return new Converter(obj);
};

exports.fromJSON = function (json) {
  return new Converter(json, { isJSON: true });
};

exports.fromBase64 = function (base64) {
  return new Converter(base64, { isEncoded: true });
};

exports.fromComment = function (comment) {
  comment = comment.replace(/^\/\*/g, '//').replace(/\*\/$/g, '');

  return new Converter(comment, { isEncoded: true, hasComment: true });
};

exports.fromMapFileComment = function (comment, dir) {
  return new Converter(comment, { commentFileDir: dir, isFileComment: true, isJSON: true });
};

// Finds last sourcemap comment in file or returns null if none was found
exports.fromSource = function (content) {
  var m = content.match(commentRx);
  return m ? exports.fromComment(m.pop()) : null;
};

// Finds last sourcemap comment in file or returns null if none was found
exports.fromMapFileSource = function (content, dir) {
  var m = content.match(mapFileCommentRx);
  return m ? exports.fromMapFileComment(m.pop(), dir) : null;
};

exports.removeComments = function (src) {
  return src.replace(commentRx, '');
};

exports.removeMapFileComments = function (src) {
  return src.replace(mapFileCommentRx, '');
};

exports.generateMapFileComment = function (file, options) {
  var data = 'sourceMappingURL=' + file;
  return options && options.multiline ? '/*# ' + data + ' */' : '//# ' + data;
};

Object.defineProperty(exports, 'commentRegex', {
  get: function getCommentRegex() {
    return commentRx;
  }
});

Object.defineProperty(exports, 'mapFileCommentRegex', {
  get: function getMapFileCommentRegex() {
    return mapFileCommentRx;
  }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4).Buffer))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function splitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function () {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function (path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function (p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function (path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function () {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function (p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};

// path.relative(from, to)
// posix version
exports.relative = function (from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};

exports.basename = function (path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  return splitPath(path)[3];
};

function filter(xs, f) {
  if (xs.filter) return xs.filter(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
  return str.substr(start, len);
} : function (str, start, len) {
  if (start < 0) start = str.length + start;
  return str.substr(start, len);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Colorpicker = exports.Colorpicker = function () {
    function Colorpicker(obj) {
        _classCallCheck(this, Colorpicker);

        this.colorpicker = document.getElementById('colorpicker');
        this.initDOM();
        this.canvas2 = document.getElementById('colorpicker_canvas2');
        this.canvas1 = document.getElementsByClassName('canvas1')[0];
        this.context2 = this.canvas2.getContext('2d');
        this._inputRGB = document.getElementsByClassName('testTxt');
        this.canvas2.width = 20;
        this.canvas2.height = 400;
        this.initCanvas();
        this.generateNewColor();
        this.bindEvent();
        this.color = 'red';
    }

    _createClass(Colorpicker, [{
        key: 'initDOM',
        value: function initDOM() {
            var str = " <div class='canvas1'><div class='circle circle1'></div><div class='canvas1 ver'></div><div class='canvas1 hiz'></div></div><canvas id='colorpicker_canvas2'></canvas><div class='circle circle2'></div><div id='control'><div id='RGBtype'><label class='colorpickerLabel'>R:<input class='testTxt green' type='number' id='displayR' /></label><label class='colorpickerLabel'>G:<input class='testTxt green' type='number' id='displayG' /></label><label class='colorpickerLabel'>B:<input class='testTxt green' type='number' id='displayB' /></label></div><div id='HSLtype'><label class='colorpickerLabel'>H:<input class='testTxt green' type='number' step='0.01' id='displayH' /></label><label class='colorpickerLabel'>S:<input class='testTxt green' type='number' step='0.01' id='displayS' /></label><label class='colorpickerLabel'>L:<input class='testTxt green' type='number' step='0.01' id='displayL' /></label></div></div>";
            this.colorpicker.innerHTML = str;
        }
    }, {
        key: 'initCanvas',
        value: function initCanvas() {
            var gar2 = this.context2.createLinearGradient(0, 0, 0, 400);
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
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this = this;

            var red = this._inputRGB[0].value = 255,
                green = this._inputRGB[1].value = 0,
                blue = this._inputRGB[2].value = 0;
            this._inputRGB[3].value = 0;
            this._inputRGB[4].value = 1;
            this._inputRGB[5].value = 0.5;
            this.canvas1.style.backgroundColor = 'rgb(255,0,0)';
            document.getElementsByClassName('circle1')[0].style.top = -this.colorpicker.offsetTop - 9 + 'px';
            document.getElementsByClassName('circle1')[0].style.left = this.colorpicker.offsetLeft + 400 - 9 + 'px';

            this.canvas2.addEventListener("click", function (e) {
                var c = _this.context2.getImageData(e.clientX - _this.canvas2.offsetLeft, e.clientY - _this.colorpicker.offsetTop, 1, 1).data;
                red = c[0];
                green = c[1];
                blue = c[2];
                document.getElementsByClassName('circle2')[0].style.top = e.clientY - _this.colorpicker.offsetTop - 9 + 'px';
                _this.canvas1.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
                _this.calculateColor(document.getElementsByClassName('circle1')[0].offsetLeft + 9, document.getElementsByClassName('circle1')[0].offsetTop + 9, red, green, blue);
            });

            this.canvas1.addEventListener("click", function (e) {
                var _bgcolor = _this.canvas1.style.backgroundColor,
                    _bgred = parseInt(_bgcolor.slice(4, -1).split(',')[0]),
                    _bggreen = parseInt(_bgcolor.slice(4, -1).split(',')[1]),
                    _bgblue = parseInt(_bgcolor.slice(4, -1).split(',')[2]);
                document.getElementsByClassName('circle1')[0].style.top = e.clientY - _this.colorpicker.offsetTop - 9 + 'px';
                document.getElementsByClassName('circle1')[0].style.left = e.clientX - 9 + 'px';
                _this.calculateColor(e.clientX - _this.colorpicker.offsetLeft, e.clientY - _this.colorpicker.offsetTop, _bgred, _bggreen, _bgblue);
            });
        }
    }, {
        key: 'calculateColor',
        value: function calculateColor(x, y, r, g, b) {
            this._inputRGB[0].value = this.calculateRGB(r, x, y);
            this._inputRGB[1].value = this.calculateRGB(g, x, y);
            this._inputRGB[2].value = this.calculateRGB(b, x, y);
            this.color = 'rgb(' + this.calculateRGB(r, x, y) + ',' + this.calculateRGB(g, x, y) + ',' + this.calculateRGB(b, x, y) + ')';
            this.RGBToHSL(this._inputRGB[0].value, this._inputRGB[1].value, this._inputRGB[2].value);
        }
    }, {
        key: 'calculateRGB',
        value: function calculateRGB(num, x, y) {
            return Math.round((255 - (255 - num) * (x / 400)) * (1 - y / 400));
        }
    }, {
        key: 'generateNewColor',
        value: function generateNewColor() {
            var _this2 = this;

            var _loop = function _loop(i) {
                _this2._inputRGB[i].addEventListener("keyup", function (e) {
                    if (_this2._inputRGB[i].value > 255) {
                        _this2._inputRGB[i].value = 255;
                    }
                    if (_this2._inputRGB[i].value < 0) {
                        _this2._inputRGB[i].value = 0;
                    }
                    _this2.RGBToHSL(_this2._inputRGB[0].value, _this2._inputRGB[1].value, _this2._inputRGB[2].value);
                    _this2.changeColorByInputRGB();
                });
                _this2._inputRGB[i].addEventListener("change", function (e) {
                    if (_this2._inputRGB[i].value > 255) {
                        _this2._inputRGB[i].value = 255;
                    }
                    if (_this2._inputRGB[i].value < 0) {
                        _this2._inputRGB[i].value = 0;
                    }
                    _this2.RGBToHSL(_inputRGB[0].value, _inputRGB[1].value, _inputRGB[2].value);
                    _this2.changeColorByInputRGB();
                });
            };

            for (var i = 0; i < 3; i++) {
                _loop(i);
            }

            var _loop2 = function _loop2(i) {
                _this2._inputRGB[i].addEventListener("keyup", function (e) {
                    if (_this2._inputRGB[i].value > 1) {
                        _this2._inputRGB[i].value = 1;
                    }
                    if (_this2._inputRGB[i].value < 0) {
                        _this2._inputRGB[i].value = 0;
                    }
                    _this2.HSLToRGB(_this2._inputRGB[3].value, _this2._inputRGB[4].value, _this2._inputRGB[5].value);
                    _this2.changeColorByInputRGB();
                });
                _this2._inputRGB[i].addEventListener("change", function (e) {
                    if (_this2._inputRGB[i].value > 1) {
                        _this2._inputRGB[i].value = 1;
                    }
                    if (_this2._inputRGB[i].value < 0) {
                        _this2._inputRGB[i].value = 0;
                    }
                    _this2.HSLToRGB(_this2._inputRGB[3].value, _this2._inputRGB[4].value, _this2._inputRGB[5].value);
                    _this2.changeColorByInputRGB();
                });
            };

            for (var i = 3; i < 6; i++) {
                _loop2(i);
            }
        }
    }, {
        key: 'changeColorByInputRGB',
        value: function changeColorByInputRGB() {
            var R = {
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
            this.color = 'rgb(' + R.value + ',' + G.value + ',' + B.value + ')';
            _array.sort(function (b, a) {
                return a.value - b.value;
            });
            if (_array[0].value == _array[1].value) {
                _array[0].calculate = 255;
                _array[1].calculate = 255;
                _array[2].calculate = 0;
                _canvas1.style.backgroundColor = 'rgb(' + R.calculate + ',' + G.calculate + ',' + B.calculate + ')';
                var y = 400 * (1 - _array[0].value / 255),
                    x = 400 * (1 - _array[2].value / _array[0].value);
                this.canvas1.style.top = y - 9 + 'px';
                this.canvas1.style.left = this.colorpicker.offsetLeft + x - 9 + 'px';
            } else {
                _array[0].calculate = 255;
                _array[2].calculate = 0;
                var _y = 400 * (1 - _array[0].value / 255),
                    _x = 400 * (1 - _array[2].value / _array[0].value);
                _array[1].calculate = 255 - 400 / _x * (255 - 400 * _array[1].value / (400 - _y));
                _canvas1.style.backgroundColor = 'rgb(' + Math.round(R.calculate) + ',' + Math.round(G.calculate) + ',' + Math.round(B.calculate) + ')';
                this.canvas1.style.top = _y - 9 + 'px';
                this.canvas1.style.left = this.colorpicker.offsetLeft + _x - 9 + 'px';
            }
        }
    }, {
        key: 'RGBToHSL',
        value: function RGBToHSL(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h = void 0,
                s = void 0,
                l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
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
    }, {
        key: 'HSLToRGB',
        value: function HSLToRGB(h, s, l) {
            h = parseFloat(h);
            s = parseFloat(s);
            l = parseFloat(l);
            var _r = void 0,
                _g = void 0,
                _b = void 0;
            if (s == 0) {
                _r = _g = _b = l; // achromatic
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                _r = hue2rgb(p, q, h + 1 / 3);
                _g = hue2rgb(p, q, h);
                _b = hue2rgb(p, q, h - 1 / 3);
            }
            this._inputRGB[0].value = Math.round(_r * 255);
            this._inputRGB[1].value = Math.round(_g * 255);
            this._inputRGB[2].value = Math.round(_b * 255);
        }
    }]);

    return Colorpicker;
}();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Drawboard = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colorpicker_es = __webpack_require__(11);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Drawboard = exports.Drawboard = function () {
	function Drawboard(obj) {
		_classCallCheck(this, Drawboard);

		this.initDOM();
		this.canvas = document.getElementById('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas.width = 1000;
		this.canvas.height = 500;
		this.newcolorpicker = new _colorpicker_es.Colorpicker({});
		this.bindEvent();
		this.layer = 0;
	}

	_createClass(Drawboard, [{
		key: 'initDOM',
		value: function initDOM() {
			var str = '<header id="toolbox"><ul class="dowebok"> <li><input type="radio" name="tool" class="labelauty" id="labelauty-42332" value="pen"><label for="labelauty-42332"><span class="labelauty-unchecked-image"></span><span class="labelauty-unchecked">画笔</span><span class="labelauty-checked-image"></span><span class="labelauty-checked">画笔</span></label><select id="penLineWidth"><option value="2">2px</option><option value="4">4px</option><option value="6">6px</option><option value="8">8px</option></select></li><li><input type="radio" name="tool" class="labelauty"  id="labelauty-42333" value="pen"><label for="labelauty-42333"> <span class="labelauty-unchecked-image"></span><span class="labelauty-unchecked">刷子</span><span class="labelauty-checked-image"></span><span class="labelauty-checked">刷子</span></label><select id="brushWidth"><option value="5">5px</option><option value="10">10px</option><option value="15">15px</option><option value="20">20px</option></select></li><li><input type="radio" name="tool" class="labelauty" id="labelauty-42334" value="pengqiang"><label for="labelauty-42334"><span class="labelauty-unchecked-image"></span><span class="labelauty-unchecked">喷枪</span><span class="labelauty-checked-image"></span><span class="labelauty-checked">喷枪</span></label><select id="AirbrushWidth"><option value="10">10px</option><option value="15">15px</option><option value="20">20px</option><option value="30">30px</option></select> </li><div class="btn-group" style="position: absolute;bottom: 0;"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="setbackground">设置背景<span class="caret"></span></button><ul class="dropdown-menu" id="setbackgrounddropdown"> <li><a href="#">white</a></li><li><a href="#">black</a></li><li><a href="#">transparent</a></li><li><a href="#">拾色器前景色</a></li></ul></div><button id="opencolorpicker" class="button button-glow button-rounded button-caution">拾色器</button></ul></header><div id="colorpicker"></div><canvas class="db_canvas" id="canvas"></canvas><canvas class="db_canvas db_add_canvas" id="canvas-bg" height="500" width="1000" style="z-index:-999"></canvas><ul id="layersOption"></ul>';
			document.getElementById('main').innerHTML = str;
		}
	}, {
		key: 'bindEvent',
		value: function bindEvent() {
			var _this = this;

			var tools = document.getElementsByName('tool');

			var _loop = function _loop(i) {
				tools[i].onclick = function () {
					var toolArray = [_this.drawPen.bind(_this), _this.drawBrush.bind(_this), _this.drawAirBrush.bind(_this)];
					toolArray[i]();
				};
			};

			for (var i = 0; i < tools.length; i++) {
				_loop(i);
			}
			document.getElementById('opencolorpicker').onclick = function (e) {
				e.stopPropagation();
				document.getElementById('colorpicker').style.display = 'block';
				document.getElementById('colorpicker').onclick = function (e) {
					e.stopPropagation();
				};
				document.getElementsByTagName('body')[0].onclick = function (e) {
					document.getElementById('colorpicker').style.display = 'none';
				};
			};

			document.getElementById('setbackground').onclick = function (e) {
				var bgcllist = document.getElementById('setbackgrounddropdown').getElementsByTagName('a');

				// debugger;

				var _loop2 = function _loop2(i) {
					bgcllist[i].onclick = function (e) {
						console.log(bgcllist[i].innerHTML);
						_this.changeBgColor(bgcllist[i].innerHTML);
					};
				};

				for (var i = 0; i < bgcllist.length; i++) {
					_loop2(i);
				}
			};
		}
	}, {
		key: 'changeBgColor',
		value: function changeBgColor(colorname) {
			var _new = document.getElementById('canvas-bg');
			var _context = _new.getContext('2d');

			_context.clearRect(0, 0, 1000, 500);
			if (colorname == '取色器前景色') {
				_context.fillStyle = this.newcolorpicker.color;
				_context.fillRect(0, 0, 1000, 500);
			} else if (colorname == 'transparent') {
				var background = new Image();
				background.src = __webpack_require__(17);
				background.onload = function () {
					var pattern = _context.createPattern(background, 'repeat');
					_context.fillStyle = pattern;
					_context.fillRect(0, 0, 1000, 500);
				};
			} else {
				_context.fillStyle = colorname;
				_context.fillRect(0, 0, 1000, 500);
			}
		}
	}, {
		key: 'drawPen',
		value: function drawPen() {
			var _this2 = this;

			var canvasRect = this.canvas.getBoundingClientRect();
			//矩形框的左上角坐标
			var canvasLeft = canvasRect.left;
			var canvasTop = canvasRect.top;
			//画图坐标原点
			var sourceX = 0;
			var sourceY = 0;
			//鼠标点击按下事件，画图准备
			this.canvas.onmousedown = function (e) {
				//设置画笔颜色和宽度
				var color = _this2.newcolorpicker.color;
				var width = document.getElementById('penLineWidth').value;
				//设置原点坐标
				sourceX = e.clientX - canvasLeft;
				sourceY = e.clientY - canvasTop;

				var _new = document.createElement('canvas');
				_new.className = "db_canvas db_add_canvas";
				_new.setAttribute('id', '图层 ' + _this2.layer);
				document.getElementById('main').appendChild(_new);
				_new.width = 1000;
				_new.height = 500;
				_new.style.zIndex = -1;
				var _context = _new.getContext('2d');

				_this2.layer++;
				_this2.canvas.onmousemove = function (e) {

					//当前坐标
					var currX = e.clientX - canvasLeft;
					var currY = e.clientY - canvasTop;
					_context.beginPath();
					_context.moveTo(sourceX, sourceY);
					_context.lineTo(currX, currY);
					_context.strokeStyle = color;
					_context.lineWidth = width;
					_context.stroke();
					//设置原点坐标
					sourceX = currX;
					sourceY = currY;
				};

				_this2.canvas.onmouseup = function (event) {
					if (e.clientX == event.clientX && e.clientY == event.clientY) {
						document.getElementById('main').removeChild(_new);
						_this2.layer--;
					}
					_this2.canvas.onmousemove = null;
					_this2.render(_new);
				};
			};
		}
	}, {
		key: 'drawBrush',
		value: function drawBrush() {
			var _this3 = this;

			var canvasRect = this.canvas.getBoundingClientRect();
			//矩形框的左上角坐标
			var canvasLeft = canvasRect.left;
			var canvasTop = canvasRect.top;
			//画图坐标原点
			var sourceX = 0;
			var sourceY = 0;
			//鼠标点击按下事件，画图准备
			this.canvas.onmousedown = function (e) {
				//设置画笔颜色和宽度
				var color = _this3.newcolorpicker.color;
				var width = document.getElementById('brushWidth').value;
				//设置原点坐标
				sourceX = e.clientX - canvasLeft;
				sourceY = e.clientY - canvasTop;

				var _new = document.createElement('canvas');
				_new.className = "db_canvas db_add_canvas";
				_new.setAttribute('id', '图层 ' + _this3.layer);
				document.getElementById('main').appendChild(_new);
				_new.width = 1000;
				_new.height = 500;
				_new.style.zIndex = -1;
				var _context = _new.getContext('2d');

				_this3.layer++;
				_this3.canvas.onmousemove = function (e) {
					//当前坐标
					var currX = e.clientX - canvasLeft;
					var currY = e.clientY - canvasTop;
					for (var i = 0; i < width; i++) {
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
				_this3.canvas.onmouseup = function (event) {
					if (e.clientX == event.clientX && e.clientY == event.clientY) {
						document.getElementById('main').removeChild(_new);
						_this3.layer--;
					}
					_this3.canvas.onmousemove = null;
					_this3.render(_new);
				};
			};
		}
	}, {
		key: 'drawAirBrush',
		value: function drawAirBrush() {
			var _this4 = this;

			var canvasRect = this.canvas.getBoundingClientRect();
			//矩形框的左上角坐标
			var canvasLeft = canvasRect.left;
			var canvasTop = canvasRect.top;
			//画图坐标原点
			var _sourceX = 0;
			var _sourceY = 0;
			var timer = void 0;
			//鼠标点击按下事件，画图准备
			this.canvas.onmousedown = function (e) {
				//设置画笔颜色和宽度
				_this4.Airbrushwidth = document.getElementById('AirbrushWidth').value;
				//设置原点坐标
				_sourceX = e.clientX - canvasLeft;
				_sourceY = e.clientY - canvasTop;

				var _new = document.createElement('canvas');
				_new.className = "db_canvas db_add_canvas";
				_new.setAttribute('id', '图层 ' + _this4.layer);
				document.getElementById('main').appendChild(_new);
				_new.width = 1000;
				_new.height = 500;
				_new.style.zIndex = -1;
				var _context = _new.getContext('2d');

				_this4.layer++;

				timer = setInterval(function () {
					_this4.drawPoints(_context, _sourceX, _sourceY);
				}, 5);

				_this4.canvas.onmousemove = function (e) {
					//当前坐标
					var currX = e.clientX - canvasLeft;
					var currY = e.clientY - canvasTop;
					window.clearInterval(timer);
					timer = setInterval(function () {
						_this4.drawPoints(_context, currX, currY);
					}, 5);
				};
				_this4.canvas.onmouseup = function (e) {
					_this4.canvas.onmousemove = null;
					window.clearInterval(timer);
					_this4.render(_new);
				};
			};
		}
	}, {
		key: 'drawPoints',
		value: function drawPoints(con, evx, evy) {
			var color = this.newcolorpicker.color;
			var R = this.Airbrushwidth * Math.random();
			var arc = 2 * Math.PI * Math.random();
			var x = R * Math.sin(arc);
			var y = R * Math.cos(arc);
			con.beginPath();
			con.moveTo(evx + x, evy + y);
			con.lineTo(evx + x + 1, evy + y);
			con.strokeStyle = color;
			con.strokeWidth = 1;
			con.stroke();
		}
	}, {
		key: 'render',
		value: function render(dom) {
			var str = '<li><span class="glyphicon glyphicon-remove"></span> <span class="glyphicon glyphicon-eye glyphicon-eye-open"></span>' + dom.id + '</li>';
			document.getElementById('layersOption').innerHTML = str + document.getElementById('layersOption').innerHTML;
			this.initlayersOp();
		}
	}, {
		key: 'initlayersOp',
		value: function initlayersOp() {
			var _this5 = this;

			var _canvaslayers = document.getElementsByClassName('db_add_canvas');
			var _layersDel = document.getElementById('layersOption').getElementsByClassName('glyphicon-remove');
			var _layersEye = document.getElementById('layersOption').getElementsByClassName('glyphicon-eye');
			var _layers = document.getElementById('layersOption').getElementsByTagName('li');

			var _loop3 = function _loop3(i) {
				_layersDel[i].onclick = function (e) {
					document.getElementById('layersOption').removeChild(_layers[i]);
					document.getElementById('main').removeChild(_canvaslayers[_canvaslayers.length - i - 1]);
					_this5.initlayersOp();
				};
			};

			for (var i = 0; i < _layersDel.length; i++) {
				_loop3(i);
			}

			var _loop4 = function _loop4(i) {
				_layersEye[i].onclick = function (e) {
					if (/open/.test(_layersEye[i].className)) {
						_layersEye[i].className = _layersEye[i].className.replace(/open/, 'close');
						_canvaslayers[_canvaslayers.length - i - 1].style.display = 'none';
					} else {
						_layersEye[i].className = _layersEye[i].className.replace(/close/, 'open');
						_canvaslayers[_canvaslayers.length - i - 1].style.display = 'initial';
					}
				};
			};

			for (var i = 0; i < _layersEye.length; i++) {
				_loop4(i);
			}
		}
	}]);

	return Drawboard;
}();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".button {\r\n  top:0;float: right;\r\n  width: 120px;\r\n  color: #666;\r\n  background-color: #EEE;\r\n  border-color: #EEE;\r\n  font-weight: 300;\r\n  font-size: 16px;\r\n  font-family: \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif;\r\n  text-decoration: none;\r\n  text-align: center;\r\n  line-height: 40px;\r\n  height: 40px;\r\n  margin: 0;\r\n  display: inline-block;\r\n  appearance: none;\r\n  cursor: pointer;\r\n  border: none;\r\n  -webkit-box-sizing: border-box;\r\n     -moz-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n  -webkit-transition-property: all;\r\n          transition-property: all;\r\n  -webkit-transition-duration: .3s;\r\n          transition-duration: .3s;\r\n  /*\r\n  * Disabled State\r\n  *\r\n  * The disabled state uses the class .disabled, is-disabled,\r\n  * and the form attribute disabled=\"disabled\".\r\n  * The use of !important is only added because this is a state\r\n  * that must be applied to all buttons when in a disabled state.\r\n  */ }\r\n  .button:visited {\r\n    color: #666; }\r\n  .button:hover, .button:focus {\r\n    background-color: #f6f6f6;\r\n    text-decoration: none;\r\n    outline: none; }\r\n  .button:active, .button.active, .button.is-active {\r\n    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);\r\n    text-decoration: none;\r\n    background-color: #eeeeee;\r\n    border-color: #cfcfcf;\r\n    color: #d4d4d4;\r\n    -webkit-transition-duration: 0s;\r\n            transition-duration: 0s;\r\n    -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);\r\n            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2); }\r\n  .button.disabled, .button.is-disabled, .button:disabled {\r\n    top: 0 !important;\r\n    background: #EEE !important;\r\n    border: 1px solid #DDD !important;\r\n    text-shadow: 0 1px 1px white !important;\r\n    color: #CCC !important;\r\n    cursor: default !important;\r\n    appearance: none !important;\r\n    -webkit-box-shadow: none !important;\r\n            box-shadow: none !important;\r\n    opacity: .8 !important; }\r\n\r\n/*\r\n* Base Button Tyography\r\n*\r\n*/\r\n.button-uppercase {\r\n  text-transform: uppercase; }\r\n\r\n.button-lowercase {\r\n  text-transform: lowercase; }\r\n\r\n.button-capitalize {\r\n  text-transform: capitalize; }\r\n\r\n.button-small-caps {\r\n  font-variant: small-caps; }\r\n\r\n.button-icon-txt-large {\r\n  font-size: 36px !important; }\r\n\r\n/*\r\n* Base padding\r\n*\r\n*/\r\n.button-width-small {\r\n  padding: 0 10px !important; }\r\n\r\n/*\r\n* Base Colors\r\n*\r\n* Create colors for buttons\r\n* (.button-primary, .button-secondary, etc.)\r\n*/\r\n.button-primary,\r\n.button-primary-flat {\r\n  background-color: #1B9AF7;\r\n  border-color: #1B9AF7;\r\n  color: #FFF; }\r\n  .button-primary:visited,\r\n  .button-primary-flat:visited {\r\n    color: #FFF; }\r\n  .button-primary:hover, .button-primary:focus,\r\n  .button-primary-flat:hover,\r\n  .button-primary-flat:focus {\r\n    background-color: #4cb0f9;\r\n    border-color: #4cb0f9;\r\n    color: #FFF; }\r\n  .button-primary:active, .button-primary.active, .button-primary.is-active,\r\n  .button-primary-flat:active,\r\n  .button-primary-flat.active,\r\n  .button-primary-flat.is-active {\r\n    background-color: #2798eb;\r\n    border-color: #2798eb;\r\n    color: #0880d7; }\r\n\r\n.button-plain,\r\n.button-plain-flat {\r\n  background-color: #FFF;\r\n  border-color: #FFF;\r\n  color: #1B9AF7; }\r\n  .button-plain:visited,\r\n  .button-plain-flat:visited {\r\n    color: #1B9AF7; }\r\n  .button-plain:hover, .button-plain:focus,\r\n  .button-plain-flat:hover,\r\n  .button-plain-flat:focus {\r\n    background-color: white;\r\n    border-color: white;\r\n    color: #1B9AF7; }\r\n  .button-plain:active, .button-plain.active, .button-plain.is-active,\r\n  .button-plain-flat:active,\r\n  .button-plain-flat.active,\r\n  .button-plain-flat.is-active {\r\n    background-color: white;\r\n    border-color: white;\r\n    color: #e6e6e6; }\r\n\r\n.button-inverse,\r\n.button-inverse-flat {\r\n  background-color: #222;\r\n  border-color: #222;\r\n  color: #EEE; }\r\n  .button-inverse:visited,\r\n  .button-inverse-flat:visited {\r\n    color: #EEE; }\r\n  .button-inverse:hover, .button-inverse:focus,\r\n  .button-inverse-flat:hover,\r\n  .button-inverse-flat:focus {\r\n    background-color: #3c3c3c;\r\n    border-color: #3c3c3c;\r\n    color: #EEE; }\r\n  .button-inverse:active, .button-inverse.active, .button-inverse.is-active,\r\n  .button-inverse-flat:active,\r\n  .button-inverse-flat.active,\r\n  .button-inverse-flat.is-active {\r\n    background-color: #222222;\r\n    border-color: #222222;\r\n    color: #090909; }\r\n\r\n.button-action,\r\n.button-action-flat {\r\n  background-color: #A5DE37;\r\n  border-color: #A5DE37;\r\n  color: #FFF; }\r\n  .button-action:visited,\r\n  .button-action-flat:visited {\r\n    color: #FFF; }\r\n  .button-action:hover, .button-action:focus,\r\n  .button-action-flat:hover,\r\n  .button-action-flat:focus {\r\n    background-color: #b9e563;\r\n    border-color: #b9e563;\r\n    color: #FFF; }\r\n  .button-action:active, .button-action.active, .button-action.is-active,\r\n  .button-action-flat:active,\r\n  .button-action-flat.active,\r\n  .button-action-flat.is-active {\r\n    background-color: #a1d243;\r\n    border-color: #a1d243;\r\n    color: #8bc220; }\r\n\r\n.button-highlight,\r\n.button-highlight-flat {\r\n  background-color: #FEAE1B;\r\n  border-color: #FEAE1B;\r\n  color: #FFF; }\r\n  .button-highlight:visited,\r\n  .button-highlight-flat:visited {\r\n    color: #FFF; }\r\n  .button-highlight:hover, .button-highlight:focus,\r\n  .button-highlight-flat:hover,\r\n  .button-highlight-flat:focus {\r\n    background-color: #fec04e;\r\n    border-color: #fec04e;\r\n    color: #FFF; }\r\n  .button-highlight:active, .button-highlight.active, .button-highlight.is-active,\r\n  .button-highlight-flat:active,\r\n  .button-highlight-flat.active,\r\n  .button-highlight-flat.is-active {\r\n    background-color: #f3ab26;\r\n    border-color: #f3ab26;\r\n    color: #e59501; }\r\n\r\n.button-caution,\r\n.button-caution-flat {\r\n  background-color: #FF4351;\r\n  border-color: #FF4351;\r\n  color: #FFF; }\r\n  .button-caution:visited,\r\n  .button-caution-flat:visited {\r\n    color: #FFF; }\r\n  .button-caution:hover, .button-caution:focus,\r\n  .button-caution-flat:hover,\r\n  .button-caution-flat:focus {\r\n    background-color: #ff7680;\r\n    border-color: #ff7680;\r\n    color: #FFF; }\r\n  .button-caution:active, .button-caution.active, .button-caution.is-active,\r\n  .button-caution-flat:active,\r\n  .button-caution-flat.active,\r\n  .button-caution-flat.is-active {\r\n    background-color: #f64c59;\r\n    border-color: #f64c59;\r\n    color: #ff1022; }\r\n\r\n.button-royal,\r\n.button-royal-flat {\r\n  background-color: #7B72E9;\r\n  border-color: #7B72E9;\r\n  color: #FFF; }\r\n  .button-royal:visited,\r\n  .button-royal-flat:visited {\r\n    color: #FFF; }\r\n  .button-royal:hover, .button-royal:focus,\r\n  .button-royal-flat:hover,\r\n  .button-royal-flat:focus {\r\n    background-color: #a49ef0;\r\n    border-color: #a49ef0;\r\n    color: #FFF; }\r\n  .button-royal:active, .button-royal.active, .button-royal.is-active,\r\n  .button-royal-flat:active,\r\n  .button-royal-flat.active,\r\n  .button-royal-flat.is-active {\r\n    background-color: #827ae1;\r\n    border-color: #827ae1;\r\n    color: #5246e2; }\r\n\r\n/*\r\n* Base Layout Styles\r\n*\r\n* Very Miminal Layout Styles\r\n*/\r\n.button-block,\r\n.button-stacked {\r\n  display: block; }\r\n\r\n/*\r\n* Button Types (optional)\r\n*\r\n* All of the files below represent the various button\r\n* types (including shapes & sizes). None of these files\r\n* are required. Simple remove the uneeded type below and\r\n* the button type will be excluded from the final build\r\n*/\r\n/*\r\n* Button Shapes\r\n*\r\n* This file creates the various button shapes\r\n* (ex. Circle, Rounded, Pill)\r\n*/\r\n.button-square {\r\n  border-radius: 0; }\r\n\r\n.button-box {\r\n  border-radius: 10px; }\r\n\r\n.button-rounded {\r\n  border-radius: 4px; }\r\n\r\n.button-pill {\r\n  border-radius: 200px; }\r\n\r\n.button-circle {\r\n  border-radius: 100%; }\r\n\r\n/*\r\n* Size Adjustment for equal height & widht buttons\r\n*\r\n* Remove padding and set a fixed width.\r\n*/\r\n.button-circle,\r\n.button-box,\r\n.button-square {\r\n  padding: 0 !important;\r\n  width: 40px; }\r\n  .button-circle.button-giant,\r\n  .button-box.button-giant,\r\n  .button-square.button-giant {\r\n    width: 70px; }\r\n  .button-circle.button-jumbo,\r\n  .button-box.button-jumbo,\r\n  .button-square.button-jumbo {\r\n    width: 60px; }\r\n  .button-circle.button-large,\r\n  .button-box.button-large,\r\n  .button-square.button-large {\r\n    width: 50px; }\r\n  .button-circle.button-normal,\r\n  .button-box.button-normal,\r\n  .button-square.button-normal {\r\n    width: 40px; }\r\n  .button-circle.button-small,\r\n  .button-box.button-small,\r\n  .button-square.button-small {\r\n    width: 30px; }\r\n  .button-circle.button-tiny,\r\n  .button-box.button-tiny,\r\n  .button-square.button-tiny {\r\n    width: 24px; }\r\n\r\n/*\r\n* Border Buttons\r\n*\r\n* These buttons have no fill they only have a\r\n* border to define their hit target.\r\n*/\r\n.button-border, .button-border-thin, .button-border-thick {\r\n  background: none;\r\n  border-width: 2px;\r\n  border-style: solid;\r\n  line-height: 36px; }\r\n  .button-border:hover, .button-border-thin:hover, .button-border-thick:hover {\r\n    background-color: rgba(255, 255, 255, 0.9); }\r\n  .button-border:active, .button-border-thin:active, .button-border-thick:active, .button-border.active, .active.button-border-thin, .active.button-border-thick, .button-border.is-active, .is-active.button-border-thin, .is-active.button-border-thick {\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n    text-shadow: none;\r\n    -webkit-transition-property: all;\r\n            transition-property: all;\r\n    -webkit-transition-duration: .3s;\r\n            transition-duration: .3s; }\r\n\r\n/*\r\n* Border Optional Sizes\r\n*\r\n* A slight variation in border thickness\r\n*/\r\n.button-border-thin {\r\n  border-width: 1px; }\r\n\r\n.button-border-thick {\r\n  border-width: 3px; }\r\n\r\n/*\r\n* Border Button Colors\r\n*\r\n* Create colors for buttons\r\n* (.button-primary, .button-secondary, etc.)\r\n*/\r\n.button-border, .button-border-thin, .button-border-thick,\r\n.button-border-thin,\r\n.button-border-thick {\r\n  /*\r\n  * Border Button Size Adjustment\r\n  *\r\n  * The line-height must be adjusted to compinsate for\r\n  * the width of the border.\r\n  */ }\r\n  .button-border.button-primary, .button-primary.button-border-thin, .button-primary.button-border-thick,\r\n  .button-border-thin.button-primary,\r\n  .button-border-thick.button-primary {\r\n    color: #1B9AF7; }\r\n    .button-border.button-primary:hover, .button-primary.button-border-thin:hover, .button-primary.button-border-thick:hover, .button-border.button-primary:focus, .button-primary.button-border-thin:focus, .button-primary.button-border-thick:focus,\r\n    .button-border-thin.button-primary:hover,\r\n    .button-border-thin.button-primary:focus,\r\n    .button-border-thick.button-primary:hover,\r\n    .button-border-thick.button-primary:focus {\r\n      background-color: rgba(76, 176, 249, 0.9);\r\n      color: rgba(255, 255, 255, 0.9); }\r\n    .button-border.button-primary:active, .button-primary.button-border-thin:active, .button-primary.button-border-thick:active, .button-border.button-primary.active, .button-primary.active.button-border-thin, .button-primary.active.button-border-thick, .button-border.button-primary.is-active, .button-primary.is-active.button-border-thin, .button-primary.is-active.button-border-thick,\r\n    .button-border-thin.button-primary:active,\r\n    .button-border-thin.button-primary.active,\r\n    .button-border-thin.button-primary.is-active,\r\n    .button-border-thick.button-primary:active,\r\n    .button-border-thick.button-primary.active,\r\n    .button-border-thick.button-primary.is-active {\r\n      background-color: rgba(39, 152, 235, 0.7);\r\n      color: rgba(255, 255, 255, 0.5);\r\n      opacity: .3; }\r\n  .button-border.button-plain, .button-plain.button-border-thin, .button-plain.button-border-thick,\r\n  .button-border-thin.button-plain,\r\n  .button-border-thick.button-plain {\r\n    color: #FFF; }\r\n    .button-border.button-plain:hover, .button-plain.button-border-thin:hover, .button-plain.button-border-thick:hover, .button-border.button-plain:focus, .button-plain.button-border-thin:focus, .button-plain.button-border-thick:focus,\r\n    .button-border-thin.button-plain:hover,\r\n    .button-border-thin.button-plain:focus,\r\n    .button-border-thick.button-plain:hover,\r\n    .button-border-thick.button-plain:focus {\r\n      background-color: rgba(255, 255, 255, 0.9);\r\n      color: rgba(27, 154, 247, 0.9); }\r\n    .button-border.button-plain:active, .button-plain.button-border-thin:active, .button-plain.button-border-thick:active, .button-border.button-plain.active, .button-plain.active.button-border-thin, .button-plain.active.button-border-thick, .button-border.button-plain.is-active, .button-plain.is-active.button-border-thin, .button-plain.is-active.button-border-thick,\r\n    .button-border-thin.button-plain:active,\r\n    .button-border-thin.button-plain.active,\r\n    .button-border-thin.button-plain.is-active,\r\n    .button-border-thick.button-plain:active,\r\n    .button-border-thick.button-plain.active,\r\n    .button-border-thick.button-plain.is-active {\r\n      background-color: rgba(255, 255, 255, 0.7);\r\n      color: rgba(27, 154, 247, 0.5);\r\n      opacity: .3; }\r\n  .button-border.button-inverse, .button-inverse.button-border-thin, .button-inverse.button-border-thick,\r\n  .button-border-thin.button-inverse,\r\n  .button-border-thick.button-inverse {\r\n    color: #222; }\r\n    .button-border.button-inverse:hover, .button-inverse.button-border-thin:hover, .button-inverse.button-border-thick:hover, .button-border.button-inverse:focus, .button-inverse.button-border-thin:focus, .button-inverse.button-border-thick:focus,\r\n    .button-border-thin.button-inverse:hover,\r\n    .button-border-thin.button-inverse:focus,\r\n    .button-border-thick.button-inverse:hover,\r\n    .button-border-thick.button-inverse:focus {\r\n      background-color: rgba(60, 60, 60, 0.9);\r\n      color: rgba(238, 238, 238, 0.9); }\r\n    .button-border.button-inverse:active, .button-inverse.button-border-thin:active, .button-inverse.button-border-thick:active, .button-border.button-inverse.active, .button-inverse.active.button-border-thin, .button-inverse.active.button-border-thick, .button-border.button-inverse.is-active, .button-inverse.is-active.button-border-thin, .button-inverse.is-active.button-border-thick,\r\n    .button-border-thin.button-inverse:active,\r\n    .button-border-thin.button-inverse.active,\r\n    .button-border-thin.button-inverse.is-active,\r\n    .button-border-thick.button-inverse:active,\r\n    .button-border-thick.button-inverse.active,\r\n    .button-border-thick.button-inverse.is-active {\r\n      background-color: rgba(34, 34, 34, 0.7);\r\n      color: rgba(238, 238, 238, 0.5);\r\n      opacity: .3; }\r\n  .button-border.button-action, .button-action.button-border-thin, .button-action.button-border-thick,\r\n  .button-border-thin.button-action,\r\n  .button-border-thick.button-action {\r\n    color: #A5DE37; }\r\n    .button-border.button-action:hover, .button-action.button-border-thin:hover, .button-action.button-border-thick:hover, .button-border.button-action:focus, .button-action.button-border-thin:focus, .button-action.button-border-thick:focus,\r\n    .button-border-thin.button-action:hover,\r\n    .button-border-thin.button-action:focus,\r\n    .button-border-thick.button-action:hover,\r\n    .button-border-thick.button-action:focus {\r\n      background-color: rgba(185, 229, 99, 0.9);\r\n      color: rgba(255, 255, 255, 0.9); }\r\n    .button-border.button-action:active, .button-action.button-border-thin:active, .button-action.button-border-thick:active, .button-border.button-action.active, .button-action.active.button-border-thin, .button-action.active.button-border-thick, .button-border.button-action.is-active, .button-action.is-active.button-border-thin, .button-action.is-active.button-border-thick,\r\n    .button-border-thin.button-action:active,\r\n    .button-border-thin.button-action.active,\r\n    .button-border-thin.button-action.is-active,\r\n    .button-border-thick.button-action:active,\r\n    .button-border-thick.button-action.active,\r\n    .button-border-thick.button-action.is-active {\r\n      background-color: rgba(161, 210, 67, 0.7);\r\n      color: rgba(255, 255, 255, 0.5);\r\n      opacity: .3; }\r\n  .button-border.button-highlight, .button-highlight.button-border-thin, .button-highlight.button-border-thick,\r\n  .button-border-thin.button-highlight,\r\n  .button-border-thick.button-highlight {\r\n    color: #FEAE1B; }\r\n    .button-border.button-highlight:hover, .button-highlight.button-border-thin:hover, .button-highlight.button-border-thick:hover, .button-border.button-highlight:focus, .button-highlight.button-border-thin:focus, .button-highlight.button-border-thick:focus,\r\n    .button-border-thin.button-highlight:hover,\r\n    .button-border-thin.button-highlight:focus,\r\n    .button-border-thick.button-highlight:hover,\r\n    .button-border-thick.button-highlight:focus {\r\n      background-color: rgba(254, 192, 78, 0.9);\r\n      color: rgba(255, 255, 255, 0.9); }\r\n    .button-border.button-highlight:active, .button-highlight.button-border-thin:active, .button-highlight.button-border-thick:active, .button-border.button-highlight.active, .button-highlight.active.button-border-thin, .button-highlight.active.button-border-thick, .button-border.button-highlight.is-active, .button-highlight.is-active.button-border-thin, .button-highlight.is-active.button-border-thick,\r\n    .button-border-thin.button-highlight:active,\r\n    .button-border-thin.button-highlight.active,\r\n    .button-border-thin.button-highlight.is-active,\r\n    .button-border-thick.button-highlight:active,\r\n    .button-border-thick.button-highlight.active,\r\n    .button-border-thick.button-highlight.is-active {\r\n      background-color: rgba(243, 171, 38, 0.7);\r\n      color: rgba(255, 255, 255, 0.5);\r\n      opacity: .3; }\r\n  .button-border.button-caution, .button-caution.button-border-thin, .button-caution.button-border-thick,\r\n  .button-border-thin.button-caution,\r\n  .button-border-thick.button-caution {\r\n    color: #FF4351; }\r\n    .button-border.button-caution:hover, .button-caution.button-border-thin:hover, .button-caution.button-border-thick:hover, .button-border.button-caution:focus, .button-caution.button-border-thin:focus, .button-caution.button-border-thick:focus,\r\n    .button-border-thin.button-caution:hover,\r\n    .button-border-thin.button-caution:focus,\r\n    .button-border-thick.button-caution:hover,\r\n    .button-border-thick.button-caution:focus {\r\n      background-color: rgba(255, 118, 128, 0.9);\r\n      color: rgba(255, 255, 255, 0.9); }\r\n    .button-border.button-caution:active, .button-caution.button-border-thin:active, .button-caution.button-border-thick:active, .button-border.button-caution.active, .button-caution.active.button-border-thin, .button-caution.active.button-border-thick, .button-border.button-caution.is-active, .button-caution.is-active.button-border-thin, .button-caution.is-active.button-border-thick,\r\n    .button-border-thin.button-caution:active,\r\n    .button-border-thin.button-caution.active,\r\n    .button-border-thin.button-caution.is-active,\r\n    .button-border-thick.button-caution:active,\r\n    .button-border-thick.button-caution.active,\r\n    .button-border-thick.button-caution.is-active {\r\n      background-color: rgba(246, 76, 89, 0.7);\r\n      color: rgba(255, 255, 255, 0.5);\r\n      opacity: .3; }\r\n  .button-border.button-royal, .button-royal.button-border-thin, .button-royal.button-border-thick,\r\n  .button-border-thin.button-royal,\r\n  .button-border-thick.button-royal {\r\n    color: #7B72E9; }\r\n    .button-border.button-royal:hover, .button-royal.button-border-thin:hover, .button-royal.button-border-thick:hover, .button-border.button-royal:focus, .button-royal.button-border-thin:focus, .button-royal.button-border-thick:focus,\r\n    .button-border-thin.button-royal:hover,\r\n    .button-border-thin.button-royal:focus,\r\n    .button-border-thick.button-royal:hover,\r\n    .button-border-thick.button-royal:focus {\r\n      background-color: rgba(164, 158, 240, 0.9);\r\n      color: rgba(255, 255, 255, 0.9); }\r\n    .button-border.button-royal:active, .button-royal.button-border-thin:active, .button-royal.button-border-thick:active, .button-border.button-royal.active, .button-royal.active.button-border-thin, .button-royal.active.button-border-thick, .button-border.button-royal.is-active, .button-royal.is-active.button-border-thin, .button-royal.is-active.button-border-thick,\r\n    .button-border-thin.button-royal:active,\r\n    .button-border-thin.button-royal.active,\r\n    .button-border-thin.button-royal.is-active,\r\n    .button-border-thick.button-royal:active,\r\n    .button-border-thick.button-royal.active,\r\n    .button-border-thick.button-royal.is-active {\r\n      background-color: rgba(130, 122, 225, 0.7);\r\n      color: rgba(255, 255, 255, 0.5);\r\n      opacity: .3; }\r\n  .button-border.button-giant, .button-giant.button-border-thin, .button-giant.button-border-thick,\r\n  .button-border-thin.button-giant,\r\n  .button-border-thick.button-giant {\r\n    line-height: 66px; }\r\n  .button-border.button-jumbo, .button-jumbo.button-border-thin, .button-jumbo.button-border-thick,\r\n  .button-border-thin.button-jumbo,\r\n  .button-border-thick.button-jumbo {\r\n    line-height: 56px; }\r\n  .button-border.button-large, .button-large.button-border-thin, .button-large.button-border-thick,\r\n  .button-border-thin.button-large,\r\n  .button-border-thick.button-large {\r\n    line-height: 46px; }\r\n  .button-border.button-normal, .button-normal.button-border-thin, .button-normal.button-border-thick,\r\n  .button-border-thin.button-normal,\r\n  .button-border-thick.button-normal {\r\n    line-height: 36px; }\r\n  .button-border.button-small, .button-small.button-border-thin, .button-small.button-border-thick,\r\n  .button-border-thin.button-small,\r\n  .button-border-thick.button-small {\r\n    line-height: 26px; }\r\n  .button-border.button-tiny, .button-tiny.button-border-thin, .button-tiny.button-border-thick,\r\n  .button-border-thin.button-tiny,\r\n  .button-border-thick.button-tiny {\r\n    line-height: 20px; }\r\n\r\n/*\r\n* Border Buttons\r\n*\r\n* These buttons have no fill they only have a\r\n* border to define their hit target.\r\n*/\r\n.button-borderless {\r\n  background: none;\r\n  border: none;\r\n  padding: 0 8px !important;\r\n  color: #EEE;\r\n  font-size: 20.8px;\r\n  font-weight: 200;\r\n  /*\r\n  * Borderless Button Colors\r\n  *\r\n  * Create colors for buttons\r\n  * (.button-primary, .button-secondary, etc.)\r\n  */\r\n  /*\r\n  * Borderles Size Adjustment\r\n  *\r\n  * The font-size must be large to compinsate for\r\n  * the lack of a hit target.\r\n  */ }\r\n  .button-borderless:hover, .button-borderless:focus {\r\n    background: none; }\r\n  .button-borderless:active, .button-borderless.active, .button-borderless.is-active {\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n    text-shadow: none;\r\n    -webkit-transition-property: all;\r\n            transition-property: all;\r\n    -webkit-transition-duration: .3s;\r\n            transition-duration: .3s;\r\n    opacity: .3; }\r\n  .button-borderless.button-primary {\r\n    color: #1B9AF7; }\r\n  .button-borderless.button-plain {\r\n    color: #FFF; }\r\n  .button-borderless.button-inverse {\r\n    color: #222; }\r\n  .button-borderless.button-action {\r\n    color: #A5DE37; }\r\n  .button-borderless.button-highlight {\r\n    color: #FEAE1B; }\r\n  .button-borderless.button-caution {\r\n    color: #FF4351; }\r\n  .button-borderless.button-royal {\r\n    color: #7B72E9; }\r\n  .button-borderless.button-giant {\r\n    font-size: 36.4px;\r\n    height: 52.4px;\r\n    line-height: 52.4px; }\r\n  .button-borderless.button-jumbo {\r\n    font-size: 31.2px;\r\n    height: 47.2px;\r\n    line-height: 47.2px; }\r\n  .button-borderless.button-large {\r\n    font-size: 26px;\r\n    height: 42px;\r\n    line-height: 42px; }\r\n  .button-borderless.button-normal {\r\n    font-size: 20.8px;\r\n    height: 36.8px;\r\n    line-height: 36.8px; }\r\n  .button-borderless.button-small {\r\n    font-size: 15.6px;\r\n    height: 31.6px;\r\n    line-height: 31.6px; }\r\n  .button-borderless.button-tiny {\r\n    font-size: 12.48px;\r\n    height: 28.48px;\r\n    line-height: 28.48px; }\r\n\r\n/*\r\n* Raised Buttons\r\n*\r\n* A classic looking button that offers\r\n* great depth and affordance.\r\n*/\r\n.button-raised {\r\n  border-color: #e1e1e1;\r\n  border-style: solid;\r\n  border-width: 1px;\r\n  line-height: 38px;\r\n  background: -webkit-gradient(linear, left top, left bottom, from(#f6f6f6), to(#e1e1e1));\r\n  background: linear-gradient(#f6f6f6, #e1e1e1);\r\n  -webkit-box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15);\r\n          box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15); }\r\n  .button-raised:hover, .button-raised:focus {\r\n    background: -webkit-gradient(linear, left top, left bottom, from(white), to(gainsboro));\r\n    background: linear-gradient(top, white, gainsboro); }\r\n  .button-raised:active, .button-raised.active, .button-raised.is-active {\r\n    background: #eeeeee;\r\n    -webkit-box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 0px white;\r\n            box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 0px white; }\r\n\r\n/*\r\n* Raised Button Colors\r\n*\r\n* Create colors for raised buttons\r\n*/\r\n.button-raised.button-primary {\r\n  border-color: #088ef0;\r\n  background: -webkit-gradient(linear, left top, left bottom, from(#34a5f8), to(#088ef0));\r\n  background: linear-gradient(#34a5f8, #088ef0); }\r\n  .button-raised.button-primary:hover, .button-raised.button-primary:focus {\r\n    background: -webkit-gradient(linear, left top, left bottom, from(#42abf8), to(#0888e6));\r\n    background: linear-gradient(top, #42abf8, #0888e6); }\r\n  .button-raised.button-primary:active, .button-raised.button-primary.active, .button-raised.button-primary.is-active {\r\n    border-color: #0880d7;\r\n    background: #2798eb; }\r\n.button-raised.button-plain {\r\n  border-color: #f2f2f2;\r\n  background: -webkit-gradient(linear, left top, left bottom, from(white), to(#f2f2f2));\r\n  background: linear-gradient(white, #f2f2f2); }\r\n  .button-raised.button-plain:hover, .button-raised.button-plain:focus {\r\n    background: -webkit-gradient(linear, left top, left bottom, from(white), to(#ededed));\r\n    background: linear-gradient(top, white, #ededed); }\r\n  .button-raised.button-plain:active, .button-raised.button-plain.active, .button-raised.button-plain.is-active {\r\n    border-color: #e6e6e6;\r\n    background: white; }\r\n.button-raised.button-inverse {\r\n  border-color: #151515;\r\n  background: -webkit-gradient(linear, left top, left bottom, from(#2f2f2f), to(#151515));\r\n  background: linear-gradient(#2f2f2f, #151515); }\r\n  .button-raised.button-inverse:hover, .button-raised.button-inverse:focus {\r\n    background: -webkit-gradient(linear, left top, left bottom, from(#363636), to(#101010));\r\n    background: linear-gradient(top, #363636, #101010); }\r\n  .button-raised.button-inverse:active, .button-raised.button-inverse.active, .button-raised.button-inverse.is-active {\r\n    border-color: #090909;\r\n    background: #222222; }\r\n.button-raised.button-action {\r\n  border-color: #9ad824;\r\n  background: -webkit-gradient(linear, left top, left bottom, from(#afe24d), to(#9ad824));\r\n  background: linear-gradient(#afe24d, #9ad824); }\r\n  .button-raised.button-action:hover, .button-raised.button-action:focus {\r\n    background: -webkit-gradient(linear, left top, left bottom, from(#b5e45a), to(#94cf22));\r\n    background: linear-gradient(top, #b5e45a, #94cf22); }\r\n  .button-raised.button-action:active, .button-raised.button-action.active, .button-raised.button-action.is-active {\r\n    border-color: #8bc220;\r\n    background: #a1d243; }\r\n.button-raised.button-highlight {\r\n  border-color: #fea502;\r\n  background: -webkit-gradient(linear, left top, left bottom, from(#feb734), to(#fea502));\r\n  background: linear-gradient(#feb734, #fea502); }\r\n  .button-raised.button-highlight:hover, .button-raised.button-highlight:focus {\r\n    background: -webkit-gradient(linear, left top, left bottom, from(#febc44), to(#f49f01));\r\n    background: linear-gradient(top, #febc44, #f49f01); }\r\n  .button-raised.button-highlight:active, .button-raised.button-highlight.active, .button-raised.button-highlight.is-active {\r\n    border-color: #e59501;\r\n    background: #f3ab26; }\r\n.button-raised.button-caution {\r\n  border-color: #ff2939;\r\n  background: -webkit-gradient(linear, left top, left bottom, from(#ff5c69), to(#ff2939));\r\n  background: linear-gradient(#ff5c69, #ff2939); }\r\n  .button-raised.button-caution:hover, .button-raised.button-caution:focus {\r\n    background: -webkit-gradient(linear, left top, left bottom, from(#ff6c77), to(#ff1f30));\r\n    background: linear-gradient(top, #ff6c77, #ff1f30); }\r\n  .button-raised.button-caution:active, .button-raised.button-caution.active, .button-raised.button-caution.is-active {\r\n    border-color: #ff1022;\r\n    background: #f64c59; }\r\n.button-raised.button-royal {\r\n  border-color: #665ce6;\r\n  background: -webkit-gradient(linear, left top, left bottom, from(#9088ec), to(#665ce6));\r\n  background: linear-gradient(#9088ec, #665ce6); }\r\n  .button-raised.button-royal:hover, .button-raised.button-royal:focus {\r\n    background: -webkit-gradient(linear, left top, left bottom, from(#9c95ef), to(#5e53e4));\r\n    background: linear-gradient(top, #9c95ef, #5e53e4); }\r\n  .button-raised.button-royal:active, .button-raised.button-royal.active, .button-raised.button-royal.is-active {\r\n    border-color: #5246e2;\r\n    background: #827ae1; }\r\n\r\n/*\r\n* 3D Buttons\r\n*\r\n* These buttons have a heavy three dimensional\r\n* style that mimics the visual appearance of a\r\n* real life button.\r\n*/\r\n.button-3d {\r\n  position: relative;\r\n  top: 0;\r\n  -webkit-box-shadow: 0 7px 0 #bbbbbb, 0 8px 3px rgba(0, 0, 0, 0.2);\r\n          box-shadow: 0 7px 0 #bbbbbb, 0 8px 3px rgba(0, 0, 0, 0.2); }\r\n  .button-3d:hover, .button-3d:focus {\r\n    -webkit-box-shadow: 0 7px 0 #bbbbbb, 0 8px 3px rgba(0, 0, 0, 0.2);\r\n            box-shadow: 0 7px 0 #bbbbbb, 0 8px 3px rgba(0, 0, 0, 0.2); }\r\n  .button-3d:active, .button-3d.active, .button-3d.is-active {\r\n    top: 5px;\r\n    -webkit-transition-property: all;\r\n            transition-property: all;\r\n    -webkit-transition-duration: .15s;\r\n            transition-duration: .15s;\r\n    -webkit-box-shadow: 0 2px 0 #bbbbbb, 0 3px 3px rgba(0, 0, 0, 0.2);\r\n            box-shadow: 0 2px 0 #bbbbbb, 0 3px 3px rgba(0, 0, 0, 0.2); }\r\n\r\n/*\r\n* 3D Button Colors\r\n*\r\n* Create colors for buttons\r\n* (.button-primary, .button-secondary, etc.)\r\n*/\r\n.button-3d.button-primary {\r\n  -webkit-box-shadow: 0 7px 0 #0880d7, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n          box-shadow: 0 7px 0 #0880d7, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-primary:hover, .button-3d.button-primary:focus {\r\n    -webkit-box-shadow: 0 7px 0 #077ace, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n            box-shadow: 0 7px 0 #077ace, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-primary:active, .button-3d.button-primary.active, .button-3d.button-primary.is-active {\r\n    -webkit-box-shadow: 0 2px 0 #0662a6, 0 3px 3px rgba(0, 0, 0, 0.2);\r\n            box-shadow: 0 2px 0 #0662a6, 0 3px 3px rgba(0, 0, 0, 0.2); }\r\n.button-3d.button-plain {\r\n  -webkit-box-shadow: 0 7px 0 #e6e6e6, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n          box-shadow: 0 7px 0 #e6e6e6, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-plain:hover, .button-3d.button-plain:focus {\r\n    -webkit-box-shadow: 0 7px 0 #e0e0e0, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n            box-shadow: 0 7px 0 #e0e0e0, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-plain:active, .button-3d.button-plain.active, .button-3d.button-plain.is-active {\r\n    -webkit-box-shadow: 0 2px 0 #cccccc, 0 3px 3px rgba(0, 0, 0, 0.2);\r\n            box-shadow: 0 2px 0 #cccccc, 0 3px 3px rgba(0, 0, 0, 0.2); }\r\n.button-3d.button-inverse {\r\n  -webkit-box-shadow: 0 7px 0 #090909, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n          box-shadow: 0 7px 0 #090909, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-inverse:hover, .button-3d.button-inverse:focus {\r\n    -webkit-box-shadow: 0 7px 0 #030303, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n            box-shadow: 0 7px 0 #030303, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-inverse:active, .button-3d.button-inverse.active, .button-3d.button-inverse.is-active {\r\n    -webkit-box-shadow: 0 2px 0 black, 0 3px 3px rgba(0, 0, 0, 0.2);\r\n            box-shadow: 0 2px 0 black, 0 3px 3px rgba(0, 0, 0, 0.2); }\r\n.button-3d.button-action {\r\n  -webkit-box-shadow: 0 7px 0 #8bc220, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n          box-shadow: 0 7px 0 #8bc220, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-action:hover, .button-3d.button-action:focus {\r\n    -webkit-box-shadow: 0 7px 0 #84b91f, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n            box-shadow: 0 7px 0 #84b91f, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-action:active, .button-3d.button-action.active, .button-3d.button-action.is-active {\r\n    -webkit-box-shadow: 0 2px 0 #6b9619, 0 3px 3px rgba(0, 0, 0, 0.2);\r\n            box-shadow: 0 2px 0 #6b9619, 0 3px 3px rgba(0, 0, 0, 0.2); }\r\n.button-3d.button-highlight {\r\n  -webkit-box-shadow: 0 7px 0 #e59501, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n          box-shadow: 0 7px 0 #e59501, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-highlight:hover, .button-3d.button-highlight:focus {\r\n    -webkit-box-shadow: 0 7px 0 #db8e01, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n            box-shadow: 0 7px 0 #db8e01, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-highlight:active, .button-3d.button-highlight.active, .button-3d.button-highlight.is-active {\r\n    -webkit-box-shadow: 0 2px 0 #b27401, 0 3px 3px rgba(0, 0, 0, 0.2);\r\n            box-shadow: 0 2px 0 #b27401, 0 3px 3px rgba(0, 0, 0, 0.2); }\r\n.button-3d.button-caution {\r\n  -webkit-box-shadow: 0 7px 0 #ff1022, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n          box-shadow: 0 7px 0 #ff1022, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-caution:hover, .button-3d.button-caution:focus {\r\n    -webkit-box-shadow: 0 7px 0 #ff0618, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n            box-shadow: 0 7px 0 #ff0618, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-caution:active, .button-3d.button-caution.active, .button-3d.button-caution.is-active {\r\n    -webkit-box-shadow: 0 2px 0 #dc0010, 0 3px 3px rgba(0, 0, 0, 0.2);\r\n            box-shadow: 0 2px 0 #dc0010, 0 3px 3px rgba(0, 0, 0, 0.2); }\r\n.button-3d.button-royal {\r\n  -webkit-box-shadow: 0 7px 0 #5246e2, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n          box-shadow: 0 7px 0 #5246e2, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-royal:hover, .button-3d.button-royal:focus {\r\n    -webkit-box-shadow: 0 7px 0 #493de1, 0 8px 3px rgba(0, 0, 0, 0.3);\r\n            box-shadow: 0 7px 0 #493de1, 0 8px 3px rgba(0, 0, 0, 0.3); }\r\n  .button-3d.button-royal:active, .button-3d.button-royal.active, .button-3d.button-royal.is-active {\r\n    -webkit-box-shadow: 0 2px 0 #2f21d4, 0 3px 3px rgba(0, 0, 0, 0.2);\r\n            box-shadow: 0 2px 0 #2f21d4, 0 3px 3px rgba(0, 0, 0, 0.2); }\r\n\r\n/*\r\n* Glowing Buttons\r\n*\r\n* A pulse like glow that appears\r\n* rythmically around the edges of\r\n* a button.\r\n*/\r\n/*\r\n* Glow animation mixin for Compass users\r\n*\r\n*/\r\n/*\r\n* Glowing Keyframes\r\n*\r\n*/\r\n@-webkit-keyframes glowing {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(44, 154, 219, 0.3);\r\n            box-shadow: 0 0 0 rgba(44, 154, 219, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(44, 154, 219, 0.8);\r\n            box-shadow: 0 0 20px rgba(44, 154, 219, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(44, 154, 219, 0.3);\r\n            box-shadow: 0 0 0 rgba(44, 154, 219, 0.3); } }\r\n@keyframes glowing {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(44, 154, 219, 0.3);\r\n            box-shadow: 0 0 0 rgba(44, 154, 219, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(44, 154, 219, 0.8);\r\n            box-shadow: 0 0 20px rgba(44, 154, 219, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(44, 154, 219, 0.3);\r\n            box-shadow: 0 0 0 rgba(44, 154, 219, 0.3); } }\r\n/*\r\n* Glowing Keyframes for various colors\r\n*\r\n*/\r\n@-webkit-keyframes glowing-primary {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(27, 154, 247, 0.3);\r\n            box-shadow: 0 0 0 rgba(27, 154, 247, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(27, 154, 247, 0.8);\r\n            box-shadow: 0 0 20px rgba(27, 154, 247, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(27, 154, 247, 0.3);\r\n            box-shadow: 0 0 0 rgba(27, 154, 247, 0.3); } }\r\n@keyframes glowing-primary {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(27, 154, 247, 0.3);\r\n            box-shadow: 0 0 0 rgba(27, 154, 247, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(27, 154, 247, 0.8);\r\n            box-shadow: 0 0 20px rgba(27, 154, 247, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(27, 154, 247, 0.3);\r\n            box-shadow: 0 0 0 rgba(27, 154, 247, 0.3); } }\r\n@-webkit-keyframes glowing-plain {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(255, 255, 255, 0.3);\r\n            box-shadow: 0 0 0 rgba(255, 255, 255, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);\r\n            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(255, 255, 255, 0.3);\r\n            box-shadow: 0 0 0 rgba(255, 255, 255, 0.3); } }\r\n@keyframes glowing-plain {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(255, 255, 255, 0.3);\r\n            box-shadow: 0 0 0 rgba(255, 255, 255, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);\r\n            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(255, 255, 255, 0.3);\r\n            box-shadow: 0 0 0 rgba(255, 255, 255, 0.3); } }\r\n@-webkit-keyframes glowing-inverse {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(34, 34, 34, 0.3);\r\n            box-shadow: 0 0 0 rgba(34, 34, 34, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(34, 34, 34, 0.8);\r\n            box-shadow: 0 0 20px rgba(34, 34, 34, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(34, 34, 34, 0.3);\r\n            box-shadow: 0 0 0 rgba(34, 34, 34, 0.3); } }\r\n@keyframes glowing-inverse {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(34, 34, 34, 0.3);\r\n            box-shadow: 0 0 0 rgba(34, 34, 34, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(34, 34, 34, 0.8);\r\n            box-shadow: 0 0 20px rgba(34, 34, 34, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(34, 34, 34, 0.3);\r\n            box-shadow: 0 0 0 rgba(34, 34, 34, 0.3); } }\r\n@-webkit-keyframes glowing-action {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(165, 222, 55, 0.3);\r\n            box-shadow: 0 0 0 rgba(165, 222, 55, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(165, 222, 55, 0.8);\r\n            box-shadow: 0 0 20px rgba(165, 222, 55, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(165, 222, 55, 0.3);\r\n            box-shadow: 0 0 0 rgba(165, 222, 55, 0.3); } }\r\n@keyframes glowing-action {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(165, 222, 55, 0.3);\r\n            box-shadow: 0 0 0 rgba(165, 222, 55, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(165, 222, 55, 0.8);\r\n            box-shadow: 0 0 20px rgba(165, 222, 55, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(165, 222, 55, 0.3);\r\n            box-shadow: 0 0 0 rgba(165, 222, 55, 0.3); } }\r\n@-webkit-keyframes glowing-highlight {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(254, 174, 27, 0.3);\r\n            box-shadow: 0 0 0 rgba(254, 174, 27, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(254, 174, 27, 0.8);\r\n            box-shadow: 0 0 20px rgba(254, 174, 27, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(254, 174, 27, 0.3);\r\n            box-shadow: 0 0 0 rgba(254, 174, 27, 0.3); } }\r\n@keyframes glowing-highlight {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(254, 174, 27, 0.3);\r\n            box-shadow: 0 0 0 rgba(254, 174, 27, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(254, 174, 27, 0.8);\r\n            box-shadow: 0 0 20px rgba(254, 174, 27, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(254, 174, 27, 0.3);\r\n            box-shadow: 0 0 0 rgba(254, 174, 27, 0.3); } }\r\n@-webkit-keyframes glowing-caution {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(255, 67, 81, 0.3);\r\n            box-shadow: 0 0 0 rgba(255, 67, 81, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(255, 67, 81, 0.8);\r\n            box-shadow: 0 0 20px rgba(255, 67, 81, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(255, 67, 81, 0.3);\r\n            box-shadow: 0 0 0 rgba(255, 67, 81, 0.3); } }\r\n@keyframes glowing-caution {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(255, 67, 81, 0.3);\r\n            box-shadow: 0 0 0 rgba(255, 67, 81, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(255, 67, 81, 0.8);\r\n            box-shadow: 0 0 20px rgba(255, 67, 81, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(255, 67, 81, 0.3);\r\n            box-shadow: 0 0 0 rgba(255, 67, 81, 0.3); } }\r\n@-webkit-keyframes glowing-royal {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(123, 114, 233, 0.3);\r\n            box-shadow: 0 0 0 rgba(123, 114, 233, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(123, 114, 233, 0.8);\r\n            box-shadow: 0 0 20px rgba(123, 114, 233, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(123, 114, 233, 0.3);\r\n            box-shadow: 0 0 0 rgba(123, 114, 233, 0.3); } }\r\n@keyframes glowing-royal {\r\n  from {\r\n    -webkit-box-shadow: 0 0 0 rgba(123, 114, 233, 0.3);\r\n            box-shadow: 0 0 0 rgba(123, 114, 233, 0.3); }\r\n  50% {\r\n    -webkit-box-shadow: 0 0 20px rgba(123, 114, 233, 0.8);\r\n            box-shadow: 0 0 20px rgba(123, 114, 233, 0.8); }\r\n  to {\r\n    -webkit-box-shadow: 0 0 0 rgba(123, 114, 233, 0.3);\r\n            box-shadow: 0 0 0 rgba(123, 114, 233, 0.3); } }\r\n/*\r\n* Glowing Buttons Base Styes\r\n*\r\n* A pulse like glow that appears\r\n* rythmically around the edges of\r\n* a button.\r\n*/\r\n.button-glow {\r\n  -webkit-animation-duration: 3s;\r\n          animation-duration: 3s;\r\n  -webkit-animation-iteration-count: infinite;\r\n          animation-iteration-count: infinite;\r\n  -webkit-animation-name: glowing;\r\n          animation-name: glowing; }\r\n  .button-glow:active, .button-glow.active, .button-glow.is-active {\r\n    -webkit-animation-name: none;\r\n            animation-name: none; }\r\n\r\n/*\r\n* Glowing Button Colors\r\n*\r\n* Create colors for glowing buttons\r\n*/\r\n.button-glow.button-primary {\r\n  -webkit-animation-name: glowing-primary;\r\n          animation-name: glowing-primary; }\r\n.button-glow.button-plain {\r\n  -webkit-animation-name: glowing-plain;\r\n          animation-name: glowing-plain; }\r\n.button-glow.button-inverse {\r\n  -webkit-animation-name: glowing-inverse;\r\n          animation-name: glowing-inverse; }\r\n.button-glow.button-action {\r\n  -webkit-animation-name: glowing-action;\r\n          animation-name: glowing-action; }\r\n.button-glow.button-highlight {\r\n  -webkit-animation-name: glowing-highlight;\r\n          animation-name: glowing-highlight; }\r\n.button-glow.button-caution {\r\n  -webkit-animation-name: glowing-caution;\r\n          animation-name: glowing-caution; }\r\n.button-glow.button-royal {\r\n  -webkit-animation-name: glowing-royal;\r\n          animation-name: glowing-royal; }\r\n\r\n/*\r\n* Dropdown menu buttons\r\n*\r\n* A dropdown menu appears\r\n* when a button is pressed\r\n*/\r\n/*\r\n* Dropdown Container\r\n*\r\n*/\r\n.button-dropdown {\r\n  position: relative;\r\n  overflow: visible;\r\n  display: inline-block; }\r\n\r\n/*\r\n* Dropdown List Style\r\n*\r\n*/\r\n.button-dropdown-list {\r\n  display: none;\r\n  position: absolute;\r\n  padding: 0;\r\n  margin: 0;\r\n  top: 0;\r\n  left: 0;\r\n  z-index: 1000;\r\n  min-width: 100%;\r\n  list-style-type: none;\r\n  background: rgba(255, 255, 255, 0.95);\r\n  border-style: solid;\r\n  border-width: 1px;\r\n  border-color: #d4d4d4;\r\n  font-family: \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif;\r\n  -webkit-box-shadow: 0 2px 7px rgba(0, 0, 0, 0.2);\r\n          box-shadow: 0 2px 7px rgba(0, 0, 0, 0.2);\r\n  border-radius: 3px;\r\n  -webkit-box-sizing: border-box;\r\n     -moz-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n  /*\r\n  * Dropdown Below\r\n  *\r\n  */\r\n  /*\r\n  * Dropdown Above\r\n  *\r\n  */ }\r\n  .button-dropdown-list.is-below {\r\n    top: 100%;\r\n    border-top: none;\r\n    border-radius: 0 0 3px 3px; }\r\n  .button-dropdown-list.is-above {\r\n    bottom: 100%;\r\n    top: auto;\r\n    border-bottom: none;\r\n    border-radius: 3px 3px 0 0;\r\n    -webkit-box-shadow: 0 -2px 7px rgba(0, 0, 0, 0.2);\r\n            box-shadow: 0 -2px 7px rgba(0, 0, 0, 0.2); }\r\n\r\n/*\r\n* Dropdown Buttons\r\n*\r\n*/\r\n.button-dropdown-list > li {\r\n  padding: 0;\r\n  margin: 0;\r\n  display: block; }\r\n  .button-dropdown-list > li > a {\r\n    display: block;\r\n    line-height: 40px;\r\n    font-size: 12.8px;\r\n    padding: 5px 10px;\r\n    float: none;\r\n    color: #666;\r\n    text-decoration: none; }\r\n    .button-dropdown-list > li > a:hover {\r\n      color: #5e5e5e;\r\n      background: #f6f6f6;\r\n      text-decoration: none; }\r\n\r\n.button-dropdown-divider {\r\n  border-top: 1px solid #e6e6e6; }\r\n\r\n/*\r\n* Dropdown Colors\r\n*\r\n* Create colors for buttons\r\n* (.button-primary, .button-secondary, etc.)\r\n*/\r\n.button-dropdown.button-dropdown-primary .button-dropdown-list {\r\n  background: rgba(27, 154, 247, 0.95);\r\n  border-color: #0880d7; }\r\n  .button-dropdown.button-dropdown-primary .button-dropdown-list .button-dropdown-divider {\r\n    border-color: #0888e6; }\r\n  .button-dropdown.button-dropdown-primary .button-dropdown-list > li > a {\r\n    color: #FFF; }\r\n    .button-dropdown.button-dropdown-primary .button-dropdown-list > li > a:hover {\r\n      color: #f2f2f2;\r\n      background: #088ef0; }\r\n.button-dropdown.button-dropdown-plain .button-dropdown-list {\r\n  background: rgba(255, 255, 255, 0.95);\r\n  border-color: #e6e6e6; }\r\n  .button-dropdown.button-dropdown-plain .button-dropdown-list .button-dropdown-divider {\r\n    border-color: #ededed; }\r\n  .button-dropdown.button-dropdown-plain .button-dropdown-list > li > a {\r\n    color: #1B9AF7; }\r\n    .button-dropdown.button-dropdown-plain .button-dropdown-list > li > a:hover {\r\n      color: #088ef0;\r\n      background: #f2f2f2; }\r\n.button-dropdown.button-dropdown-inverse .button-dropdown-list {\r\n  background: rgba(34, 34, 34, 0.95);\r\n  border-color: #090909; }\r\n  .button-dropdown.button-dropdown-inverse .button-dropdown-list .button-dropdown-divider {\r\n    border-color: #101010; }\r\n  .button-dropdown.button-dropdown-inverse .button-dropdown-list > li > a {\r\n    color: #EEE; }\r\n    .button-dropdown.button-dropdown-inverse .button-dropdown-list > li > a:hover {\r\n      color: #e1e1e1;\r\n      background: #151515; }\r\n.button-dropdown.button-dropdown-action .button-dropdown-list {\r\n  background: rgba(165, 222, 55, 0.95);\r\n  border-color: #8bc220; }\r\n  .button-dropdown.button-dropdown-action .button-dropdown-list .button-dropdown-divider {\r\n    border-color: #94cf22; }\r\n  .button-dropdown.button-dropdown-action .button-dropdown-list > li > a {\r\n    color: #FFF; }\r\n    .button-dropdown.button-dropdown-action .button-dropdown-list > li > a:hover {\r\n      color: #f2f2f2;\r\n      background: #9ad824; }\r\n.button-dropdown.button-dropdown-highlight .button-dropdown-list {\r\n  background: rgba(254, 174, 27, 0.95);\r\n  border-color: #e59501; }\r\n  .button-dropdown.button-dropdown-highlight .button-dropdown-list .button-dropdown-divider {\r\n    border-color: #f49f01; }\r\n  .button-dropdown.button-dropdown-highlight .button-dropdown-list > li > a {\r\n    color: #FFF; }\r\n    .button-dropdown.button-dropdown-highlight .button-dropdown-list > li > a:hover {\r\n      color: #f2f2f2;\r\n      background: #fea502; }\r\n.button-dropdown.button-dropdown-caution .button-dropdown-list {\r\n  background: rgba(255, 67, 81, 0.95);\r\n  border-color: #ff1022; }\r\n  .button-dropdown.button-dropdown-caution .button-dropdown-list .button-dropdown-divider {\r\n    border-color: #ff1f30; }\r\n  .button-dropdown.button-dropdown-caution .button-dropdown-list > li > a {\r\n    color: #FFF; }\r\n    .button-dropdown.button-dropdown-caution .button-dropdown-list > li > a:hover {\r\n      color: #f2f2f2;\r\n      background: #ff2939; }\r\n.button-dropdown.button-dropdown-royal .button-dropdown-list {\r\n  background: rgba(123, 114, 233, 0.95);\r\n  border-color: #5246e2; }\r\n  .button-dropdown.button-dropdown-royal .button-dropdown-list .button-dropdown-divider {\r\n    border-color: #5e53e4; }\r\n  .button-dropdown.button-dropdown-royal .button-dropdown-list > li > a {\r\n    color: #FFF; }\r\n    .button-dropdown.button-dropdown-royal .button-dropdown-list > li > a:hover {\r\n      color: #f2f2f2;\r\n      background: #665ce6; }\r\n\r\n/*\r\n* Buton Groups\r\n*\r\n* A group of related buttons\r\n* displayed edge to edge\r\n*/\r\n.button-group {\r\n  position: relative;\r\n  display: inline-block; }\r\n  .button-group:after {\r\n    content: \" \";\r\n    display: block;\r\n    clear: both; }\r\n  .button-group .button,\r\n  .button-group .button-dropdown {\r\n    float: left; }\r\n    .button-group .button:not(:first-child):not(:last-child),\r\n    .button-group .button-dropdown:not(:first-child):not(:last-child) {\r\n      border-radius: 0;\r\n      border-right: none; }\r\n    .button-group .button:first-child,\r\n    .button-group .button-dropdown:first-child {\r\n      border-top-right-radius: 0;\r\n      border-bottom-right-radius: 0;\r\n      border-right: none; }\r\n    .button-group .button:last-child,\r\n    .button-group .button-dropdown:last-child {\r\n      border-top-left-radius: 0;\r\n      border-bottom-left-radius: 0; }\r\n\r\n/*\r\n* Button Wrapper\r\n*\r\n* A wrap around effect to highlight\r\n* the shape of the button and offer\r\n* a subtle visual effect.\r\n*/\r\n.button-wrap {\r\n  border: 1px solid #e3e3e3;\r\n  display: inline-block;\r\n  padding: 9px;\r\n  background: -webkit-gradient(linear, left top, left bottom, from(#f2f2f2), to(#FFF));\r\n  background: linear-gradient(#f2f2f2, #FFF);\r\n  border-radius: 200px;\r\n  -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);\r\n          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04); }\r\n\r\n/*\r\n* Long Shadow Buttons\r\n*\r\n* A visual effect adding a flat shadow to the text of a button\r\n*/\r\n/*\r\n* Long Shadow Function\r\n*\r\n* Loops $length times building a long shadow. Defaults downward right\r\n*/\r\n/*\r\n* LONG SHADOW MIXIN\r\n*\r\n*/\r\n/*\r\n* Shadow Right\r\n*\r\n*/\r\n.button-longshadow,\r\n.button-longshadow-right {\r\n  overflow: hidden; }\r\n  .button-longshadow.button-primary,\r\n  .button-longshadow-right.button-primary {\r\n    text-shadow: 0px 0px #0880d7, 1px 1px #0880d7, 2px 2px #0880d7, 3px 3px #0880d7, 4px 4px #0880d7, 5px 5px #0880d7, 6px 6px #0880d7, 7px 7px #0880d7, 8px 8px #0880d7, 9px 9px #0880d7, 10px 10px #0880d7, 11px 11px #0880d7, 12px 12px #0880d7, 13px 13px #0880d7, 14px 14px #0880d7, 15px 15px #0880d7, 16px 16px #0880d7, 17px 17px #0880d7, 18px 18px #0880d7, 19px 19px #0880d7, 20px 20px #0880d7, 21px 21px #0880d7, 22px 22px #0880d7, 23px 23px #0880d7, 24px 24px #0880d7, 25px 25px #0880d7, 26px 26px #0880d7, 27px 27px #0880d7, 28px 28px #0880d7, 29px 29px #0880d7, 30px 30px #0880d7, 31px 31px #0880d7, 32px 32px #0880d7, 33px 33px #0880d7, 34px 34px #0880d7, 35px 35px #0880d7, 36px 36px #0880d7, 37px 37px #0880d7, 38px 38px #0880d7, 39px 39px #0880d7, 40px 40px #0880d7, 41px 41px #0880d7, 42px 42px #0880d7, 43px 43px #0880d7, 44px 44px #0880d7, 45px 45px #0880d7, 46px 46px #0880d7, 47px 47px #0880d7, 48px 48px #0880d7, 49px 49px #0880d7, 50px 50px #0880d7, 51px 51px #0880d7, 52px 52px #0880d7, 53px 53px #0880d7, 54px 54px #0880d7, 55px 55px #0880d7, 56px 56px #0880d7, 57px 57px #0880d7, 58px 58px #0880d7, 59px 59px #0880d7, 60px 60px #0880d7, 61px 61px #0880d7, 62px 62px #0880d7, 63px 63px #0880d7, 64px 64px #0880d7, 65px 65px #0880d7, 66px 66px #0880d7, 67px 67px #0880d7, 68px 68px #0880d7, 69px 69px #0880d7, 70px 70px #0880d7, 71px 71px #0880d7, 72px 72px #0880d7, 73px 73px #0880d7, 74px 74px #0880d7, 75px 75px #0880d7, 76px 76px #0880d7, 77px 77px #0880d7, 78px 78px #0880d7, 79px 79px #0880d7, 80px 80px #0880d7, 81px 81px #0880d7, 82px 82px #0880d7, 83px 83px #0880d7, 84px 84px #0880d7, 85px 85px #0880d7; }\r\n    .button-longshadow.button-primary:active, .button-longshadow.button-primary.active, .button-longshadow.button-primary.is-active,\r\n    .button-longshadow-right.button-primary:active,\r\n    .button-longshadow-right.button-primary.active,\r\n    .button-longshadow-right.button-primary.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow.button-plain,\r\n  .button-longshadow-right.button-plain {\r\n    text-shadow: 0px 0px #e6e6e6, 1px 1px #e6e6e6, 2px 2px #e6e6e6, 3px 3px #e6e6e6, 4px 4px #e6e6e6, 5px 5px #e6e6e6, 6px 6px #e6e6e6, 7px 7px #e6e6e6, 8px 8px #e6e6e6, 9px 9px #e6e6e6, 10px 10px #e6e6e6, 11px 11px #e6e6e6, 12px 12px #e6e6e6, 13px 13px #e6e6e6, 14px 14px #e6e6e6, 15px 15px #e6e6e6, 16px 16px #e6e6e6, 17px 17px #e6e6e6, 18px 18px #e6e6e6, 19px 19px #e6e6e6, 20px 20px #e6e6e6, 21px 21px #e6e6e6, 22px 22px #e6e6e6, 23px 23px #e6e6e6, 24px 24px #e6e6e6, 25px 25px #e6e6e6, 26px 26px #e6e6e6, 27px 27px #e6e6e6, 28px 28px #e6e6e6, 29px 29px #e6e6e6, 30px 30px #e6e6e6, 31px 31px #e6e6e6, 32px 32px #e6e6e6, 33px 33px #e6e6e6, 34px 34px #e6e6e6, 35px 35px #e6e6e6, 36px 36px #e6e6e6, 37px 37px #e6e6e6, 38px 38px #e6e6e6, 39px 39px #e6e6e6, 40px 40px #e6e6e6, 41px 41px #e6e6e6, 42px 42px #e6e6e6, 43px 43px #e6e6e6, 44px 44px #e6e6e6, 45px 45px #e6e6e6, 46px 46px #e6e6e6, 47px 47px #e6e6e6, 48px 48px #e6e6e6, 49px 49px #e6e6e6, 50px 50px #e6e6e6, 51px 51px #e6e6e6, 52px 52px #e6e6e6, 53px 53px #e6e6e6, 54px 54px #e6e6e6, 55px 55px #e6e6e6, 56px 56px #e6e6e6, 57px 57px #e6e6e6, 58px 58px #e6e6e6, 59px 59px #e6e6e6, 60px 60px #e6e6e6, 61px 61px #e6e6e6, 62px 62px #e6e6e6, 63px 63px #e6e6e6, 64px 64px #e6e6e6, 65px 65px #e6e6e6, 66px 66px #e6e6e6, 67px 67px #e6e6e6, 68px 68px #e6e6e6, 69px 69px #e6e6e6, 70px 70px #e6e6e6, 71px 71px #e6e6e6, 72px 72px #e6e6e6, 73px 73px #e6e6e6, 74px 74px #e6e6e6, 75px 75px #e6e6e6, 76px 76px #e6e6e6, 77px 77px #e6e6e6, 78px 78px #e6e6e6, 79px 79px #e6e6e6, 80px 80px #e6e6e6, 81px 81px #e6e6e6, 82px 82px #e6e6e6, 83px 83px #e6e6e6, 84px 84px #e6e6e6, 85px 85px #e6e6e6; }\r\n    .button-longshadow.button-plain:active, .button-longshadow.button-plain.active, .button-longshadow.button-plain.is-active,\r\n    .button-longshadow-right.button-plain:active,\r\n    .button-longshadow-right.button-plain.active,\r\n    .button-longshadow-right.button-plain.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow.button-inverse,\r\n  .button-longshadow-right.button-inverse {\r\n    text-shadow: 0px 0px #090909, 1px 1px #090909, 2px 2px #090909, 3px 3px #090909, 4px 4px #090909, 5px 5px #090909, 6px 6px #090909, 7px 7px #090909, 8px 8px #090909, 9px 9px #090909, 10px 10px #090909, 11px 11px #090909, 12px 12px #090909, 13px 13px #090909, 14px 14px #090909, 15px 15px #090909, 16px 16px #090909, 17px 17px #090909, 18px 18px #090909, 19px 19px #090909, 20px 20px #090909, 21px 21px #090909, 22px 22px #090909, 23px 23px #090909, 24px 24px #090909, 25px 25px #090909, 26px 26px #090909, 27px 27px #090909, 28px 28px #090909, 29px 29px #090909, 30px 30px #090909, 31px 31px #090909, 32px 32px #090909, 33px 33px #090909, 34px 34px #090909, 35px 35px #090909, 36px 36px #090909, 37px 37px #090909, 38px 38px #090909, 39px 39px #090909, 40px 40px #090909, 41px 41px #090909, 42px 42px #090909, 43px 43px #090909, 44px 44px #090909, 45px 45px #090909, 46px 46px #090909, 47px 47px #090909, 48px 48px #090909, 49px 49px #090909, 50px 50px #090909, 51px 51px #090909, 52px 52px #090909, 53px 53px #090909, 54px 54px #090909, 55px 55px #090909, 56px 56px #090909, 57px 57px #090909, 58px 58px #090909, 59px 59px #090909, 60px 60px #090909, 61px 61px #090909, 62px 62px #090909, 63px 63px #090909, 64px 64px #090909, 65px 65px #090909, 66px 66px #090909, 67px 67px #090909, 68px 68px #090909, 69px 69px #090909, 70px 70px #090909, 71px 71px #090909, 72px 72px #090909, 73px 73px #090909, 74px 74px #090909, 75px 75px #090909, 76px 76px #090909, 77px 77px #090909, 78px 78px #090909, 79px 79px #090909, 80px 80px #090909, 81px 81px #090909, 82px 82px #090909, 83px 83px #090909, 84px 84px #090909, 85px 85px #090909; }\r\n    .button-longshadow.button-inverse:active, .button-longshadow.button-inverse.active, .button-longshadow.button-inverse.is-active,\r\n    .button-longshadow-right.button-inverse:active,\r\n    .button-longshadow-right.button-inverse.active,\r\n    .button-longshadow-right.button-inverse.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow.button-action,\r\n  .button-longshadow-right.button-action {\r\n    text-shadow: 0px 0px #8bc220, 1px 1px #8bc220, 2px 2px #8bc220, 3px 3px #8bc220, 4px 4px #8bc220, 5px 5px #8bc220, 6px 6px #8bc220, 7px 7px #8bc220, 8px 8px #8bc220, 9px 9px #8bc220, 10px 10px #8bc220, 11px 11px #8bc220, 12px 12px #8bc220, 13px 13px #8bc220, 14px 14px #8bc220, 15px 15px #8bc220, 16px 16px #8bc220, 17px 17px #8bc220, 18px 18px #8bc220, 19px 19px #8bc220, 20px 20px #8bc220, 21px 21px #8bc220, 22px 22px #8bc220, 23px 23px #8bc220, 24px 24px #8bc220, 25px 25px #8bc220, 26px 26px #8bc220, 27px 27px #8bc220, 28px 28px #8bc220, 29px 29px #8bc220, 30px 30px #8bc220, 31px 31px #8bc220, 32px 32px #8bc220, 33px 33px #8bc220, 34px 34px #8bc220, 35px 35px #8bc220, 36px 36px #8bc220, 37px 37px #8bc220, 38px 38px #8bc220, 39px 39px #8bc220, 40px 40px #8bc220, 41px 41px #8bc220, 42px 42px #8bc220, 43px 43px #8bc220, 44px 44px #8bc220, 45px 45px #8bc220, 46px 46px #8bc220, 47px 47px #8bc220, 48px 48px #8bc220, 49px 49px #8bc220, 50px 50px #8bc220, 51px 51px #8bc220, 52px 52px #8bc220, 53px 53px #8bc220, 54px 54px #8bc220, 55px 55px #8bc220, 56px 56px #8bc220, 57px 57px #8bc220, 58px 58px #8bc220, 59px 59px #8bc220, 60px 60px #8bc220, 61px 61px #8bc220, 62px 62px #8bc220, 63px 63px #8bc220, 64px 64px #8bc220, 65px 65px #8bc220, 66px 66px #8bc220, 67px 67px #8bc220, 68px 68px #8bc220, 69px 69px #8bc220, 70px 70px #8bc220, 71px 71px #8bc220, 72px 72px #8bc220, 73px 73px #8bc220, 74px 74px #8bc220, 75px 75px #8bc220, 76px 76px #8bc220, 77px 77px #8bc220, 78px 78px #8bc220, 79px 79px #8bc220, 80px 80px #8bc220, 81px 81px #8bc220, 82px 82px #8bc220, 83px 83px #8bc220, 84px 84px #8bc220, 85px 85px #8bc220; }\r\n    .button-longshadow.button-action:active, .button-longshadow.button-action.active, .button-longshadow.button-action.is-active,\r\n    .button-longshadow-right.button-action:active,\r\n    .button-longshadow-right.button-action.active,\r\n    .button-longshadow-right.button-action.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow.button-highlight,\r\n  .button-longshadow-right.button-highlight {\r\n    text-shadow: 0px 0px #e59501, 1px 1px #e59501, 2px 2px #e59501, 3px 3px #e59501, 4px 4px #e59501, 5px 5px #e59501, 6px 6px #e59501, 7px 7px #e59501, 8px 8px #e59501, 9px 9px #e59501, 10px 10px #e59501, 11px 11px #e59501, 12px 12px #e59501, 13px 13px #e59501, 14px 14px #e59501, 15px 15px #e59501, 16px 16px #e59501, 17px 17px #e59501, 18px 18px #e59501, 19px 19px #e59501, 20px 20px #e59501, 21px 21px #e59501, 22px 22px #e59501, 23px 23px #e59501, 24px 24px #e59501, 25px 25px #e59501, 26px 26px #e59501, 27px 27px #e59501, 28px 28px #e59501, 29px 29px #e59501, 30px 30px #e59501, 31px 31px #e59501, 32px 32px #e59501, 33px 33px #e59501, 34px 34px #e59501, 35px 35px #e59501, 36px 36px #e59501, 37px 37px #e59501, 38px 38px #e59501, 39px 39px #e59501, 40px 40px #e59501, 41px 41px #e59501, 42px 42px #e59501, 43px 43px #e59501, 44px 44px #e59501, 45px 45px #e59501, 46px 46px #e59501, 47px 47px #e59501, 48px 48px #e59501, 49px 49px #e59501, 50px 50px #e59501, 51px 51px #e59501, 52px 52px #e59501, 53px 53px #e59501, 54px 54px #e59501, 55px 55px #e59501, 56px 56px #e59501, 57px 57px #e59501, 58px 58px #e59501, 59px 59px #e59501, 60px 60px #e59501, 61px 61px #e59501, 62px 62px #e59501, 63px 63px #e59501, 64px 64px #e59501, 65px 65px #e59501, 66px 66px #e59501, 67px 67px #e59501, 68px 68px #e59501, 69px 69px #e59501, 70px 70px #e59501, 71px 71px #e59501, 72px 72px #e59501, 73px 73px #e59501, 74px 74px #e59501, 75px 75px #e59501, 76px 76px #e59501, 77px 77px #e59501, 78px 78px #e59501, 79px 79px #e59501, 80px 80px #e59501, 81px 81px #e59501, 82px 82px #e59501, 83px 83px #e59501, 84px 84px #e59501, 85px 85px #e59501; }\r\n    .button-longshadow.button-highlight:active, .button-longshadow.button-highlight.active, .button-longshadow.button-highlight.is-active,\r\n    .button-longshadow-right.button-highlight:active,\r\n    .button-longshadow-right.button-highlight.active,\r\n    .button-longshadow-right.button-highlight.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow.button-caution,\r\n  .button-longshadow-right.button-caution {\r\n    text-shadow: 0px 0px #ff1022, 1px 1px #ff1022, 2px 2px #ff1022, 3px 3px #ff1022, 4px 4px #ff1022, 5px 5px #ff1022, 6px 6px #ff1022, 7px 7px #ff1022, 8px 8px #ff1022, 9px 9px #ff1022, 10px 10px #ff1022, 11px 11px #ff1022, 12px 12px #ff1022, 13px 13px #ff1022, 14px 14px #ff1022, 15px 15px #ff1022, 16px 16px #ff1022, 17px 17px #ff1022, 18px 18px #ff1022, 19px 19px #ff1022, 20px 20px #ff1022, 21px 21px #ff1022, 22px 22px #ff1022, 23px 23px #ff1022, 24px 24px #ff1022, 25px 25px #ff1022, 26px 26px #ff1022, 27px 27px #ff1022, 28px 28px #ff1022, 29px 29px #ff1022, 30px 30px #ff1022, 31px 31px #ff1022, 32px 32px #ff1022, 33px 33px #ff1022, 34px 34px #ff1022, 35px 35px #ff1022, 36px 36px #ff1022, 37px 37px #ff1022, 38px 38px #ff1022, 39px 39px #ff1022, 40px 40px #ff1022, 41px 41px #ff1022, 42px 42px #ff1022, 43px 43px #ff1022, 44px 44px #ff1022, 45px 45px #ff1022, 46px 46px #ff1022, 47px 47px #ff1022, 48px 48px #ff1022, 49px 49px #ff1022, 50px 50px #ff1022, 51px 51px #ff1022, 52px 52px #ff1022, 53px 53px #ff1022, 54px 54px #ff1022, 55px 55px #ff1022, 56px 56px #ff1022, 57px 57px #ff1022, 58px 58px #ff1022, 59px 59px #ff1022, 60px 60px #ff1022, 61px 61px #ff1022, 62px 62px #ff1022, 63px 63px #ff1022, 64px 64px #ff1022, 65px 65px #ff1022, 66px 66px #ff1022, 67px 67px #ff1022, 68px 68px #ff1022, 69px 69px #ff1022, 70px 70px #ff1022, 71px 71px #ff1022, 72px 72px #ff1022, 73px 73px #ff1022, 74px 74px #ff1022, 75px 75px #ff1022, 76px 76px #ff1022, 77px 77px #ff1022, 78px 78px #ff1022, 79px 79px #ff1022, 80px 80px #ff1022, 81px 81px #ff1022, 82px 82px #ff1022, 83px 83px #ff1022, 84px 84px #ff1022, 85px 85px #ff1022; }\r\n    .button-longshadow.button-caution:active, .button-longshadow.button-caution.active, .button-longshadow.button-caution.is-active,\r\n    .button-longshadow-right.button-caution:active,\r\n    .button-longshadow-right.button-caution.active,\r\n    .button-longshadow-right.button-caution.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow.button-royal,\r\n  .button-longshadow-right.button-royal {\r\n    text-shadow: 0px 0px #5246e2, 1px 1px #5246e2, 2px 2px #5246e2, 3px 3px #5246e2, 4px 4px #5246e2, 5px 5px #5246e2, 6px 6px #5246e2, 7px 7px #5246e2, 8px 8px #5246e2, 9px 9px #5246e2, 10px 10px #5246e2, 11px 11px #5246e2, 12px 12px #5246e2, 13px 13px #5246e2, 14px 14px #5246e2, 15px 15px #5246e2, 16px 16px #5246e2, 17px 17px #5246e2, 18px 18px #5246e2, 19px 19px #5246e2, 20px 20px #5246e2, 21px 21px #5246e2, 22px 22px #5246e2, 23px 23px #5246e2, 24px 24px #5246e2, 25px 25px #5246e2, 26px 26px #5246e2, 27px 27px #5246e2, 28px 28px #5246e2, 29px 29px #5246e2, 30px 30px #5246e2, 31px 31px #5246e2, 32px 32px #5246e2, 33px 33px #5246e2, 34px 34px #5246e2, 35px 35px #5246e2, 36px 36px #5246e2, 37px 37px #5246e2, 38px 38px #5246e2, 39px 39px #5246e2, 40px 40px #5246e2, 41px 41px #5246e2, 42px 42px #5246e2, 43px 43px #5246e2, 44px 44px #5246e2, 45px 45px #5246e2, 46px 46px #5246e2, 47px 47px #5246e2, 48px 48px #5246e2, 49px 49px #5246e2, 50px 50px #5246e2, 51px 51px #5246e2, 52px 52px #5246e2, 53px 53px #5246e2, 54px 54px #5246e2, 55px 55px #5246e2, 56px 56px #5246e2, 57px 57px #5246e2, 58px 58px #5246e2, 59px 59px #5246e2, 60px 60px #5246e2, 61px 61px #5246e2, 62px 62px #5246e2, 63px 63px #5246e2, 64px 64px #5246e2, 65px 65px #5246e2, 66px 66px #5246e2, 67px 67px #5246e2, 68px 68px #5246e2, 69px 69px #5246e2, 70px 70px #5246e2, 71px 71px #5246e2, 72px 72px #5246e2, 73px 73px #5246e2, 74px 74px #5246e2, 75px 75px #5246e2, 76px 76px #5246e2, 77px 77px #5246e2, 78px 78px #5246e2, 79px 79px #5246e2, 80px 80px #5246e2, 81px 81px #5246e2, 82px 82px #5246e2, 83px 83px #5246e2, 84px 84px #5246e2, 85px 85px #5246e2; }\r\n    .button-longshadow.button-royal:active, .button-longshadow.button-royal.active, .button-longshadow.button-royal.is-active,\r\n    .button-longshadow-right.button-royal:active,\r\n    .button-longshadow-right.button-royal.active,\r\n    .button-longshadow-right.button-royal.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n\r\n/*\r\n* Shadow Left\r\n*\r\n*/\r\n.button-longshadow-left {\r\n  overflow: hidden; }\r\n  .button-longshadow-left.button-primary {\r\n    text-shadow: 0px 0px #0880d7, -1px 1px #0880d7, -2px 2px #0880d7, -3px 3px #0880d7, -4px 4px #0880d7, -5px 5px #0880d7, -6px 6px #0880d7, -7px 7px #0880d7, -8px 8px #0880d7, -9px 9px #0880d7, -10px 10px #0880d7, -11px 11px #0880d7, -12px 12px #0880d7, -13px 13px #0880d7, -14px 14px #0880d7, -15px 15px #0880d7, -16px 16px #0880d7, -17px 17px #0880d7, -18px 18px #0880d7, -19px 19px #0880d7, -20px 20px #0880d7, -21px 21px #0880d7, -22px 22px #0880d7, -23px 23px #0880d7, -24px 24px #0880d7, -25px 25px #0880d7, -26px 26px #0880d7, -27px 27px #0880d7, -28px 28px #0880d7, -29px 29px #0880d7, -30px 30px #0880d7, -31px 31px #0880d7, -32px 32px #0880d7, -33px 33px #0880d7, -34px 34px #0880d7, -35px 35px #0880d7, -36px 36px #0880d7, -37px 37px #0880d7, -38px 38px #0880d7, -39px 39px #0880d7, -40px 40px #0880d7, -41px 41px #0880d7, -42px 42px #0880d7, -43px 43px #0880d7, -44px 44px #0880d7, -45px 45px #0880d7, -46px 46px #0880d7, -47px 47px #0880d7, -48px 48px #0880d7, -49px 49px #0880d7, -50px 50px #0880d7, -51px 51px #0880d7, -52px 52px #0880d7, -53px 53px #0880d7, -54px 54px #0880d7, -55px 55px #0880d7, -56px 56px #0880d7, -57px 57px #0880d7, -58px 58px #0880d7, -59px 59px #0880d7, -60px 60px #0880d7, -61px 61px #0880d7, -62px 62px #0880d7, -63px 63px #0880d7, -64px 64px #0880d7, -65px 65px #0880d7, -66px 66px #0880d7, -67px 67px #0880d7, -68px 68px #0880d7, -69px 69px #0880d7, -70px 70px #0880d7, -71px 71px #0880d7, -72px 72px #0880d7, -73px 73px #0880d7, -74px 74px #0880d7, -75px 75px #0880d7, -76px 76px #0880d7, -77px 77px #0880d7, -78px 78px #0880d7, -79px 79px #0880d7, -80px 80px #0880d7, -81px 81px #0880d7, -82px 82px #0880d7, -83px 83px #0880d7, -84px 84px #0880d7, -85px 85px #0880d7; }\r\n    .button-longshadow-left.button-primary:active, .button-longshadow-left.button-primary.active, .button-longshadow-left.button-primary.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow-left.button-plain {\r\n    text-shadow: 0px 0px #e6e6e6, -1px 1px #e6e6e6, -2px 2px #e6e6e6, -3px 3px #e6e6e6, -4px 4px #e6e6e6, -5px 5px #e6e6e6, -6px 6px #e6e6e6, -7px 7px #e6e6e6, -8px 8px #e6e6e6, -9px 9px #e6e6e6, -10px 10px #e6e6e6, -11px 11px #e6e6e6, -12px 12px #e6e6e6, -13px 13px #e6e6e6, -14px 14px #e6e6e6, -15px 15px #e6e6e6, -16px 16px #e6e6e6, -17px 17px #e6e6e6, -18px 18px #e6e6e6, -19px 19px #e6e6e6, -20px 20px #e6e6e6, -21px 21px #e6e6e6, -22px 22px #e6e6e6, -23px 23px #e6e6e6, -24px 24px #e6e6e6, -25px 25px #e6e6e6, -26px 26px #e6e6e6, -27px 27px #e6e6e6, -28px 28px #e6e6e6, -29px 29px #e6e6e6, -30px 30px #e6e6e6, -31px 31px #e6e6e6, -32px 32px #e6e6e6, -33px 33px #e6e6e6, -34px 34px #e6e6e6, -35px 35px #e6e6e6, -36px 36px #e6e6e6, -37px 37px #e6e6e6, -38px 38px #e6e6e6, -39px 39px #e6e6e6, -40px 40px #e6e6e6, -41px 41px #e6e6e6, -42px 42px #e6e6e6, -43px 43px #e6e6e6, -44px 44px #e6e6e6, -45px 45px #e6e6e6, -46px 46px #e6e6e6, -47px 47px #e6e6e6, -48px 48px #e6e6e6, -49px 49px #e6e6e6, -50px 50px #e6e6e6, -51px 51px #e6e6e6, -52px 52px #e6e6e6, -53px 53px #e6e6e6, -54px 54px #e6e6e6, -55px 55px #e6e6e6, -56px 56px #e6e6e6, -57px 57px #e6e6e6, -58px 58px #e6e6e6, -59px 59px #e6e6e6, -60px 60px #e6e6e6, -61px 61px #e6e6e6, -62px 62px #e6e6e6, -63px 63px #e6e6e6, -64px 64px #e6e6e6, -65px 65px #e6e6e6, -66px 66px #e6e6e6, -67px 67px #e6e6e6, -68px 68px #e6e6e6, -69px 69px #e6e6e6, -70px 70px #e6e6e6, -71px 71px #e6e6e6, -72px 72px #e6e6e6, -73px 73px #e6e6e6, -74px 74px #e6e6e6, -75px 75px #e6e6e6, -76px 76px #e6e6e6, -77px 77px #e6e6e6, -78px 78px #e6e6e6, -79px 79px #e6e6e6, -80px 80px #e6e6e6, -81px 81px #e6e6e6, -82px 82px #e6e6e6, -83px 83px #e6e6e6, -84px 84px #e6e6e6, -85px 85px #e6e6e6; }\r\n    .button-longshadow-left.button-plain:active, .button-longshadow-left.button-plain.active, .button-longshadow-left.button-plain.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow-left.button-inverse {\r\n    text-shadow: 0px 0px #090909, -1px 1px #090909, -2px 2px #090909, -3px 3px #090909, -4px 4px #090909, -5px 5px #090909, -6px 6px #090909, -7px 7px #090909, -8px 8px #090909, -9px 9px #090909, -10px 10px #090909, -11px 11px #090909, -12px 12px #090909, -13px 13px #090909, -14px 14px #090909, -15px 15px #090909, -16px 16px #090909, -17px 17px #090909, -18px 18px #090909, -19px 19px #090909, -20px 20px #090909, -21px 21px #090909, -22px 22px #090909, -23px 23px #090909, -24px 24px #090909, -25px 25px #090909, -26px 26px #090909, -27px 27px #090909, -28px 28px #090909, -29px 29px #090909, -30px 30px #090909, -31px 31px #090909, -32px 32px #090909, -33px 33px #090909, -34px 34px #090909, -35px 35px #090909, -36px 36px #090909, -37px 37px #090909, -38px 38px #090909, -39px 39px #090909, -40px 40px #090909, -41px 41px #090909, -42px 42px #090909, -43px 43px #090909, -44px 44px #090909, -45px 45px #090909, -46px 46px #090909, -47px 47px #090909, -48px 48px #090909, -49px 49px #090909, -50px 50px #090909, -51px 51px #090909, -52px 52px #090909, -53px 53px #090909, -54px 54px #090909, -55px 55px #090909, -56px 56px #090909, -57px 57px #090909, -58px 58px #090909, -59px 59px #090909, -60px 60px #090909, -61px 61px #090909, -62px 62px #090909, -63px 63px #090909, -64px 64px #090909, -65px 65px #090909, -66px 66px #090909, -67px 67px #090909, -68px 68px #090909, -69px 69px #090909, -70px 70px #090909, -71px 71px #090909, -72px 72px #090909, -73px 73px #090909, -74px 74px #090909, -75px 75px #090909, -76px 76px #090909, -77px 77px #090909, -78px 78px #090909, -79px 79px #090909, -80px 80px #090909, -81px 81px #090909, -82px 82px #090909, -83px 83px #090909, -84px 84px #090909, -85px 85px #090909; }\r\n    .button-longshadow-left.button-inverse:active, .button-longshadow-left.button-inverse.active, .button-longshadow-left.button-inverse.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow-left.button-action {\r\n    text-shadow: 0px 0px #8bc220, -1px 1px #8bc220, -2px 2px #8bc220, -3px 3px #8bc220, -4px 4px #8bc220, -5px 5px #8bc220, -6px 6px #8bc220, -7px 7px #8bc220, -8px 8px #8bc220, -9px 9px #8bc220, -10px 10px #8bc220, -11px 11px #8bc220, -12px 12px #8bc220, -13px 13px #8bc220, -14px 14px #8bc220, -15px 15px #8bc220, -16px 16px #8bc220, -17px 17px #8bc220, -18px 18px #8bc220, -19px 19px #8bc220, -20px 20px #8bc220, -21px 21px #8bc220, -22px 22px #8bc220, -23px 23px #8bc220, -24px 24px #8bc220, -25px 25px #8bc220, -26px 26px #8bc220, -27px 27px #8bc220, -28px 28px #8bc220, -29px 29px #8bc220, -30px 30px #8bc220, -31px 31px #8bc220, -32px 32px #8bc220, -33px 33px #8bc220, -34px 34px #8bc220, -35px 35px #8bc220, -36px 36px #8bc220, -37px 37px #8bc220, -38px 38px #8bc220, -39px 39px #8bc220, -40px 40px #8bc220, -41px 41px #8bc220, -42px 42px #8bc220, -43px 43px #8bc220, -44px 44px #8bc220, -45px 45px #8bc220, -46px 46px #8bc220, -47px 47px #8bc220, -48px 48px #8bc220, -49px 49px #8bc220, -50px 50px #8bc220, -51px 51px #8bc220, -52px 52px #8bc220, -53px 53px #8bc220, -54px 54px #8bc220, -55px 55px #8bc220, -56px 56px #8bc220, -57px 57px #8bc220, -58px 58px #8bc220, -59px 59px #8bc220, -60px 60px #8bc220, -61px 61px #8bc220, -62px 62px #8bc220, -63px 63px #8bc220, -64px 64px #8bc220, -65px 65px #8bc220, -66px 66px #8bc220, -67px 67px #8bc220, -68px 68px #8bc220, -69px 69px #8bc220, -70px 70px #8bc220, -71px 71px #8bc220, -72px 72px #8bc220, -73px 73px #8bc220, -74px 74px #8bc220, -75px 75px #8bc220, -76px 76px #8bc220, -77px 77px #8bc220, -78px 78px #8bc220, -79px 79px #8bc220, -80px 80px #8bc220, -81px 81px #8bc220, -82px 82px #8bc220, -83px 83px #8bc220, -84px 84px #8bc220, -85px 85px #8bc220; }\r\n    .button-longshadow-left.button-action:active, .button-longshadow-left.button-action.active, .button-longshadow-left.button-action.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow-left.button-highlight {\r\n    text-shadow: 0px 0px #e59501, -1px 1px #e59501, -2px 2px #e59501, -3px 3px #e59501, -4px 4px #e59501, -5px 5px #e59501, -6px 6px #e59501, -7px 7px #e59501, -8px 8px #e59501, -9px 9px #e59501, -10px 10px #e59501, -11px 11px #e59501, -12px 12px #e59501, -13px 13px #e59501, -14px 14px #e59501, -15px 15px #e59501, -16px 16px #e59501, -17px 17px #e59501, -18px 18px #e59501, -19px 19px #e59501, -20px 20px #e59501, -21px 21px #e59501, -22px 22px #e59501, -23px 23px #e59501, -24px 24px #e59501, -25px 25px #e59501, -26px 26px #e59501, -27px 27px #e59501, -28px 28px #e59501, -29px 29px #e59501, -30px 30px #e59501, -31px 31px #e59501, -32px 32px #e59501, -33px 33px #e59501, -34px 34px #e59501, -35px 35px #e59501, -36px 36px #e59501, -37px 37px #e59501, -38px 38px #e59501, -39px 39px #e59501, -40px 40px #e59501, -41px 41px #e59501, -42px 42px #e59501, -43px 43px #e59501, -44px 44px #e59501, -45px 45px #e59501, -46px 46px #e59501, -47px 47px #e59501, -48px 48px #e59501, -49px 49px #e59501, -50px 50px #e59501, -51px 51px #e59501, -52px 52px #e59501, -53px 53px #e59501, -54px 54px #e59501, -55px 55px #e59501, -56px 56px #e59501, -57px 57px #e59501, -58px 58px #e59501, -59px 59px #e59501, -60px 60px #e59501, -61px 61px #e59501, -62px 62px #e59501, -63px 63px #e59501, -64px 64px #e59501, -65px 65px #e59501, -66px 66px #e59501, -67px 67px #e59501, -68px 68px #e59501, -69px 69px #e59501, -70px 70px #e59501, -71px 71px #e59501, -72px 72px #e59501, -73px 73px #e59501, -74px 74px #e59501, -75px 75px #e59501, -76px 76px #e59501, -77px 77px #e59501, -78px 78px #e59501, -79px 79px #e59501, -80px 80px #e59501, -81px 81px #e59501, -82px 82px #e59501, -83px 83px #e59501, -84px 84px #e59501, -85px 85px #e59501; }\r\n    .button-longshadow-left.button-highlight:active, .button-longshadow-left.button-highlight.active, .button-longshadow-left.button-highlight.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow-left.button-caution {\r\n    text-shadow: 0px 0px #ff1022, -1px 1px #ff1022, -2px 2px #ff1022, -3px 3px #ff1022, -4px 4px #ff1022, -5px 5px #ff1022, -6px 6px #ff1022, -7px 7px #ff1022, -8px 8px #ff1022, -9px 9px #ff1022, -10px 10px #ff1022, -11px 11px #ff1022, -12px 12px #ff1022, -13px 13px #ff1022, -14px 14px #ff1022, -15px 15px #ff1022, -16px 16px #ff1022, -17px 17px #ff1022, -18px 18px #ff1022, -19px 19px #ff1022, -20px 20px #ff1022, -21px 21px #ff1022, -22px 22px #ff1022, -23px 23px #ff1022, -24px 24px #ff1022, -25px 25px #ff1022, -26px 26px #ff1022, -27px 27px #ff1022, -28px 28px #ff1022, -29px 29px #ff1022, -30px 30px #ff1022, -31px 31px #ff1022, -32px 32px #ff1022, -33px 33px #ff1022, -34px 34px #ff1022, -35px 35px #ff1022, -36px 36px #ff1022, -37px 37px #ff1022, -38px 38px #ff1022, -39px 39px #ff1022, -40px 40px #ff1022, -41px 41px #ff1022, -42px 42px #ff1022, -43px 43px #ff1022, -44px 44px #ff1022, -45px 45px #ff1022, -46px 46px #ff1022, -47px 47px #ff1022, -48px 48px #ff1022, -49px 49px #ff1022, -50px 50px #ff1022, -51px 51px #ff1022, -52px 52px #ff1022, -53px 53px #ff1022, -54px 54px #ff1022, -55px 55px #ff1022, -56px 56px #ff1022, -57px 57px #ff1022, -58px 58px #ff1022, -59px 59px #ff1022, -60px 60px #ff1022, -61px 61px #ff1022, -62px 62px #ff1022, -63px 63px #ff1022, -64px 64px #ff1022, -65px 65px #ff1022, -66px 66px #ff1022, -67px 67px #ff1022, -68px 68px #ff1022, -69px 69px #ff1022, -70px 70px #ff1022, -71px 71px #ff1022, -72px 72px #ff1022, -73px 73px #ff1022, -74px 74px #ff1022, -75px 75px #ff1022, -76px 76px #ff1022, -77px 77px #ff1022, -78px 78px #ff1022, -79px 79px #ff1022, -80px 80px #ff1022, -81px 81px #ff1022, -82px 82px #ff1022, -83px 83px #ff1022, -84px 84px #ff1022, -85px 85px #ff1022; }\r\n    .button-longshadow-left.button-caution:active, .button-longshadow-left.button-caution.active, .button-longshadow-left.button-caution.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n  .button-longshadow-left.button-royal {\r\n    text-shadow: 0px 0px #5246e2, -1px 1px #5246e2, -2px 2px #5246e2, -3px 3px #5246e2, -4px 4px #5246e2, -5px 5px #5246e2, -6px 6px #5246e2, -7px 7px #5246e2, -8px 8px #5246e2, -9px 9px #5246e2, -10px 10px #5246e2, -11px 11px #5246e2, -12px 12px #5246e2, -13px 13px #5246e2, -14px 14px #5246e2, -15px 15px #5246e2, -16px 16px #5246e2, -17px 17px #5246e2, -18px 18px #5246e2, -19px 19px #5246e2, -20px 20px #5246e2, -21px 21px #5246e2, -22px 22px #5246e2, -23px 23px #5246e2, -24px 24px #5246e2, -25px 25px #5246e2, -26px 26px #5246e2, -27px 27px #5246e2, -28px 28px #5246e2, -29px 29px #5246e2, -30px 30px #5246e2, -31px 31px #5246e2, -32px 32px #5246e2, -33px 33px #5246e2, -34px 34px #5246e2, -35px 35px #5246e2, -36px 36px #5246e2, -37px 37px #5246e2, -38px 38px #5246e2, -39px 39px #5246e2, -40px 40px #5246e2, -41px 41px #5246e2, -42px 42px #5246e2, -43px 43px #5246e2, -44px 44px #5246e2, -45px 45px #5246e2, -46px 46px #5246e2, -47px 47px #5246e2, -48px 48px #5246e2, -49px 49px #5246e2, -50px 50px #5246e2, -51px 51px #5246e2, -52px 52px #5246e2, -53px 53px #5246e2, -54px 54px #5246e2, -55px 55px #5246e2, -56px 56px #5246e2, -57px 57px #5246e2, -58px 58px #5246e2, -59px 59px #5246e2, -60px 60px #5246e2, -61px 61px #5246e2, -62px 62px #5246e2, -63px 63px #5246e2, -64px 64px #5246e2, -65px 65px #5246e2, -66px 66px #5246e2, -67px 67px #5246e2, -68px 68px #5246e2, -69px 69px #5246e2, -70px 70px #5246e2, -71px 71px #5246e2, -72px 72px #5246e2, -73px 73px #5246e2, -74px 74px #5246e2, -75px 75px #5246e2, -76px 76px #5246e2, -77px 77px #5246e2, -78px 78px #5246e2, -79px 79px #5246e2, -80px 80px #5246e2, -81px 81px #5246e2, -82px 82px #5246e2, -83px 83px #5246e2, -84px 84px #5246e2, -85px 85px #5246e2; }\r\n    .button-longshadow-left.button-royal:active, .button-longshadow-left.button-royal.active, .button-longshadow-left.button-royal.is-active {\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4); }\r\n\r\n/*\r\n* Button Sizes\r\n*\r\n* This file creates the various button sizes\r\n* (ex. .button-large, .button-small, etc.)\r\n*/\r\n.button-giant {\r\n  font-size: 28px;\r\n  height: 70px;\r\n  line-height: 70px;\r\n  padding: 0 70px; }\r\n\r\n.button-jumbo {\r\n  font-size: 24px;\r\n  height: 60px;\r\n  line-height: 60px;\r\n  padding: 0 60px; }\r\n\r\n.button-large {\r\n  font-size: 20px;\r\n  height: 50px;\r\n  line-height: 50px;\r\n  padding: 0 50px; }\r\n\r\n.button-normal {\r\n  font-size: 16px;\r\n  height: 40px;\r\n  line-height: 40px;\r\n  padding: 0 40px; }\r\n\r\n.button-small {\r\n  font-size: 12px;\r\n  height: 30px;\r\n  line-height: 30px;\r\n  padding: 0 30px; }\r\n\r\n.button-tiny {\r\n  font-size: 9.6px;\r\n  height: 24px;\r\n  line-height: 24px;\r\n  padding: 0 24px; }", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "* {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nhtml,\r\nbody {\r\n    height: 100%;\r\n    width: 100%;\r\n}\r\n\r\nli {\r\n    width: 120px;\r\n    display: inline-block;\r\n    position: relative;\r\n}\r\n\r\nselect {\r\n    position: absolute;\r\n    right: 0;\r\n    height: 70%;\r\n    top: 15%;\r\n    border: 1px solid #3498db;\r\n    border-radius: 5px;\r\n}\r\n\r\n.labelauty {\r\n    display: none;\r\n}\r\n\r\n#toolbox {\r\n    width: 1000px;\r\n    height: 50px;\r\n    border: 1px solid transparent\r\n}\r\n\r\ncanvas {\r\n    cursor: default;\r\n}\r\n\r\n.db_canvas {\r\n    border: 1px solid black;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.db_add_canvas{\r\n    position: absolute;\r\n    left: 0;\r\n}\r\n\r\n#colorpicker {\r\n    background-color: white;\r\n    position: absolute;\r\n    display: none;\r\n    width: 650px;\r\n    height: 400px;\r\n    overflow: hidden;\r\n    -moz-box-shadow: 8px 8px 10px #333333;\r\n    -webkit-box-shadow: 8px 8px 10px #333333;\r\n    box-shadow: 8px 8px 10px #333333;\r\n}\r\n\r\n.dowebok {\r\n    position: relative;\r\n    top: 5px;\r\n    width: 100%;\r\n    height: 40px;\r\n}\r\n\r\n.canvas1 {\r\n    width: 400px;\r\n    height: 400px;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    background-color: red;\r\n    overflow: hidden;\r\n}\r\n\r\n.ver {\r\n    background: linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0));\r\n}\r\n\r\n.hiz {\r\n    background: linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0))\r\n}\r\n\r\n#colorpicker_canvas2 {\r\n    position: absolute;\r\n    left: 410px;\r\n}\r\n\r\n#control {\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n    height: 400px;\r\n    width: 200px;\r\n    display: inline-block;\r\n}\r\n\r\n.colorpickerLabel {\r\n    display: block;\r\n    width: 100%;\r\n    height: 30px;\r\n}\r\n\r\n.testTxt {\r\n    float: right;\r\n    width: 100px;\r\n    -webkit-border-radius: 3px;\r\n    -moz-border-radius: 3px;\r\n    border-radius: 3px;\r\n    height: 25px;\r\n    font-size: 15px;\r\n    border: 1px solid #cccccc;\r\n    outline: none;\r\n    color: #808080;\r\n}\r\n\r\n.green:focus {\r\n    transition: border linear .2s, box-shadow linear .5s;\r\n    -moz-transition: border linear .2s, -moz-box-shadow linear .5s;\r\n    -webkit-transition: border linear .2s, -webkit-box-shadow linear .5s;\r\n    outline: none;\r\n    border-color: rgba(19, 105, 172, .75);\r\n    box-shadow: 0 0 3px rgba(19, 105, 192, .5);\r\n    -moz-box-shadow: 0 0 3px rgba(241, 39, 232, .5);\r\n    -webkit-box-shadow: 0 0 3px rgba(19, 105, 252, 3);\r\n}\r\n\r\n.circle {\r\n    height: 18px;\r\n    width: 18px;\r\n    background-color: transparent;\r\n    box-sizing: border-box;\r\n    border: 3px solid black;\r\n    position: absolute;\r\n    border-radius: 50%;\r\n    z-index: 99;\r\n}\r\n\r\n.circle1 {\r\n    top: 0;\r\n    left: 0;\r\n}\r\n\r\n.circle2 {\r\n    top: 0;\r\n    left: 410px;\r\n}\r\n\r\n#RGBtype,\r\n#HSLtype {\r\n    margin-top: 20px;\r\n    width: 120px;\r\n}\r\n\r\nol,\r\nul {\r\n    list-style: none\r\n}\r\n\r\nblockquote,\r\nq {\r\n    quotes: none\r\n}\r\n\r\nblockquote:before,\r\nblockquote:after,\r\nq:before,\r\nq:after {\r\n    content: '';\r\n    content: none\r\n}\r\n\r\n:focus {\r\n    outline: 0\r\n}\r\n\r\nins {\r\n    text-decoration: none\r\n}\r\n\r\ndel {\r\n    text-decoration: line-through\r\n}\r\n\r\ntable {\r\n    border-collapse: collapse;\r\n    border-spacing: 0\r\n}\r\n\r\na {\r\n    text-decoration: none;\r\n    color: #fff\r\n}\r\n\r\nbody {\r\n    font-family: \"Kreon\";\r\n    font-weight: 300;\r\n    color: #333\r\n}\r\n\r\n\r\n/*!\r\n * LABELAUTY jQuery Plugin Styles\r\n *\r\n * @file: jquery-labelauty.css\r\n * @author: Francisco Neves (@fntneves)\r\n * @site: www.francisconeves.com\r\n * @license: MIT License\r\n */\r\n\r\n\r\n/* Prevent text and blocks selection */\r\n\r\ninput.labelauty + label::selection {\r\n    background-color: rgba(255, 255, 255, 0);\r\n}\r\n\r\ninput.labelauty + label::-moz-selection {\r\n    background-color: rgba(255, 255, 255, 0);\r\n}\r\n\r\n\r\n/* Hide original checkboxes. They are ugly! */\r\n\r\ninput.labelauty {\r\n    display: none !important;\r\n}\r\n\r\n\r\n/*\r\n * Let's style the input\r\n * Feel free to work with it as you wish!\r\n */\r\n\r\ninput.labelauty + label {\r\n    display: table;\r\n    font-size: 11px;\r\n    padding: 10px;\r\n    background-color: #efefef;\r\n    color: #b3b3b3;\r\n    cursor: pointer;\r\n    border-radius: 3px 3px 3px 3px;\r\n    -moz-border-radius: 3px 3px 3px 3px;\r\n    -webkit-border-radius: 3px 3px 3px 3px;\r\n    transition: background-color 0.25s;\r\n    -moz-transition: background-color 0.25s;\r\n    -webkit-transition: background-color 0.25s;\r\n    -o-transition: background-color 0.25s;\r\n    -moz-user-select: none;\r\n    -khtml-user-select: none;\r\n    -webkit-user-select: none;\r\n    -o-user-select: none;\r\n}\r\n\r\n\r\n/* Stylish text inside label */\r\n\r\ninput.labelauty + label > span.labelauty-unchecked,\r\ninput.labelauty + label > span.labelauty-checked {\r\n    display: inline-block;\r\n    line-height: 16px;\r\n    vertical-align: bottom;\r\n}\r\n\r\n\r\n/* Stylish icons inside label */\r\n\r\ninput.labelauty + label > span.labelauty-unchecked-image,\r\ninput.labelauty + label > span.labelauty-checked-image {\r\n    display: inline-block;\r\n    width: 16px;\r\n    height: 16px;\r\n    vertical-align: bottom;\r\n    background-repeat: no-repeat;\r\n    background-position: left center;\r\n    transition: background-image 0.5s linear;\r\n    -moz-transition: background-image 0.5s linear;\r\n    -webkit-transition: background-image 0.5s linear;\r\n    -o-transition: background-image 0.5s linear;\r\n}\r\n\r\n\r\n/* When there's a label, add a little margin to the left */\r\n\r\ninput.labelauty + label > span.labelauty-unchecked-image + span.labelauty-unchecked,\r\ninput.labelauty + label > span.labelauty-checked-image + span.labelauty-checked {\r\n    margin-left: 7px;\r\n}\r\n\r\n\r\n/* When not Checked */\r\n\r\ninput.labelauty:not(:checked):not([disabled]) + label:hover {\r\n    background-color: #eaeaea;\r\n    color: #a7a7a7;\r\n}\r\n\r\ninput.labelauty:not(:checked) + label > span.labelauty-checked-image {\r\n    display: none;\r\n}\r\n\r\ninput.labelauty:not(:checked) + label > span.labelauty-checked {\r\n    display: none;\r\n}\r\n\r\n\r\n/* When Checked */\r\n\r\ninput.labelauty:checked + label {\r\n    background-color: #3498db;\r\n    color: #ffffff;\r\n}\r\n\r\ninput.labelauty:checked:not([disabled]) + label:hover {\r\n    background-color: #72c5fd;\r\n}\r\n\r\ninput.labelauty:checked + label > span.labelauty-unchecked-image {\r\n    display: none;\r\n}\r\n\r\ninput.labelauty:checked + label > span.labelauty-unchecked {\r\n    display: none;\r\n}\r\n\r\ninput.labelauty:checked + label > span.labelauty-checked {\r\n    display: inline-block;\r\n}\r\n\r\ninput.labelauty.no-label:checked + label > span.labelauty-checked {\r\n    display: block;\r\n}\r\n\r\n\r\n/* When Disabled */\r\n\r\ninput.labelauty[disabled] + label {\r\n    opacity: 0.5;\r\n}\r\n\r\n#layersOption {\r\n    height: auto;\r\n    width: 200px;\r\n    position: absolute;\r\n    right: 50px;\r\n    bottom: 0;\r\n}\r\n\r\n#layersOption li {\r\n    line-height: 50px;\r\n    text-align: right;\r\n    height: 50px;\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n    border: 1px solid #9E9C9E;\r\n    background-color: #F1EFF1;padding-right: 10px;padding-left: 10px;cursor:pointer;\r\n}\r\n#layersOption li span{\r\n    float: left;\r\n    line-height: 50px;\r\n    letter-spacing: 10px;\r\n    color: grey;\r\n}", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./button.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./button.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAACXBIWXMAAA7EAAAOxAGVKw4bAAA54GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTctMDMtMTFUMTA6NTc6NTArMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNy0wMy0xMlQxMjoyNzo1MCswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTctMDMtMTJUMTI6Mjc6NTArMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6ZWEzOWY0NmUtMjMwOS1hZjRiLTkyMzgtMDE5YjBiYjUyMzlmPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOjJkNmEwMmNjLWI2MjktZjc0MS05YTI5LThmYmJmNzRlMDg3NDwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOjJkNmEwMmNjLWI2MjktZjc0MS05YTI5LThmYmJmNzRlMDg3NDwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDoyZDZhMDJjYy1iNjI5LWY3NDEtOWEyOS04ZmJiZjc0ZTA4NzQ8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTctMDMtMTFUMTA6NTc6NTArMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ZWEzOWY0NmUtMjMwOS1hZjRiLTkyMzgtMDE5YjBiYjUyMzlmPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE3LTAzLTEyVDEyOjI3OjUwKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+OTYwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj45NjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjE2MDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNjA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PqHNO4AAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAlpJREFUeNrs2sFtxDAMRUH3X5vurEI1aCuwZdgAiaUnQG6ZHD7eydSxNj8Rcfo751w8/8Yfu38wxjj9jYjF82+8AHkB8gI0IC9AXoAG5AXIfyjAiLj8ozvfeXj+qRcgL0BegAbkBcgL0IC8APkPBTjnvHwys/vh+Tf+uFO492y894C8U5wBeQHyAjQgL0BegAbkBcj/d4C+5PNOcbwADcgLkBegAXkB8gI0IO89IN/eew/Il3qXEN4pjhegAXkB8gI0IC9AXoAG5HMC9CWfd4rjBWhAXoC8AA3IC5AXoAF57wH59t57QL7Uu4TwTnG8AA3IC5AXoAF5AfICNCCfE6Av+bxTHC9AA/IC5AVoQF6AvAANyHsPyLf33gPypd4lhHeK4wVoQF6AvAANyAuQF6AB+ZwAfcnnneJ4ARqQFyAvQAPyAuQFaEDee0C+vfcekC/1LiG8UxwvQAPyAuQFaEBegLwADcjnBOhLPu8UxwvQgLwAeQEakBcgL0AD8t4D8u2994B8qXcJ4Z3ieAEakBcgL0AD8gLkBWhAPidAX/J5pzhegAbkBcgL0IC8AHkBGpD3HpBv770H5Eu9SwjvFMcL0IC8AHkBGpAXIC9AA/I5AfqSzzvF8QI0IC9AXoAG5AXIC9CAvPeAfHvvPSBf6l1CeKc4XoAG5AXIC9CAvAB5ARqQzwnQl3zeKY4XoAF5AfICNCAvQF6ABuS9B+Tbe+8B+VLvEsI7xfECNCAvQF6ABuQFyAvQgHxOgL7k805xvAANyAuQF6ABeQHyAjQg7z0g397/AAAA//8DAOb5WfcI1rgvAAAAAElFTkSuQmCC"

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);