define("Timer", {
    ctor: function (ctx) {
        this.ctx = ctx;
        this.value = 1;
        var self = this;
        RAF.requestInterval(function () {
            self.value++;
        }, 1000);



    },
    render: function () {
       
        this.ctx.fillStyle = "Black";
        this.ctx.fillText(this.value,180,20)
        this.ctx.fill();
    },
    tick: function () {
        this.render();
    }
})
