define("Ket.Base.Jquery",{
    statics: {
        mock: function () {
            var self = this;
            return function (selector) {
                return new self(selector);
            };
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
    }


})