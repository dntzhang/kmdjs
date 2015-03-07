##what's kmdjs?
kmdjs is the `end-all`  solution for javascript project

kmdjs unites the project based on namespace and class

The name kmdjs means "kill all the libraries of module definition“ or "kill module definition", class definition is the future . `one file one class` is the future.

kmdjs let you define fine-grained files for `classes` , `not modules`.

##features
* Circular dependency
* Dependency  visualization
* Name conflict
* JavaScript compressor/beautifier/mangler/combine/split in any broswer
* Debug in any broswer
* Extract and Download any namespace in any broswer
* Build the project in any broswer


##getting start:
kmdjs api has only two methods .one is `kmdjs.config`, the other is `define`
### config the project
kmdjs.config is used for the whole project configuration, the general configuration is shown below:

```javascript
kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Ball" },
        { name: "Util.Bom",url:"Util" }
    ]
});
```
among them:

name: the name of the project

baseUrl: basic path

all the classes of project definition in the classes, this name in every item is the namespace + class name, url is the corresponding directory

the project directory structure:

![dir](https://raw.githubusercontent.com/kmdjs/kmdjs/master/doc/assets/dir.png)

### defnie a class
define can be passed to the two parameters, such as:

```javascript
define ("namespace.class", {
    ctor:function(){
        
    }
})
```

Also the statement dependence, passed three parameters, such as:

```javascript
define ("namespace0.class1", ["namespace2","namespace1"],{
    ctor:function(){
        
    }    
})
```

#####Need to pay attention to two points here:
* the dependency list is namespace, not class/module
* if you want to use class2 of namespace0  without the addition of namespace0 in the dependency list, because class2 itself belongs to namespace0, any class under namespace0 can use

Corresponding to the above kmdjs.config, the JS related documents must exist class defined as follows:
```javascript
//Main same as ProjectName.Ball, so you can use ProjectName.Ball with out the addition of ProjectName in the dependency list
define("Main",["Util"],{
    var ball=new Ball(10,10,5);
    //you can use Bom here such as:
    Bom.getViewPort()
})

define ("ProjectName.Ball", {
    ctor:function(x,y,r){
        this.x=x;
        this.y=y;
        this.r=r;
        
    }
})

define ("Util.Bom", {
    statics:{
        getViewPort:function(){
            //...
        }
    }
})
```

###need to pay attention here:
If you don't show the statement namespace, as shown in the following code:

```javascript
define ("Ball", {
})
```

kmdjs will auto add the project name that config in kmdjs.config as it's namespace to the ball,so that's same as 
`ProjectName.Ball`.

###inheritance
The parent class:

```javascript
define("Animal", {
    ctor: function (age) {
        this.age = age;
    }
})
```
Subclass:

```javascript
define("Pig:Animal", {
    ctor: function (age, name) {
        this._super(age);
        this.name = name;
    },
    climbTree: function () {
        return "i can't do it";
    }
})
```

the ctor method is constructor, this._super method can access the parent class‘s method. you can create object instances in other js with the `new` keyword.

###cmd
kmdjs has powerful cmd , to be continued....

for more detail,you can go to https://github.com/kmdjs/kmdjs/tree/master/examples
##many thanks 

* [uglify2](https://github.com/mishoo/UglifyJS2) 
* [jslint](https://github.com/douglascrockford/JSLint)
* [blob](https://github.com/eligrey/Blob.js)
* [class.js](http://ejohn.org/blog/simple-javascript-inheritance/)
* [js_beautiful](http://jsbeautifier.org/) 
* [json.js](https://github.com/douglascrockford/JSON-js)

##License

kmdjs is released under the [MIT License](http://opensource.org/licenses/MIT).
