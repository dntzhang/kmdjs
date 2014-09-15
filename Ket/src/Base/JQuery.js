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
        this.firstElement = this.elements[0];
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
    data: function (key, value) {
        this.each(function () {
            Dom.data(this, key, value);
        })
        return this;
    },
    removeData: function ( key) {
        this.each(function () {
            Dom.data(this, key);
        })
        return this;
    },
    attr: function ( name, value) {
        if (value) {
            this.each(function () {
                Dom.attr(this, name, value);
            })
        } else {
            this.each(function () {
                Dom.attr(this, name);
            })
        }

        return this;
    },
    removeAttr: function (name) {
        this.each(function () {
            Dom.removeAttr(this, name);
        })
        return this;
    },
    addClass: function (name) {
        this.each(function () {
            Dom.addClass(this, name);
        })
        return this;
    },
    removeClass: function ( name) {
        this.each(function () {
            Dom.removeClass(this, name);
        })
        return this;
    },
    toggleClass: function (name) {
        this.each(function () {
            Dom.toggleClass(this, name);
        })
        return this;
    },
    html: function (html) {
        if (html) {
            this.each(function () {
                Dom.html(this, html);
            })
            return this;
        } else {
            return Dom.html(this.firstElement);
        }
    },
    text: function ( text) {
        if (text) {
            this.each(function () {
                Dom.text(this, text);
            })
            return this;
        } else {
            return Dom.text(this.firstElement);
        }
    },
    val: function ( value) {
        if (value) {
            this.each(function () {
                Dom.val(this, value);
            })
            return this;
        } else {
            return Dom.val(this.firstElement);
        }
    },





    offset: function (node) {
        return Dom.offset(this.firstElement);
    },
    position: function (node) {
        return Dom.position(this.firstElement);
    },
    scrollLeft: function (value) {
        if (arguments.length == 0) return Dom.scrollLeft(this.firstElement);

        this.each(function () {
            Dom.scrollLeft(this, value);
        })
        return this;
    },
    scrollTop: function (node, val) {
        if (arguments.length == 0) return Dom.scrollTop(this.firstElement);

        this.each(function () {
            Dom.scrollTop(this, value);
        })
        return this;
    },
    innerHeight: function (node) {
        return Dom.innerHeight(this.firstElement);
        
    },
    innerWidth: function (node) {
        return Dom.innerWidth(this.firstElement);
    },
    outerHeight: function (node) {

        return Dom.outerHeight(this.firstElement);
    },
    outerWidth: function (node) {
        return Dom.outerWidth(this.firstElement);
    },


    append: function ( child) {
        Dom.append(this.firstElement, child);
        return this;
    },
    prepend: function (parent, child) {
        Dom.prepend(this.firstElement, child);
        return this;
    },
    remove: function () {
        this.each(function () {
            Dom.remove(this);
        })
    },


    on: function ( type, fn) {
        this.each(function () {
            Dom.on(this,type,fn);
        })
        return this;
    },
    off: function ( type, fn) {
        this.each(function () {
            Dom.off(this, type, fn);
        })
        return this;
    },
    one: function (node, type, fn) {
        this.each(function () {
            Dom.one(this, type, fn);
        })
        return this;
    },

    //    params,[speed],[easing],[fn]Options,Number/String,String,FunctionV1.0
    //    params:一组包含作为动画属性和终值的样式属性和及其值的集合
    //    speed:三种预定速度之一的字符串("slow","normal", or "fast")或表示动画时长的毫秒数值(如：1000)
    //    easing:要使用的擦除效果的名称(需要插件支持).默认jQuery提供"linear" 和 "swing".
    //    fn:在动画完成时执行的函数，每个元素执行一次。
    animate: function (option) {
        this.each(function () {
            Dom.animate(this, option);
        })
        return this;
    },
    stop: function (jumpToEnd) {
        this.each(function () {
            Dom.stop(this, jumpToEnd);
        })
        return this;
    }


})