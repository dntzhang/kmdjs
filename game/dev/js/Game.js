define("Game", {
    statics: {
        init: function () {
            this.canvas = document.querySelector("canvas");
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.ctx = this.canvas.getContext("2d");
            this.btn = document.querySelector("#startBtn");
            this.msgSpan = document.querySelector("#msg");
            this.myBall = new Ball(100, 100, 5, this.ctx);
            this.clientRect = this.canvas.getBoundingClientRect();
            this.smallBalls = [];
            this.timer = new Timer(this.ctx);
            this.gameOver = true;
            this.initEvent();

            this.loop = RAF.requestInterval(function () {

                Game.tick();
            }, 15);

            
            this.tickZoom();
        },
        tickZoom:function(){

            this.zoomLoop = RAF.requestInterval(function () {

                Game.myBall.r += 5;
            }, 5000);
        },
        createBalls: function () {
            for (var i = 0; i < 10; i++) {
                this.smallBalls.push(new SmallBall(Util.random(0, this.width), Util.random(0, this.height), 3, this.ctx));
            }
        },
        initEvent: function () {
            this.canvas.addEventListener("mousemove", function (evt) {
                Game.myBall.x = evt.clientX - Game.clientRect.left;
                Game.myBall.y = evt.clientY - Game.clientRect.top;
            }, false);

            this.btn.addEventListener("click", function (evt) {
                Game.start();
            }, false)

        },
        start: function () {
            this.reset();
            this.gameOver = false;
            this.createBalls();
        },
        tick: function () {
           
            if (this.gameOver) {
            } else {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.myBall.tick();
                Util.each(this.smallBalls, function (ball) {
                    ball.tick();
                });
                this.timer.tick();
                this.checkCollision();
            }
           

        },
        checkCollision: function () {
            var mbPosition = new Vector2(this.myBall.x, this.myBall.y);
            Util.each(this.smallBalls, function (ball) {
                if (mbPosition.distanceToSquared(new Vector2(ball.x, ball.y)) < Math.pow((Game.myBall.r + ball.r), 2)) {
                    Game.msgSpan.innerHTML = "你坚持了" + Game.timer.value + "秒";
                    Game.gameOver = true;
                }
            });
        },
        reset: function () {
            this.msgSpan.innerHTML = "";
            this.smallBalls.length = 0;
            this.myBall.r = 5;
            this.timer.value = 0;
            RAF.clearRequestInterval(this.zoomLoop);
            this.tickZoom();
        }


    }



})