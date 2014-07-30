kmdjs.config({
    name: "Moonwarriors",
    baseUrl: "src",
    classes: [
        { name: "Moonwarriors.Resource" },
        { name: "Moonwarriors.SysMenu" },
    { name: "Moonwarriors.Util" }
    ]

});
define("Main", {
    ctor: function () {
        cc.game.onStart = function () {
            cc.view.adjustViewPort(true);
            cc.view.setDesignResolutionSize(320, 480, cc.ResolutionPolicy.SHOW_ALL);
            cc.view.resizeWithBrowserSize(true);
            //load resources
            cc.LoaderScene.preload(Resource.g_mainmenu, function () {
              
                cc.director.runScene(SysMenu.scene());
            }, this);
        };
        cc.game.run();
    }
})