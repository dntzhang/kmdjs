kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Ball"  },
        { name: "Util.Bom", url: "Util" },
        { name: "Util.Vector2", url: "Util" }
    ],
    //input any module that you want to build
    build: ["HelloKMD.Ball"]

});
define("Main", {
    ctor: function () {

    }
})
