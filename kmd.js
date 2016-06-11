/* kmdjs Kill Module Definition 0.1.0
 * By dntzhang(’≈¿⁄)
 * Github: https://github.com/kmdjs/kmdjs
 * MIT Licensed.
 */
var kmdjs = {};

kmdjs.module = {};

kmdjs.setting = null;
kmdjs.isBuild = false;
kmdjs.buildList = [];
(function() {

    var JSLoader = {};
    JSLoader.cache = {};
    JSLoader.mapping = {};

    JSLoader.get = function (url, callback) {
        if (!JSLoader.mapping[url]) {
            JSLoader.mapping[url] = [];
        }
        callback && JSLoader.mapping[url].push(callback);

        if (JSLoader.cache[url]) {
            if (JSLoader.cache[url].state === 'done') {
                JSLoader.exec(url);
            }
            return;
        }

        JSLoader.cache[url] = {};
        JSLoader.cache[url].state = 'loading';

        var script = document.createElement("script");
        script.type = "text/javascript";

        if("onload" in script){
            script.onload = onload;
        }else {
            script.onreadystatechange = function() {
                if (/loaded|complete/.test(script.readyState)) {
                    onload()
                }
            }
        }

        function onload() {
            JSLoader.cache[url].state = 'done';
            JSLoader.exec(url);

            script.onload = script.onreadystatechange = null;
            document.body.removeChild(script);
            script= null;
        }

        script.src = url;
        document.body.appendChild(script);
    };

    JSLoader.exec = function (url) {
        var callbacks = JSLoader.mapping[url];
        while (callbacks.length) {
            callbacks.shift()();
        }
    };

    JSLoader.getByUrls = function (urls, callback) {
        var loadedCount=0;
        for(var i= 0,len= urls.length;i<len;i++){
            JSLoader.get(urls[i],function(){
                loadedCount++;
                if(loadedCount===len){
                    callback();
                }
            })
        }
    };

    kmdjs.define = function (namespace, deps, factory) {

        var argLen = arguments.length;
        if (argLen === 2) {
            kmdjs.buildList.push({namespace:namespace,deps:"",factory:deps.toString()});
            nsToObj(namespace.split('.'), window, deps, namespace)
        }
        else {
            kmdjs.buildList.push({namespace:namespace,deps:deps.toString(),factory:factory.toString()});
            var len = deps.length;
            if (kmdjs.setting) {
                var urls = [],
                    i = 0;
                for ( ; i < len; i++) {
                    urls.push(kmdjs.setting[deps[i]]);
                }
                JSLoader.getByUrls(urls, function () {
                    execFactory(factory,deps,len);
                })
            } else {
                execFactory(factory,deps,len);
            }
        }
    };

    function execFactory(factory,deps,len){
        var args = [];
        for (i = 0; i < len; i++) {
            args.push(kmdjs.module[deps[i]]);
        }
        factory.apply(null, args);
    }

    function buildBundler(){
        var bundlerStr = '';
        var i= 0,
            len = kmdjs.buildList.length;
        for(;i<len;i++) {

        }
    }

    function nsToObj(arr, obj, callback, namespace) {
        var name = arr.shift();
        if (!obj[name]) obj[name] = {};
        if (arr.length > 0) {
            nsToObj(arr, obj[name], callback, namespace)
        } else if (arr.length === 0) {
            obj[name] = callback();
            kmdjs.module[namespace] = obj[name];
            if(namespace === 'main'){

            }
        }
    }

    kmdjs.main = function () {
        if(kmdjs.setting){
            JSLoader.get(kmdjs.setting['main'])
        }
    };

    kmdjs.config = function (setting) {
        kmdjs.setting = setting;
    }

    kmdjs.bundler = function(){
        kmdjs.isBuild = true;
        kmdjs.main();
    }
})();