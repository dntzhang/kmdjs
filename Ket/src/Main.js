kmdjs.config({
    name:"HelloKet",
    baseUrl:"src",
    classes: [
        { name: "Base.Http", url: "Base" },
        { name: "Base.Dom", url: "Base" },
        { name: "Util.Vector2", url: "Util" },      
        { name: "Base.Template", url: "Base" },
        { name: "Base.RAF", url: "Base" },
        { name: "Base.Kanvas.DisplayObject", url: "Base/Canvas" },
        { name: "Util.Helper", url: "Util" },
        { name: "Base.JQuery", url: "Base" },
        {
            name: "Compotent.CountDown",
            url: "Compotent/CountDown",
            deps: ["Compotent/CountDown/CountDown.css", "Compotent/CountDown/CountDown.html"]
        },
        { name: "Util.ObservableObject" ,url:"Util"},
        { name: "HelloKet.User" }
    ]
})

define("Main", ["Base", "Base.Dom", "Util", "Base.Kanvas", "Compotent"], {
    ctor: function () {
        //--------------------JQuery----------------------//
        var $ = JQuery.mock();

        var user = new User("zhanglei", 25);
    

        $("#nameSpan").html(user.name);
        user.change(function (prop, value) {
            $("#nameSpan").html(value);
        })
        $("#testObservableObject").on("keyup", function () {           
            user.name = this.value;
        })
     

        //--------------------Compotent----------------------//
        var cd = new CountDown({           
                 hour: 2,
                 minute:10,
                 second: 0,
                 renderTo:Dom.query("#testCompotent")
        });
    
        //--------------------Dom----------------------//
        //var testDiv = Dom.query(".testAnimation");
        //Dom.animate(testDiv, {
        //    to: { height: "300px", width: "200px", transform: "rotateZ(100deg)" },
        //    duration: 3000,
        //    timing:"ease-in",
        //    complete: function () {
        //    }
        //});
        //var hd = function () {       
        //    Dom.stop(testDiv);
        //};
        //Dom.on(document.body, "click", hd);

        //--------------------Http----------------------//
        //Http.jsonp({
        //    url: "test.ashx?callback=?",
        //    success: function (data) {
        //        var div = document.createElement("div");
        //        div.innerHTML = "get by ket jsonp request:" + data.name;
        //        document.body.appendChild(div);
        //    }
        //});

        //Http.ajax({
        //    url: "test.ashx",
        //    success: function (msg) {
        //        console.log(msg);
        //    }
        //});
    }
});