kmdjs.config({
    name: "HelloKMD",
    baseUrl: "js",
    classes: [  
        { name: "HelloKMD.Vue" }
    ]

});
define("Main", {
    ctor: function () {
        var $V = Vue.$V;
        new $V({
            el: '#demo',
            data: {
                message: 'Hello Vue.js!'
            }
        })
    }
})
