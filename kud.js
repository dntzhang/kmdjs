/**
 * Created by dntzhang on 2016/6/17.
 */
var KMD_CONFIG= require("./kmd.json");


var u2 = require("uglify-js"),
    fs = require("fs");

var mainContent = fs.readFileSync(KMD_CONFIG.main, "utf8");
console.log(u2.minify(mainContent, {fromString: true}))