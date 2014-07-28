define("Ket.Base.Jquery",["Ket.Util"],{
    statics: {
        init: function () {
            (function () {
                var lastTime = 0;
                var vendors = ['ms', 'moz', 'webkit', 'o'];
                for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                               || window[vendors[x] + 'CancelRequestAnimationFrame'];
                }

                if (!window.requestAnimationFrame)
                    window.requestAnimationFrame = function (callback, element) {
                        var currTime = new Date().getTime();
                        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                        var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                          timeToCall);
                        lastTime = currTime + timeToCall;
                        return id;
                    };

                if (!window.cancelAnimationFrame)
                    window.cancelAnimationFrame = function (id) {
                        clearTimeout(id);
                    };
            }());
         
        },
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
    tick: function () {
        var self = this;
        function animate(time) {
            self.loop = requestAnimationFrame(animate); // js/RequestAnimationFrame.js needs to be included too.
            TWEEN.update(time);
        }
        animate();
    },
    animate: function (params, speed, easing, fn) {
        if (easing!==undefined) {
            if (typeof easing != "string" && arguments.length == 3) {
                var fn = easing;
            } else {
                if (easing && easing.split("-").length > 1) {
                    var eArr = easing.split("-")
                    easing = TWEEN.Easing[eArr[0]][eArr[1]]
                } else {
                    easing = TWEEN.Easing.Linear.None;
                }
            }
        }
        var datas = [];
        this.tick()
        var self = this;
        this.each(function (index, element) {
            var data = {};
            data.element = element;
            data.mapping = {};
            data.begin = {};
            data.end = {};
            for (var prop in params) {
                var value = Dom.getStyle(element, prop);
                if (value == "auto") {
                    data.begin[prop] = 0;
                    //计算offset？？
                    data.mapping[prop] = "px";

                } else {
                    data.begin[prop] = parseFloat(value);
                    data.mapping[prop] = value.replace(/\d|\./g, "");

                }

                data.end[prop] = parseFloat(params[prop]);
            }
            datas.push(data);
        });

        var i, len = datas.length,count=0;
        for ( i = 0; i < len; i++) {
            var item = datas[i];
            (function (item) {
                new TWEEN.Tween(item.begin)
              .to(item.end, speed)
              .easing(easing)
              .onUpdate(function () {
                  var j;
                  for (j in item.end) {
                      Dom.setStyle(item.element, j, this[j] + item.mapping[j]);
                  }
              })
              .onComplete(function () {
                  count++
                  cancelAnimationFrame(self.loop);
                  if (fn && count==len) fn();
              })
              .start();
            })(item)
        }


    }


})