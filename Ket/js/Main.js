kmdjs.config({
    name:"HelloKet",
    baseUrl:"js",
    classes: [
        { name: "Base.Http", url: "Base" },
        { name: "Base.Dom", url: "Base" },
        { name: "Base.Dom.Fx", url: "Base" },
        { name: "Util.Vector2", url: "Util" },
        { name: "Base.Kanvas.DisplayObject", url: "Base/Canvas" }
    ]
})

define("Main", ["Base", "Base.Dom", "Util", "Base.Kanvas"], {
    ctor: function () {
        //Http.ajax({
        //    url: "test.ashx",
        //    success: function (msg) {
        //        console.log(msg);
        //    }
        //});

        Http.jsonp({
            url: "test.ashx?callback=?",
            success: function (data) {
                var div = document.createElement("div");
                div.innerHTML = "get by ket jsonp request:" + data.name;
                document.body.appendChild(div);
            }
        });
        Dom.html(Dom.query(".test"));
        var hd=function () {
            alert(1);
        };
        Dom.on(Dom.query(".test"), "click", hd);
        
        // Dom.off(Dom.query(".test"), "click", hd);
        Fx.animate(Dom.query(".test"), {
            to: { height:"300px",width: "200px" },
            duration: 1000,
            timing:"ease-in",
            complete: function () {

                alert(11111111111);
            }
        });


        var v = new Vector2(1, 2);
        v.add({x:1,y:2});
        console.log(v.y);

        var obj = new DisplayObject();
        alert(obj.alpha);
    }
});