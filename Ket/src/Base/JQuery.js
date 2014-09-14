define("Base.JQuery",["Util"], {
    statics: {
        mock: function () {
            var self = this;
            var $ = function (selector) {
                return new self(selector);
            };

            $.ajax = Http.ajax;
            $.tirm = Helper.tirm;
            $.each = Helper.each;            $.isArray = Helper.isArray;            $.type = Helper.type;
            return $;
        }
    },
    ctor: function (selector, context) {
        this.elements = Dom.queryAll(selector, context);
        this.length = this.elements.length;
        var self = this;
        Helper.each(this.elements, function (i, element) {        
            self[i] = element;
        });
    },
    css: function (styleName, value) {

        this.each(function () {
            Dom.css(this, styleName, value);
        });
        return this;
    },
    html: function (html) {
        this.each(function () {
            
            Dom.html(this, html);
        });
        return this;
    },
    each: function (fn) {
        for (var i = 0; i < this.length; i++) {
            fn.call(this.elements[i], i, this.elements[i]);
        }
        return this;
    },
    //    params,[speed],[easing],[fn]Options,Number/String,String,FunctionV1.0
    //    params:一组包含作为动画属性和终值的样式属性和及其值的集合
    //    speed:三种预定速度之一的字符串("slow","normal", or "fast")或表示动画时长的毫秒数值(如：1000)
    //    easing:要使用的擦除效果的名称(需要插件支持).默认jQuery提供"linear" 和 "swing".
    //    fn:在动画完成时执行的函数，每个元素执行一次。
    animate: function (params, speed, easing, fn) {
     

    }


})