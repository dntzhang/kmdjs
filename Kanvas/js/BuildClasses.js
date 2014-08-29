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
          { name: "Kanvas.Shape.Circle" },
          { name: "Kanvas.Sprite" },
          { name: "Kanvas.Loader" },
          { name: "Kanvas.RAF" },
          { name: "Kanvas.UID" },
          { name: "Kanvas.UI.Button" },
          { name: "Kanvas.UI.ShapeButton" },
          { name: "Kanvas.TWEEN" },
          { name: "Kanvas.Shape" }
    ],
    build: [
           "Kanvas.DisplayObject",
           "Kanvas.Bitmap",
           "Kanvas.Txt",
           "Kanvas.Stage",
           "Kanvas.Container",
           "Kanvas.Matrix2D",
           "Kanvas.Shape.Circle",
           "Kanvas.Sprite",
           "Kanvas.Loader",
           "Kanvas.RAF",
           "Kanvas.UID",
           "Kanvas.UI.Button",
           "Kanvas.UI.ShapeButton",
           "Kanvas.TWEEN",
           "Kanvas.Shape"
    ]
});

define("Main",{
    ctor: function () { }
})
