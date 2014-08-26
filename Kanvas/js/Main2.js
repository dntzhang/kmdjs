kmdjs.config({
    name: "HelloKanvas",
    baseUrl: "js",
    classes: [
          { name: "Kanvas.DisplayObject" },
          { name: "Kanvas.Txt" },
          { name: "Kanvas.Stage" },
          { name: "Kanvas.Container" },
          { name: "Kanvas.Matrix2D" },
          { name: "Kanvas.Shape.Circle" },
          { name: "Kanvas.Loader" },
          { name: "Kanvas.RAF" },
          { name: "Kanvas.UID" },
          { name: "Kanvas.UI.Button" },
          { name: "Kanvas.UI.ShapeButton" },
          { name: "Kanvas.TWEEN" },
          { name: "Kanvas.Wheel" }
    ]
});

define("Main", ["Kanvas", "Kanvas.Shape"], {
    ctor: function () {

        var stage = new Stage("#ourCanvas");
        stage.scalable();
        var circle = new Circle(10, "red");
        circle.x=100;
        circle.y = 100;
        circle.hover(function () {
            this.scaleX = this.scaleY = 1.2;
            stage.update();
        }, function () {
            this.scaleX = this.scaleY = 1;
            stage.update();
        })
        var circle2 = new Circle(10, "green");
        circle2.x = 200;
        circle2.y = 130;
        stage.add(circle, circle2);
        stage.update();
 
    }
})
