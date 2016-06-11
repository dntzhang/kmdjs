##kmdjs
kill all the libraries of module definition

##What's kmdjs?
kmdjs is the `end-all`  solution for javascript project

kmdjs organizes the project based on namespace tree

##Install

include the file in your html,such as:

```html
<script src="kmd.js" ></script>
```

You can also install it via  npm:

```html
npm install kmdjs
```

##Getting start
kmdjs api has only three methods : `kmdjs.config`, `kmdjs.define` and `kmdjs.main`
### config the project
kmdjs.config is used for the whole project configuration, the general configuration is shown below:

```javascript
kmdjs.config({
    'util.bom':'js/util/bom.js',
    'app.Ball':'js/ball.js',
    'util.dom':'js/util/dom.js',

    'main': 'js/main.js'
});

kmdjs.main();
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

    var ball = new app.Ball(0, 0, 28, 1, -2, 'kmdjs');

    var vp = util.bom.getViewport();

    setInterval(function () {
        ball.tick();
        (ball.x + ball.r * 2 > vp[2] || ball.x < 0) && (ball.vx *= -1);
        (ball.y + ball.r * 2 > vp[3] || ball.y < 0) && (ball.vy *= -1);
    }, 15);

});
```

##bundler
you can get the bundle string from main callback method such as blow code:

```javascript
kmdjs.config({
    'util.bom':'js/util/bom.js',
    'app.Ball':'js/ball.js',
    'util.dom':'js/util/dom.js',

    'main': 'js/main.js'
});

kmdjs.main(function(bundler){
    alert(bundler)
});
```   

##ShowCase

a simple demo: https://github.com/kmdjs/kmdjs/tree/master/example/simple


##License

kmdjs is released under the [MIT License](http://opensource.org/licenses/MIT).
