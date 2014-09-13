kmdjs.config({
    name:"HelloKet",
    baseUrl:"js",
    classes: [
        { name: "Base.Http", url: "Base" },
        { name: "Base.Dom", url: "Base" },
        { name: "Util.Vector2", url: "Util" },
        { name: "Base.Kanvas.DisplayObject", url: "Base/Canvas" },
        { name: "Base.Template", url: "Base" },
        { name: "Compotent.CountDown", url: "../Compotent/CountDown" }
    ]
})

define("Main", ["Base", "Base.Dom", "Util", "Base.Kanvas", "Compotent"], {
    ctor: function () {
        //Http.ajax({
        //    url: "test.ashx",
        //    success: function (msg) {
        //        console.log(msg);
        //    }
        //});
        //var cd = new CountDown({           
        //         hour: 2,
        //         minute:10,
        //         second: 0,
        //         renderTo:Dom.query("#cdCTT")

        //});
        var cdCTT=Dom.query("#cdCTT");
        var cd = new CountDown({           
                 hour: 2,
                 minute:10,
                 second: 0,
                 renderTo: cdCTT

        });
        //Http.jsonp({
        //    url: "test.ashx?callback=?",
        //    success: function (data) {
        //        var div = document.createElement("div");
        //        div.innerHTML = "get by ket jsonp request:" + data.name;
        //        document.body.appendChild(div);
        //    }
        //});
    
        var testDiv=Dom.query(".test");
        // Dom.off(Dom.query(".test"), "click", hd);
        Dom.animate(testDiv, {
            to: { height: "300px", width: "200px", transform: "rotateZ(100deg)" },
            duration: 3000,
            timing:"ease-in",
            complete: function () {

                alert("complete");
            }
        });

        var hd = function () {
         
            Dom.stop(testDiv);
        };
        Dom.on(document.body, "click", hd);
        var v = new Vector2(1, 2);
        v.add({x:1,y:2});
     //   console.log(v.y);

        var obj = new DisplayObject();


      
        // alert(obj.alpha);


    }
});