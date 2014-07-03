kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Ball"  },
        { name: "Util.Bom", url: "Util" },
        { name: "Util.Vector2", url: "Util" }
    ]

});
define("Main", {
    init: function () {
        kmdjs.build("HelloKMD.Ball");
        //or
        // kmdjs.build("Util.Bom");
        //or
        // kmdjs.build("Util.Vector2");
        //or
        //any module that you want to build
    }
})
