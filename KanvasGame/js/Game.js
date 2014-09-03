define("Game",["Kanvas"],{
    statics: {
        init: function (stage) {
            this.Stage=new Stage("#ourCanvas");
            
            var level = Data.store.get("level");
            if (!level) Data.store.set("level", 1);

            this.level = Data.store.get("level");
            this.loop = RAF.requestInterval(function () {

                Game.tick();
            }, 15);

            MainPanel.init();
        },
        tick: function () {
            if (Game.gp) {
                Game.gp.tick();
            }
            this.Stage.update();
            TWEEN.update();
        },
        gotoGamePanel: function () {
            MainPanel.fade();
            GamePanel.init();
        }
    }
});