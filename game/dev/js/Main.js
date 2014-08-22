kmdjs.config({
    name:"KmdGame",
    baseUrl: "js",
    classes: [
        { name: "KmdGame.Ball" },
        { name: "KmdGame.SmallBall" },
        { name: "KmdGame.Timer" },    
        { name: "KmdGame.RAF" },
        { name: "KmdGame.Util" },
        { name: "KmdGame.Timer" },
        { name: "KmdGame.Vector2" },
        { name: "KmdGame.Game" }
    ]
});

define("Main", {
    ctor: function () {
        Game.init();
    }
})
