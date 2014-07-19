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
        (function () {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                           || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame)
                window.requestAnimationFrame = function (callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                      timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };

            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = function (id) {
                    clearTimeout(id);
                };
        }());
        init();
        animate();
        var loop;
        function init() {

            var output = document.createElement('div');
            output.style.cssText = 'position: absolute; left: 50px; top: 300px; font-size: 100px';
            document.body.appendChild(output);

            var tween = new TWEEN.Tween({ x: 50, y: 0 })
                .to({ x: 400 }, 2000)
                .easing(TWEEN.Easing.Elastic.InOut)
                .onUpdate(function () {

                    output.innerHTML = 'x == ' + Math.round(this.x);
                    output.style.left=this.x+"px";
                    //var transform = 'translateX(' + this.x + 'px)';
                    //output.style.webkitTransform = transform;
                    //output.style.transform = transform;

                })
                .onComplete(function () {
                    alert("tween complete");
                    cancelAnimationFrame(loop);
                })
                .start();

        }

        function animate(time) {
            loop=requestAnimationFrame(animate); // js/RequestAnimationFrame.js needs to be included too.
            TWEEN.update(time);

        }
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
        //var test = Dom.query("#test")[0];
        //Dom.setStyle(test, "width", "300px");
        //Dom.setStyle(test, "height", "20px");
        //Dom.setStyle(test, "backgroundColor", "green");
        //Dom.setStyle(test, "color", "white");
        //Dom.setStyle(test, "textAlign", "center");
        //test.innerHTML = "Ket - Kmdjs Extension Tools";
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
    }
})

