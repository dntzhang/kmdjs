kmdjs.config({
    name: "HelloKanvas",
    baseUrl: "js",
    classes: [
          { name: "Kanvas.DisplayObject" },
          { name: "Kanvas.Bitmap" },
          { name: "Kanvas.Txt" },
          { name: "Kanvas.Stage" },
          { name: "Kanvas.Container" },
          { name: "Kanvas.Matrix2D" },
          { name: "Kanvas.Shape.Circle" }
    ],
    build: ["Kanvas.DisplayObject", "Kanvas.Bitmap", "Kanvas.Txt", "Kanvas.Stage", "Kanvas.Container", "Kanvas.Matrix2D","Kanvas.Shape.Circle"]
});

define("Main", ["Kanvas", "Kanvas.Shape"], {
    ctor: function () {
    }
})
