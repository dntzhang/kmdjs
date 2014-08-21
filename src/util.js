/* KMD.js Kill AMD and CMD
 * By 当耐特 http://weibo.com/iamleizhang
 * Github: https://github.com/kmdjs/kmdjs
 * blog: http://www.cnblogs.com/iamzhanglei/
 * My website:http://htmlcssjs.duapp.com/
 * Many thanks to https://github.com/mishoo/UglifyJS2 
 * MIT Licensed.
 */
; (function () {


function isType(type) {
    return function (obj) {
        return Object.prototype.toString.call(obj) === '[object ' + type + ']'
    }
}

var isObject = isType('Object')
var isString = isType('String')
var isArray = Array.isArray || isType('Array')
var isFunction = isType('Function')
var isBoolean = isType('Boolean')

function remove(arr, item) {
    for (var i = arr.length - 1; i > -1; i--) {
        if (arr[i] == item) {
            arr.splice(i, 1);
            //   break;
        }
    }
}
function each(arry, action) {
    for (var i = arry.length - 1; i > -1; i--) {
        var result = action(arry[i],i);
        if (isBoolean(result) && !result) break;
    }
}

function lastIndexOf(str, word) {
    if (str.lastIndexOf) return str.lastIndexOf(word);
    var len = word.length;
    for (var i = str.length - 1 - len; i > -1; i--) {
        if (word === str.substr(i, len)) {
            return i;
        }
    }
    return -1;
}
function isInArray(arr, item) {
    for (var i = 0, j = arr.length; i < j; i++) {
        if (arr[i] == item) {
            return true;
        }
    }
    return false;
}

function log(msg) {
    try { console.log(msg); } catch (ex) { }
}