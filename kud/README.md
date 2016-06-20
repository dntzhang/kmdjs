##kmdjs
kernel module definition

##What's kmdjs?
kmdjs is the `end-all`  solution for javascript project

kmdjs organizes the project based on namespace tree

##Install

install it via  npm:

```html
npm install kmdjs
```

##Getting start
include the file in your html,such as:

```html
<script src="kmd.js" ></script>
```

kmdjs api has only three methods : `kmdjs.config`, `kmdjs.define` and `kmdjs.main`
### config the project
kmdjs.config is used for the whole project configuration, the general configuration is shown below:

```javascript
kmdjs.config({
    'util.bom':'js/util/bom.js',
    'app.Ball':'js/ball.js',
    'util.dom':'js/util/dom.js',

    'main': 'js/main.js'
}).main();
```
or

```javascript
kmdjs.config('kmd.json')
     .main(function(bundler){
            alert(bundler);
        });
```

### defnie a module
define can be passed to the two parameters, such as:

```javascript
kmdjs.define("app.Ball",function(){
    var Ball = function (x, y, r, vx, vy, text) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.d = 2 * r;
        this.vx = vx;
        this.vy = vy;
        this.element = document.createElement("div");
        this.element.innerHTML = text;

        this.element.style.cssText = "text-align:center;position:absolute; -moz-border-radius:" + this.d + "px; border-radius: " + this.d + "px; width: " + this.d + "px; height: " + this.d + "px;background-color:green;line-height:" + this.d + "px;color:white;";
        document.body.appendChild(this.element);

    };

    Ball.prototype.tick= function () {
        this.x += this.vx;
        this.y += this.vy;
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    };

    return Ball;
});
```

Also the statement dependence, passed three parameters, such as:

```javascript
kmdjs.define('main',['util.bom','app.Ball'], function() {

    var ball = new Ball(0, 0, 28, 1, -2, 'kmdjs');

    var vp = bom.getViewport();

    setInterval(function () {
        ball.tick();
        (ball.x + ball.r * 2 > vp[2] || ball.x < 0) && (ball.vx *= -1);
        (ball.y + ball.r * 2 > vp[3] || ball.y < 0) && (ball.vy *= -1);
    }, 15);

});
```

'Ball' and 'bom' can be used directly in your code , because they will be transformed to 'app.Ball' and 'util.bom' by uglifyjs2.

##Bundler
using the 'node build' command to bundle the kmdjs project :

```javascript
node build
```   

the build.js will require kud and kmd.json to bundle your project :

```javascript
require('kud')(require('./kmd.json'),function(bundle){
    //you can get bundle here
    console.log(bundle);
    console.log("------------------- end of kud -------------------")
});
```

you can also get the bundle string in browser  from main callback method such as blow code:

```javascript
kmdjs.main(function(bundle){
    alert(bundle)
});
```   

##Gulp
kud can work well with gulp such as blow code:

```javascript
var gulp = require('gulp'),
    kud = require('kud'),
    runSequence = require('run-sequence');

var config = require('./kmd.json');

gulp.task('kud',function(callback) {
    kud(config,function(bundle,min_bundle){
        console.log(bundle);
        console.log(min_bundle);
        callback();
    });
});

gulp.task('otherTask',function() {
    console.log('otherTask');
});

gulp.task('default',  function (taskDone) {
    runSequence(
        'kud',
        'otherTask',
        taskDone
    );
});
```   

##License

kmdjs is released under the [MIT License](http://opensource.org/licenses/MIT).
