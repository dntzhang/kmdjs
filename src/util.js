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