define("Ket.Base.Jquery",{
    statics: {
        mock: function () {
            var self = this;
            var $= function (selector) {
                return new self(selector);
            };
            $.ajax = Http.ajax;
            return $;
        }
    },
    init: function (selector) {
        this.elements = Dom.query(selector);
     
        this.length=  this.elements.length;
    },
    css: function (styleName, value) {
     
        this.each(function () {
            Dom.setStyle(this, styleName, value);
        });
        return this;
    },
    html: function (html) {
        this.each(function (index, element) {
            element.innerHTML = html;
        });
    },
    each: function (fn) {
        for (var i = 0; i < this.length; i++) {
            fn.call(this.elements[i], i, this.elements[i]);
        }
        return this;
    },
//    params,[speed],[easing],[fn]Options,Number/String,String,FunctionV1.0
//    params:一组包含作为动画属性和终值的样式属性和及其值的集合

//speed:三种预定速度之一的字符串("slow","normal", or "fast")或表示动画时长的毫秒数值(如：1000)

//easing:要使用的擦除效果的名称(需要插件支持).默认jQuery提供"linear" 和 "swing".

//    fn:在动画完成时执行的函数，每个元素执行一次。

//    function animate(elem,style,unit,from,to,time) {
//    if( !elem) return;
//var start = new Date().getTime(),
//    timer = setInterval(function() {
//        var step = Math.min(1,(new Date().getTime()-start)/time);
//        elem.style[style] = (from+step*(to-from))+unit;
//        if( step == 1) clearInterval(timer);
//    },25);
//elem.style[style] = from+unit;
//}
//To use:

//    animate(
//        document.getElementById('challengeOneImageJavascript'),
//        "left","px",0,200,1000
    //    );
    //写一个方法提取属性的单位
    animate: function (params,speed,easing,fn) {
        
    }


})