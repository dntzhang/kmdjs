//http://www.w3.org/TR/2dcontext/#dom-context-2d-filltext
//http://www.w3school.com.cn/tags/canvas_filltext.asp
define("Kanvas.Txt:Kanvas.DisplayObject", {
    ctor: function (text, font, color) {
        this._super();
        this.text = text;
        this.font = font;
        this.color = color;
        this.textAlign = "left";    
        this.textBaseline = "top";
    },
    draw: function (ctx) {
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign || "left";
        ctx.textBaseline = this.textBaseline || "top";
        ctx.fillText(this.text, 0,0);
    },
    clone: function () {
        var t = new Txt(this.text, this.font, this.color);
        this.cloneProps(t);
        return t;

    }
  
})