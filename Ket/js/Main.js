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
    
        var testDiv=Dom.query(".test");
        // Dom.off(Dom.query(".test"), "click", hd);
        Fx.animate(testDiv, {
            to: { height: "300px", width: "200px", transform: "rotateZ(100deg)" },
            duration: 3000,
            timing:"ease-in",
            complete: function () {

                alert("complete");
            }
        });

        var hd = function () {
         
            Fx.stop(testDiv);
        };
        Dom.on(document.body, "click", hd);
        var v = new Vector2(1, 2);
        v.add({x:1,y:2});
     //   console.log(v.y);

        var obj = new DisplayObject();
       // alert(obj.alpha);
    }
});