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
          {name:"Kanvas.UID"}
    ]
});

define("Main", ["Kanvas","Kanvas.Shape"], {
    ctor: function () {
        var ld = new Loader(), pgBmp ;
        ld.loadRes([
            { id: "kmd", src: "img/kmd.png" },
            { id: "pig", src: "img/pig.png" },
            { id: "hero", src: "img/hero-m.png" }]
            );
        ld.complete(function () {

            var bmp = new Bitmap(ld.get("kmd"));
            bmp.x = 100;
            bmp.y = 100;
            stage.add(bmp);
      

            pgBmp = new Bitmap(ld.get("pig"));
            pgBmp.x = 164;
            pgBmp.y = 334;
            pgBmp.regX = 64;
            pgBmp.regY = 64;
            stage.add(pgBmp);
            pgBmp.on("click", function () {
                alert("i am a pig");
            })
            pgBmp.hover(function () {
                this.scaleX = this.scaleY = 1.1;
            }, function () {
                this.scaleX = this.scaleY = 1;
            })
            var ss = {
                framerate: 10,
                imgs: [ld.get("hero"), ld.get("pig")],
                frames: [
                        // x, y, width, height, imageIndex, regX, regY               
                        [64, 64, 64, 64],
                        [128, 64, 64, 64],
                        [192, 64, 64, 64],
                        [256, 64, 64, 64],
                        [320, 64, 64, 64],
                        [384, 64, 64, 64],
                        [448, 64, 64, 64]
                ],
                animations: {
                    walk: {
                        frames: [0, 1, 2, 3,4,5,6],
                        next: "run",
                        speed: 2,
                        loop: false
                    },
                    jump: {
                    }
                }
            }

            var sp = new Sprite(ss);
            sp.y = 200;
            sp.hover(function () {
                this.scaleX = this.scaleY = 1.1;
            }, function () {
                this.scaleX = this.scaleY = 1;
            })
            stage.add(sp);
        });
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
     
          

        stage.add(text2, text3);


        var circle = new Circle(55, "red");
        circle.x = 60;
        circle.y = 60;
        circle.on("click", function () {
            alert("i'm a red ball!")
        })
        circle.on("mouseover", function () {
            circle.scaleX = circle.scaleY = 1.1;
        })

        //circle.on("mousemove", function () {
        //    console.log(this.id)
        //})


        circle.on("mouseout", function () {
            circle.scaleX = circle.scaleY = 1;
        })
        var circle2 = new Circle(35, "green");
        circle2.x = 60;
        circle2.y = 60;
        circle2.on("click", function () {
            alert("i'm a green ball!")
        })
        circle2.hover(function () {
            this.scaleX = this.scaleY = 1.1;
        }, function () {
            this.scaleX = this.scaleY = 1;
        })
        var circle3 = new Circle(18, "yellow");
        circle3.x = 60;
        circle3.y = 60;
        stage.add(circle, circle2, circle3);
        circle3.hover(function () {
            this.scaleX = this.scaleY = 1.1;
        }, function () {
            this.scaleX = this.scaleY = 1;
        })
        var ctt = new Container();
        ctt.x = 268;
        ctt.y = 58;
        var circle4 = new Circle(48, "#777777");
        var test4 = new Txt("Container!", "bold 16px Arial", "white");
        test4.regX = 40;
        test4.regY = 8;
        ctt.add(circle4, test4);
        stage.add(ctt);
        ctt.on("click", function () {
            alert("i am a Container!");
        })

        var step = 0.05;
        RAF.requestInterval(function () {
            text.rotation++;
            ctt.scaleX += step;
            ctt.scaleY += step;
            ctt.scaleY > 2 && (step *= -1);
            ctt.scaleY < 0.5 && (step *= -1);
            if (pgBmp) pgBmp.rotation--;

            stage.update();
        }, 15);

       
    }
})
