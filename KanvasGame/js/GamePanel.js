define("GamePanel:Kanvas.Container", ["Kanvas", "Kanvas.UI", "Kanvas.Shape"], {

    statics: {
        init: function () {
            Game.gp = new GamePanel();
            Game.Stage.add(Game.gp);
        }
    },
    ctor: function () {

        this._super();
        this.smallBalls = [];
        this.width = Game.Stage.canvas.width;
        this.height = Game.Stage.canvas.height;

        var circle = new Circle(28, "#F6626E");
        circle.x = 160;
        circle.y = -300;
        this.add(circle);
        var self = this;

        this.start = false;
        new TWEEN.Tween(circle).to({ y: 240 }, 1500).easing(TWEEN.Easing.Elastic.Out).onComplete(function () {
            circle.visible = false;
            self.createBalls(5);
          
            
            self.start = true;
         
        }).start();
        self.myBall = new Ball(160, 400, 15, "#AcE5C2");
        self.initEvent();
        Game.Stage.add(self.myBall);
      
    },
    createBalls: function (count) {
        for (var i = 0; i < count; i++) {
            var ball = new SmallBall(160, 240, 5, 3,Util.randomColor());
            Game.Stage.add(ball);
            this.smallBalls.push(ball);
        }
    },
    gameover: function () {
        this.isGameover = true;
        Game.Stage.remove(this.myBall);
        for (var i = 0; i < 35; i++) {
            var ball = new SmallBall(this.myBall.x, this.myBall.y, 2, 2, "#AcE5C2");
            this.smallBalls.push(ball);
            Game.Stage.add(ball);
           
        }
        var circle = new Circle(100, "#AcE5C2");

        var startTxt = new Txt("Game Over", "bold 22px Arial", "#F6626E");
        startTxt.regX = 58;
        startTxt.regY = 41;
        var ctt = new Container();
        ctt.add(circle);
        ctt.add(startTxt);
        Game.Stage.add(ctt);
        ctt.scaleX=ctt.scaleY = 0;
        ctt.x = 160;
        ctt.y = 240;

        var retryTxt = new Txt("Retry", "bold 22px Arial", "#AcE5C2");
        retryTxt.regX = 22;
        retryTxt.regY = 11;
        var retryBtn = new ShapeButton(new Circle(34, "#F6626E"), retryTxt);
       
  
        retryBtn.x = -40;
        retryBtn.y = 40;
        var backTxt = new Txt("Back", "bold 22px Arial", "#AcE5C2");
        backTxt.regY = 11;
        backTxt.regX = 22;
        var backBtn = new ShapeButton(new Circle(34, "#F6626E"), backTxt);
      
        var self = this;
        retryBtn.on("click", function () {
           
            new TWEEN.Tween(ctt).to({ scaleX: 0, scaleY: 0 }, 300).onComplete(function () {
                self.reset();

            }).start();
        });

        backBtn.on("click", function () {

            new TWEEN.Tween(ctt).to({ scaleX: 0, scaleY: 0 }, 300).onComplete(function () {
                Game.Stage.removeAll();
                MainPanel.init();
            }).start();
        });
        backBtn.x = 40;
        backBtn.y = 40;
        ctt.add(retryBtn, backBtn);
        new TWEEN.Tween(ctt).to({ scaleX: 1,scaleY:1 }, 2500).easing(TWEEN.Easing.Elastic.Out).onComplete(function () {
            //circle.visible = false;
            //self.createBalls(5);

          
            //self.start = true;

        }).start();
    },
    tick: function () {
        if (this.start) {
            for (var i = 0, len = this.smallBalls.length; i < len; i++) {
                this.smallBalls[i].tick();
            }
            if (!this.isGameover) {
                this.checkCollision();
            }
        }
    },
    initEvent: function () {
        var self = this;
        Game.Stage.canvas.addEventListener("mousemove", function (evt) {
            var x=evt.pageX - Game.Stage.offset[0];
            var y=evt.pageY - Game.Stage.offset[1];
            if (x + self.myBall.r > self.width) {
                self.myBall.x = self.width - self.myBall.r;
            } else if (x - self.myBall.r < 0) {
                self.myBall.x = self.myBall.r;
            } else {
                self.myBall.x = x;
            }
            if (y + self.myBall.r > self.height) {
                self.myBall.y = self.height - self.myBall.r;
            } else if (y - self.myBall.r < 0) {
                self.myBall.y = self.myBall.r;
            } else {
                self.myBall.y = y;
            }
        }, false);
    },
    checkCollision: function () {
        var mbPosition = new Vector2(this.myBall.x, this.myBall.y);
        var self = this;
        Util.each(this.smallBalls, function (ball) {
            if (mbPosition.distanceToSquared(new Vector2(ball.x, ball.y)) < Math.pow((self.myBall.r + ball.r), 2)) {
           
                self.gameover();
            }
        });
    },
    reset: function () {
        Game.Stage.removeAll();
        GamePanel.init();
    }


})