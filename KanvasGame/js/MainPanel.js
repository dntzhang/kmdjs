define("MainPanel:Kanvas.Container", ["Kanvas","Kanvas.UI","Kanvas.Shape"], {
    statics:  {
        init: function () {
            Game.mp=new MainPanel()
            Game.Stage.add(Game.mp);
        },
        fade:function(){
            Game.mp.visible = false;
        }
    },
    ctor: function () {
        this._super();
        var startTxt = new Txt("Start", "bold 22px Arial", "#F6626E");
        startTxt.regX = 26;
        startTxt.regY = 10;

        var ctt = new Container();
        var startBtn = new ShapeButton(new Circle(58, "#AcE5C2"), startTxt);
        startBtn.x = 160;
        startBtn.y = 180;
        startBtn.scaleX = startBtn.scaleY = 0;
        var aboutTxt = new Txt("About", "bold 22px Arial", "#F6626E");
        aboutTxt.regX = 30;
        aboutTxt.regY = 12;
        var abuotBtn = new ShapeButton(new Circle(48, "#AcE5C2"), aboutTxt);
        abuotBtn.scaleX = abuotBtn.scaleY = 0;
        abuotBtn.x = 160;
        abuotBtn.y = 300;
        abuotBtn.on("click", function () {
            alert("powered by kmdjs");
        })


     

        new TWEEN.Tween(startBtn).to({ scaleX: 1, scaleY: 1 }, 1000).easing(TWEEN.Easing.Elastic.Out).onComplete(function () {
           
        }).start();
        new TWEEN.Tween(abuotBtn).delay(200).to({ scaleX: 1, scaleY: 1 }, 1000).easing(TWEEN.Easing.Elastic.Out).onComplete(function () {

        }).start();
        this.levBtns = [];
        var self = this;
        startBtn.on("click", function () {
          
            new TWEEN.Tween(startBtn)
              .to({ x: 160, y:240 }, 500 )
              .easing(TWEEN.Easing.Elastic.Out)
              .start();
            new TWEEN.Tween(abuotBtn)
             .to({ x: 160, y: 240 }, 500 )
             .easing(TWEEN.Easing.Elastic.Out)
             .onComplete(function () {
                 startBtn.visible = false;
                 abuotBtn.visible = false;
             })
             .start();
           
            for (var i = 0; i < 9; i++) {

                var lvTxt = new Txt(i + 1, "bold 30px Arial", "#F6626E");
                lvTxt.regX = 9;
                lvTxt.regY = 16;
                var lvBtn;
                
                if (Game.level > i) {
                    lvBtn = new ShapeButton(new Circle(28, "#AcE5C2"), lvTxt);
                    lvBtn.on("click", function () {
                      
                        TWEEN.removeAll();
                        for (var j = 0, len = self.levBtns.length; j < len; j++) {
                          
                            var targetX = self.levBtns[j].x-500;
                            new TWEEN.Tween(self.levBtns[j])
                              .to({ x: targetX },500+ 100 * j)
                             .easing(TWEEN.Easing.Back.InOut)
                              .onComplete(function () {
                                  //
                              })
                              .start()
                        }
                        new TWEEN.Tween().onComplete(function () {

                            Game.gotoGamePanel();
                        }).start();
                    });
                } else {
                    lvBtn = new ShapeButton(new Circle(28, "#cccccc"), lvTxt);
                }
                
                lvBtn.x = 160;
                lvBtn.y = 240;
                self.levBtns.push(lvBtn);
                var lx = i % 3;
                var ly = Math.floor(i / 3);
                new TWEEN.Tween(lvBtn)
                 .delay(500)
                  .to({ x: lx * 100 + 70, y: ly * 140 + 80 }, 2000 + 200 * i)
                  .easing(TWEEN.Easing.Elastic.Out)
                  .start();

                ctt.add(lvBtn);
            }

        })
        startBtn.on("mousedown", function () {
            //  alert(22222222)
        })
        //console.log(startBtn)
        //console.log(startBtn.events["mousedown"][0])
      
        this.add(ctt,abuotBtn,startBtn );

     
    }
});