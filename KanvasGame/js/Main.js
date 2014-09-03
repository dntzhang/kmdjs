kmdjs.config({
    name: "KanvasGame",
    baseUrl: "js",
    deps: [
        {
            url: "Kanvas.js",
            classes: [
                  { name: "Kanvas.DisplayObject" },
                  { name: "Kanvas.Bitmap" },
                  { name: "Kanvas.Txt" },
                  { name: "Kanvas.Stage" },
                  { name: "Kanvas.Container" },
                  { name: "Kanvas.Matrix2D" },
                  { name: "Kanvas.Shape.Circle" },
                  { name: "Kanvas.Sprite" },
                  { name: "Kanvas.Loader" },
                  { name: "Kanvas.RAF" },
                  { name: "Kanvas.UID" },
                  { name: "Kanvas.UI.Button" },
                  { name: "Kanvas.UI.ShapeButton" },
                  { name: "Kanvas.TWEEN" },
                  { name: "Kanvas.Shape" }
            ]
        }
    ],
    classes: [
         { name: "KanvasGame.Util" },
         { name: "KanvasGame.MainPanel" },
         { name: "KanvasGame.Game" },
         { name: "KanvasGame.Data" },
         { name: "KanvasGame.GamePanel" },
         { name: "KanvasGame.SmallBall" },
         { name: "KanvasGame.Ball" },
         { name: "KanvasGame.Vector2" },
         { name: "KanvasGame.RAF" } 
    ]
});

define("Main", {
    ctor: function () {
        Game.init();
      

    }
})