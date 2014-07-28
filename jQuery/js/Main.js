kmdjs.config({
    name: "HelloKMD",
    baseUrl: "js",
    classes: [
    
        { name: "HelloKMD.JQ2" }
    ]

});
define("Main", ["Util"], {
    init: function () {
        var $ = JQ2.$;
        $("#test").animate({ left: 100 }, 500, function () {
            $(this).css("backgroundColor", "red");
        });
    }
})
