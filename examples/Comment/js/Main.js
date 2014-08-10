/// <reference path="../../Inherit/js/qunit.js" />
kmdjs.config({
    name: "HelloKMD",
    baseUrl: "js"

});

define("Main",  {
    ctor: function () {
        var a = "//"
        //aaa
        alert(1);//aa
        var aa = 44 / 2;
        
        var reg = /\/\//g;
        alert(reg.test("//"));
        /*
        fdsfdsfds
        */
        alert(2);/* sfs::d"f*/  alert(3);
        
        // Easily-parseable/retrievable ID or TAG or CLASS selectors
        var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, whitespace="xx",

        rsibling = /[+~]/,
        rescape = /'|\\/g,

        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig");
        test("", function () {

            equal(aa,22);

        })
    }
})
