/**
 * Created by dntzhang on 2016/6/17.
 */
var KMD_CONFIG= {
    'util.bom':'js/util/bom.js',
    'app.Ball':'js/ball.js',
    'main': 'js/main.js'
};



var u2 = require("uglify-js"),
    fs = require("fs");

var mainContent = fs.readFileSync(KMD_CONFIG.main, "utf8");
console.log(u2.minify(mainContent, {fromString: true}))