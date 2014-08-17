kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Ball"  },
        { name: "Util.Bom", url: "Util" },
        { name: "Util.Vector2", url: "Util" }
    ],
    build:["HelloKMD.Ball", "Util.Bom"]

});
define("Main", {
    ctor: function () {

    }
})
