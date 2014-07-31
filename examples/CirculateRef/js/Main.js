kmdjs.config({
    name: "HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.A" },
        { name: "HelloKMD.B" },
        { name: "HelloKMD.C" },
        { name: "HelloKMD.D" }
    ]

});
define("Main", {
    ctor: function () {
        var b = new B(2);
        b.test();
        console.log(b.c.y)

    }
})
