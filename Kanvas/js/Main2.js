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
          { name: "Kanvas.Wheel" },
          {name:"Kanvas.Shape"}
    ]
});

define("Main", ["Kanvas", "Kanvas.Shape"], {
    ctor: function () {

        var stage = new Stage("#ourCanvas");
        stage.scalable();
        var circle = new Circle(10, "red");
        circle.x=300;
        circle.y = 200;
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
      
        var sp = new Shape();
        sp.beginPath().arc(377 / 4, 391 / 4, 140 / 4, 0, Math.PI * 2).closePath().fillStyle('#f4862c').fill().strokeStyle("#046ab4").lineWidth(8 / 4).stroke().beginPath().moveTo(298 / 4, 506 / 4).bezierCurveTo(236 / 4, 396 / 4, 302 / 4, 272 / 4, 407 / 4, 254 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(328 / 4, 258 / 4).bezierCurveTo(360 / 4, 294 / 4, 451 / 4, 272 / 4, 503 / 4, 332 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(282 / 4, 288 / 4).bezierCurveTo(391 / 4, 292 / 4, 481 / 4, 400 / 4, 488 / 4, 474 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(242 / 4, 352 / 4).bezierCurveTo(352 / 4, 244 / 4, 319 / 4, 423 / 4, 409 / 4, 527 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke();

        stage.add(sp);
        stage.update();
    }
})
