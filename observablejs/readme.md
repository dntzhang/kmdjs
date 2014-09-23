##写在前面
各大MVVM框架百花齐放，其出现的目的是为了解决以数据模型为中心的程序设计，而非大量过程式的交互效果的实现，所以mv*是专注于数据，而zepto、jquery专注于dom，canvas/svg的库（如kanvas）专注于游戏和报表。他们的使用场景不一样，谁都不会杀死谁，比如一个企业门户，就一个gototop的效果，明显和MVVM没有半毛钱关系，这类网站大量存在，jquery/zepto肯定是更好的选择（当然就一gototop首选还是原生js，封一个event和animate）。那么observable.js出现有什么意义？有意义。

##observable.js意义

* 监听任意对象的任意数据变化
* 让开发者专注于业务逻辑的开发，即数据的操作
* 更新视图的代码只需写一遍，不再出现在业务逻辑里

当然这里可能有人要吐槽了。尼玛，太落后了，更新视图的逻辑还要自己写！！我用xxx的时候，视图都是自动更新的~~~其实，这里我的观点是：各有优缺点。更新视图的逻辑自己完全控制的话，可以加入自定义的任何特效或者显示逻辑，这样显示逻辑的灵活性得到了很大的提升。如果对显示逻辑要求不是非常高的话，也不愿意手动更新视图的话，完全可以选择observable.js作为mv*的底层的一部分，封装一个mv*.....

##5分钟精通observable.js

这里是没有使用任何模块化开发框架，直接暴露在window下的使用代码：

### 普通对象
```javascript
 var User = function (name, age) {
    this.name = name;
    this.age = age;
    //watch User's instance’s property(name) change
    //if you don't input the second argument, observablejs will watch the first argument's all property.
    observable.watch(this,["name"]);
}
var user = new User("lisi", 25);
user.change(function (name, value) {
    console.log(name + "__" + value);//name__wangwu 
});
user.name = "wangwu";
user.age = 17; //nothing happen
```

### 对象字面量
```javascript
var obj = { a: 1 };
//watch obj
observable.watch(obj);
obj.change(function (name, value) {
    console.log(name + "__" + value);//a__2 
});
obj.a = 2;
```

### 数组
```javascript
var arr = [1, 2, 3];
//watch arr
observable.watch(arr);
arr.change(function (name, value) {
    //array__push 
    //3_5
    console.log(name + "__" + value); 
});
arr.push(4);
arr[3] = 5;
```

### 复杂对象
```javascript
var complexObj = { a: 1, b: 2, c: [{ d: [4] }] };
//watch complexObj
observable.watch(complexObj);
complexObj.change(function (name, value) {           
    console.log(name + "__" + value);    //d__100 
});
complexObj.c[0].d = 100;
```

## kmdjs兼容性写法
这里拿observablejs 作为例子，以后大家写模块的时候多加下面这几行代码，当耐特在这里谢谢大家了

```javascript
    if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = observable }
    else if (typeof define === 'function' && define.amd) { define(observable) }
    //export to kmd project，以后大家写模块的时候多加下面这几行代码，当耐特在这里谢谢大家了
    else if (typeof define === 'function' && define.kmd) {
        define("Observable", __class.export);
        //you can also add any namespace to Observable such as blow code:
        //define("Util.Observable", __class.export);
    }
    else { win.observable = observable };
```

详细代码，请参见：https://github.com/kmdjs/kmdjs/blob/master/observablejs/observable.js


##有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* mail:(kmdjs#qq.com, 把#换成@)
* qq: 644213943
* weibo: [@当耐特](http://weibo.com/iamleizhang)
