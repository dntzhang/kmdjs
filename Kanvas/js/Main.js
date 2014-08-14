kmdjs.config({
    name: "HelloKanvas",
    baseUrl: "js",
    classes: [
          { name: "Kanvas.DisplayObject" },
          { name: "Kanvas.Bitmap" },
          { name: "Kanvas.Txt" },
          { name: "Kanvas.Shape" },
          { name: "Kanvas.Stage" },
          { name: "Kanvas.Container" },
          { name: "Kanvas.Matrix2D" }
    ]
});

define("Main", ["Kanvas"], {
    ctor: function () {     
        var stage = new Stage("#ourCanvas");
        var text = new Txt("Hello Kanvas!", "bold 36px Arial", "green");
        text.x = 140;
        text.y = 100;
        text.regX = 100;
        text.regY = 20;
        text.skewX = 30;
        text.skewY = -10;
        text.rotation = 20;
        text.scaleX = 1.5;
        text.scaleY = 2;
        stage.add(text);
        stage.update();
    }
})
