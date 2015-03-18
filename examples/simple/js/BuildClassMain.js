kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Ball" },
        { name: "Util.Bom",url:"Util" }
    ],
    build: ["HelloKMD.Ball"]
});
define("Main",["Util"], {
    ctor: function () {
    }
})
