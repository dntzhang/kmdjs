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
    ]
});

define("Main", ["Kanvas","Kanvas.Shape"], {
    ctor: function () {     
        var stage = new Stage("#ourCanvas");
        var text = new Txt("Hello Kanvas!", "bold 36px Arial", "green");
        text.x = 140;
        text.y = 100;
        text.regX = 100;
        text.regY = 20;
        text.skewX = 30;
        text.skewY = -30;
        text.rotation = 20;
        //text.scaleX = 1.5;
        //text.scaleY = 2;
        stage.add(text);
        stage.update();

        var text2 = new Txt("KMD:Kill AMD and CMD!", "bold 26px Arial", "red");
        text2.y = 400;
        text2.on("click", function () {
            alert(this.text);
        });

        var text3 = new Txt("Click Me!", "bold 46px Arial", "blue");
        text3.y = 230;
        text3.x = 50;
        text3.on("click", function () {
            alert(this.text);
        });
       
        var kmdImg = new Image();
        kmdImg.onload = function () {
            var bmp = new Bitmap(kmdImg);
            bmp.x = 100;
            bmp.y = 100;
            stage.add(bmp);
        }
        kmdImg.src = "img/kmd.png";

        var pigImg = new Image(),pgBmp;
        pigImg.onload = function () {
            pgBmp = new Bitmap(pigImg);
            pgBmp.x = 164;
            pgBmp.y = 334;
            pgBmp.regX = 64;
            pgBmp.regY = 64;
            stage.add(pgBmp);
            pgBmp.on("click", function () {
                alert("i am a pig");
            })
        }
        pigImg.src = "img/pig.png";

        stage.add(text2,text3);
        setInterval(function () {
            text.rotation++;
            if (pgBmp) pgBmp.rotation--;
            stage.update();
        }, 15);

        var circle = new Circle(55, "red");
        circle.x = 30;
        circle.y = 30;
        circle.on("click", function () {
            alert("i'm a red ball!")
        })

        var circle2 = new Circle(35, "green");
        circle2.x = 30;
        circle2.y = 30;
        circle2.on("click", function () {
            alert("i'm a green ball!")
        })

        var circle3 = new Circle(18, "yellow");
        circle3.x = 30;
        circle3.y = 30;
        stage.add(circle,circle2,circle3);
    }
})
