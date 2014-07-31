define("B", {
    ctor: function (y) {
        this.y = y;
       
    },
    test: function () {
        this.c = new C(1);
        this.c.test();
        alert(1)
        this.d = new D();
    }
})
