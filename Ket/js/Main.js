kmdjs.config({
    name: "TestKet",
    //相对于引用他的html路径，跟kmdjs路径和mian.js路径无关
    baseUrl: "js",
    classes: [
         { name: "Ket.Base.Dom", url: "Ket/Base" },
         { name: "Ket.Util.Base", url: "Ket/Util" },
         { name: "Ket.Base.Browser", url: "Ket/Base" },
         { name: "Ket.Base.Http", url: "Ket/Base" },
         { name: "Ket.Util.JSON", url: "Ket/Util" },
         { name: "Ket.Base.Jquery", url: "Ket/Base" },
         { name: "Ket.Util.TWEEN", url: "Ket/Util" }
    ]

});

define("Main", ["Ket.Base","Ket.Util"], {
    init: function () {

        var btn = Dom.id('testAJAXBtn');
       
        btn.onclick = function () {

            //Test Ket.Fw.Http
            Http.ajax({
                url: "test.json",
                type: "json",
                success: function (aa) {
                    var div = document.createElement("div");
                    div.innerHTML = "get by ket ajax request:" + aa.responseJSON.a;
                    document.body.appendChild(div);
                }
            });

            Http.jsonp({
                url: "test.ashx?callback=?",
                success: function (data) {
                    var div = document.createElement("div");
                    div.innerHTML = "get by ket jsonp request:" + data.name;
                    document.body.appendChild(div);
                }
            });
        };
       
        //Test Ket.Fw.Dom
        var test = Dom.query("#test")[0];
        Dom.setStyle(test, "width", "300px");
        Dom.setStyle(test, "height", "20px");
        Dom.setStyle(test, "backgroundColor", "green");
        Dom.setStyle(test, "color", "white");
        Dom.setStyle(test, "textAlign", "center");
        test.innerHTML = "Ket - Kmdjs Extension Tools";
        //or------------------------
        var $ = Jquery.mock();
        $("#test").css("width", "300px").css("height", "20px").css("backgroundColor", "green").css("color", "white").css("textAlign", "center").html("Ket - Kmdjs Extension Tools");

        $.ajax({
            url: "test.json",
            type: "json",
            success: function (aa) {
                var div = document.createElement("div");
                div.innerHTML = "get by ket ajax request:" + aa.responseJSON.a;
                document.body.appendChild(div);
            }
        })
        //(Linear)
        //( Quadratic Cubic Quartic Quintic Sinusoidal Exponential Circular Elastic Back Bounce)(In Out InOut) 
        //ex: Linear  or   Quadratic-In    or  Quartic-InOut
        $(".Div1").animate({ left: 100, top: "200px" }, 2000, "Bounce-InOut", function () {
           
        })
    }
})

