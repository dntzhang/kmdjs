/// <reference path="uglify2.js" />
//ug2==>Object.create(null)===>{}
; (function (global, undefined) {
    var define, kmdjs = {};
    var currentAST;
    var isDebug = false, modules = {}, classList = [], baseUrl = getBaseUrl(), mapping = {}, cBaseUrl, nsmp = {}, dataMain;
    var isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document);
    var ProjName;
    var kmdmdinfo = [];
    var lazyMdArr = [];
    var isMDBuild = false;
    //防止IE9会命中{1:xxx}中的cache
    var allPending = [];
    var isMtClassesBuild=false,readyBuildClasses=[];
    var conflictMapping = {};
    var xmdModules={};
    function findScope(node) {
        var sp;
        function chain(node) {
            if (node.property) {
                chain(node.expression);
            } else {
                sp = node.scope;
                name = node.name;
            }
        }
        chain(node);
        return { sp: sp, name: name };

    }
   
    function chainNS(node) {
        var result = [];
        function chain(node) {
            if (node.property) {
                result.unshift(node.property);
                chain(node.expression);
            } else {
                result.unshift(node.name);
            }
        }
        chain(node);
        return result.join("_");

    }
    function splice_string(str, begin, end, replacement) {
        return str.substr(0, begin) + replacement + str.substr(end);
    }
    var beautifier_options_defaults = {
        indent_start  : 0,
        indent_level  : 4,
        quote_keys    : false,
        space_colon   : true,
        ascii_only    : false,
        inline_script : false,
        width         : 80,
        max_line_len  : 32000,
        screw_ie8     : false,
        beautify      : true,
        bracketize    : false,
        comments      : false,
        semicolons    : false
    };

    var isIE=!!window.ActiveXObject;
    var isIE6=isIE&&!window.XMLHttpRequest;
    function addOneSI(codeStr, index, evidence) {
        var arr = codeStr.split("\n");
        arr[index] = evidence+";";
        return arr.join("\n");
    }
    function addSi(fn) {
        
        var codeStr ="var a="+ fn.toString()+";";
        if(isIE6){
            
        
            //JSLINT最多可容忍10000个错误
            JSLINT.jslint(codeStr, { maxerr: 10000 });
            for (var i = 0, len = JSLINT.errors.length; i < len; i++) {
         
                var item = JSLINT.errors[i];
                if (item && item.a == ";") {
                    codeStr = addOneSI(codeStr, item.line - 1, item.evidence);
                }
            };

          
            return codeStr.substring(6, codeStr.length-1);

        }else{
            var ast= UglifyJS.parse(codeStr);
            var out=ast.print_to_string(beautifier_options_defaults);
      
            //    console.log(out.substring(8, codeStr.length-1))
            return out.replace("var a = ", "");

        }
       


    
    }
    var defined={};
    define = function (name, deps, foctory) {
     
        var argc = arguments.length;
        if (argc == 1) {
            throw "the class must take a name";
        } else if (argc == 2) {
            foctory = deps;
            deps = [];
        } else {
            if (isString(deps)) {
                deps = [deps];
            }
        }
        var mda = name.split(":");
        var fullname = mda[0];
        var lastIndex = lastIndexOf(fullname, ".");

        if (lastIndex == -1) {
            fullname = ProjName + "." + fullname;
            lastIndex = lastIndexOf(fullname, ".");
        }
        if( defined[fullname])return;
        defined[fullname]=true;
        if (mda.length > 1 && lastIndexOf(mda[1], ".") == -1) {
            mda[1] = ProjName + "." + mda[1];
        }
        var baseClass =  '__class' ,parentClass;
        if(mda.length != 1 ){
            //for cocos2d
            if( mda[1].split(".")[0] in window&&!isInArray(classList,mda[1])  ){
                baseClass= mda[1];
            }else{
                baseClass=  mda[1];
                parentClass= mda[1] ;
            }
           
        }
        
        var className = fullname.substring(lastIndex + 1, fullname.length);
        deps.unshift(fullname.substring(0, lastIndex));

        var xmd=[];
        //remove xmd
        for(var i=0;i<deps.length;i++){
            if(xmdModules[deps[i]]){
                if(!isInArray(xmd,deps[i]))xmd.push(deps[i]);
                deps.splice(i, 1);            
                i--;
            }
        }
        if (!isInArray(deps, ProjName)) deps.unshift(ProjName);
        //  console.log(className+"________-"+fullname)

        var ldCount = 0, xmdLen = xmd.length;
        if(xmdLen>0){
            for (var j = 0;j < xmdLen; j++) {
                (function (ns) {               
                    allPending.push(ns);
                    request(mapping[ns], function () {
                        remove(allPending, ns);
                    
                        ldCount++;
                        if (ldCount == xmdLen) {
                            refrence(className, deps,fullname+ "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname);
                            checkMainCpt();

                            
                        }
                    })
                })(xmd[j])}
        }else{
            refrence(className, deps,fullname + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname,parentClass);
        }

    }
    var currentPendingModuleFullName = [],compotentMapping={};
    window.kmdmdinfo = kmdmdinfo;
    function compressor(fn) {
        var ast = UglifyJS.parse(fn.toString());
        ast.figure_out_scope();
        var sq = UglifyJS.Compressor();
        var compressed_ast = ast.transform(sq);
        compressed_ast.compute_char_frequency();
        compressed_ast.mangle_names();
        var code = compressed_ast.print_to_string();
        return code;
    }
    function refrence(className, deps, foctory, fullname,parentClass) {
        //  console.log(className + "________-" + fullname)
        conflictMapping = {};
        //.replace(/\\/g, "")改成.replace(/\\"/g, '"')是为了解决正则被替换的bug;
        var body;
        if(isIE6){
            body = foctory.replace(/"function[\s\S]*?\}"/g, function (str) {
                return str.substr(1, str.length - 2);

            });
        }else{

            body = foctory.replace(/"function[\s\S]*?\};"/g, function (str) {
                // alert(str)
                return str.substr(1, str.length - 4)+"}";
            })
        }
        body= body.replace(/(\\r)?\\n(\\t)?([\s]*?)\/\/([\s\S]*?)(?=(\\r)?\\n(\\t)?)/g, "").replace(/(\/\*[\s\S]*?\*\/)/g, "").replace(/\\r\\n/g, "").replace(/\\n/g, function (item, b, c) {
            if (c.charAt(b - 1) == "\\") {
                return item;
            }
            return "";
        }).replace(/\\t/g, function (item, b, c) {
            if (c.charAt(b - 1) == "\\") {
                return item;
            }
            return "";
        }).replace(/\\"/g, function (item, b, c) {
            //if (c.charAt(b - 1) == "\\") {
            //    return item;
            //}
            return '"';
        }).replace(/\\'/g, function (item, b, c) {
            //if (c.charAt(b - 1) == "\\") {
            //    return item;
            //}
            return "'";
        }).replace(/\\\\/g, '\\');

        body = js_beautify(body);
        try{
            var fn = new Function(body);
        }catch(ex){

            log(body);
            throw ex.name+"__"+ ex.message+"__"+ex.number+"__"+ex.description;
            return;
        }

        var allFullNameDeps = [];
        if(parentClass){
            var parentNs=parentClass.substr(0,lastIndexOf(parentClass,"."));
            (!isInArray(deps,parentNs))&&   deps.push( parentNs );
        }
        var refArr = getRef(fn,deps),ref=refArr[0];
        remove(ref, "__class");
        var newArr = [];
        for (var i = 0, len = deps.length; i < len; i++) {
            for (var k = 0; k < ref.length; k++) {
                (isInArray(classList, deps[i] + "." + ref[k]) && !isInArray(newArr, deps[i] + "." + ref[k])) && newArr.push(deps[i] + "." + ref[k]);
            }
        }
        if(parentClass&&!isInArray(newArr,parentClass)) newArr.push(parentClass);
        if(isMtClassesBuild&&className.toUpperCase()=="MAIN"){
            each(readyBuildClasses,function(item){

                newArr.push(item);
            })

        }
        
        // console.log(newArr)
        //var nsRef = getNSRef(fn);
        //if(!isCombine){
        //    var entire = getRefWithNS(fn);
        //    body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        //}else{

        var entire = refArr[1];
        body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        //    }
        if (isDebug) {
            log(fullname + "  ref:" + ref.toString())
            //  log(body + "\n//@ sourceURL=" + (className || "anonymous") + ".js");
        }
        // console.log(body)
        //  console.log(conflictMapping)        //if (isBuild || isMDBuild) {
        //    //  if (!isDebug) {
        //    var fx = new Function(body);
        //    var entire = compressor(fx);
        //    body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        //    //  }
        //}

        var moduleNameArr = [];
        for (i = 0; i < newArr.length; i++) {
            var xx = newArr[i].split(".");
            moduleNameArr.push(xx[xx.length - 1]);
        }
        //push里重复的进去
        var isPush = false;
        each(kmdmdinfo, function (item) {
            if (item.c == fullname) {
                isPush = true;
                return false;
            }

        })
        //根据conflictMapping，加入kmdmdinfo
        for (var ck in conflictMapping) {
            var fname = conflictMapping[ck];
            var fnameReal=fname.replace(/_/g, ".");
            if(isInArray(classList,fnameReal)){
                moduleNameArr.push(fname);
                newArr.push(fnameReal);
            }
        }
        if (!isPush) kmdmdinfo.push({ a: moduleNameArr, b: body, c: fullname, d: newArr ,e:parentClass});
        // console.log(fullname)
        //console.log(newArr)
        if (newArr.length == 0 && !isBuild) {
            checkMainCpt();

            
        } else {
            for (var k = 0; k < newArr.length; k++) {

                //发请求前，check存在否

                (function (ns) {
                    //  console.log(ns)
                    if (!define.modules[ns]) {
                        if(mapping[ns+"_deps"]&& !compotentMapping[ns]){
                            loadComponent(mapping[ns+"_deps"],function(){
                                compotentMapping[ns]=JSON.stringify(Array.prototype.slice.call(arguments));
                                allPending.push(ns);
                                if (mapping[ns]) {
                                    request(mapping[ns], function () {
                                        remove(allPending, ns);
                                        // define.modules["MathHelper.Vector2"] = 1;
                                        checkMainCpt();

                                
                                    })
                                } else {
                                    throw "no module named :" + ns;
                                }

                            })

                        }else{

                            allPending.push(ns);
                            if (mapping[ns]) {
                                request(mapping[ns], function () {
                                    remove(allPending, ns);
                                    // define.modules["MathHelper.Vector2"] = 1;
                                    checkMainCpt();

                                
                                })
                            } else {
                                throw "no module named :" + ns;
                            }
                        }
                        
                    }
                })(newArr[k])
            }
        }
        window.allPending = allPending;
    }
    function loadComponent(arr,callback){
        var count=0,len=arr.length,datas=[];
        for(var i=0,len=arr.length;i<len;i++){
            var currentUrl=cBaseUrl+"/"+arr[i];
         
            (function(currentUrl){

                ajax(currentUrl,function(data){
                    datas.push(data);
                    if(lastIndexOf(currentUrl,".css")!=-1){
                        var cssStr = data;
                        var style = doc.createElement("style");
                        style.setAttribute("type", "text/css");
                        if(style.styleSheet){// IE
                            style.styleSheet.cssText = cssStr;
                        } else {// w3c
                            var cssText = doc.createTextNode(cssStr);
                            style.appendChild(cssText);
                        }
                       
                        head.appendChild(style);

                    }
                    count++;
                    if(count==len){
                     
                        callback.apply(null,datas);
                    }
                })
            })(currentUrl);
        
        }

    }

    function dotChain(node) {
        var result = [], ep = node.end.endpos, bp;
        function chain(node) {
            if (node.property) {
                result.unshift(node.property);
                chain(node.expression);
            } else {
                bp = node.end.pos
                result.unshift(node.name);
            }
        }
        chain(node);
        return { ns: result.join("."), bp: bp, ep: ep };
    }
    function getTopName(node) {
        var cNode;
        function chain(node) {
            if (node.property) {

                chain(node.expression);
            } else {
                cNode = node;
            }
        }
        chain(node);
        return { name: cNode.name, scope: cNode.scope };
    }
    function getNSRef(fn) {
        var U2 = UglifyJS;
        var ast = U2.parse(fn.toString());
        ast.figure_out_scope();
        var allNS = [];
        ast.walk(new U2.TreeWalker(function (node) {

            if (node instanceof U2.AST_Dot) {

                var cc = getTopName(node);
                var ex = node.expression, name = cc.name, scope = cc.scope;

                // var xxxx = isInScopeChainVariables(scope, name);

                if (name && name != "this" && !(name in window) && !isInScopeChainVariables(scope, name)) {

                    allNS.push(dotChain(node))
                }
            }
        }));

        var len = allNS.length;
        var result = {};
        for (var i = 0; i < len; i++) {

            var item = allNS[i];

            if (!result[item.bp]) {
                result[item.bp] = item;
            } else {
                if (result[item.bp] == item.bp && item.ep > result[item.bp].ep) {
                    result[item.bp] = item;
                }
            }
        }
        return result;

    }
   
   
    define.pendingCallback=[];
    kmdjs.get = function (fullname, callback) {
        if (isString(fullname)) {
            fullname = [fullname];
        }

        for (var i = 0, len = fullname.length; i < len; i++) {
            if (lastIndexOf(fullname[i], ".") == -1) {
                fullname[i] = ProjName + "." + fullname[i];
                currentPendingModuleFullName.push(fullname[i]);
            }
        }

        var loaded = true;
        var mdArr = [];
        for (var i = 0, len = fullname.length; i < len; i++) {
            if (modules[fullname[i]]) {
                mdArr.push(modules[fullname[i]]);
            } else {

                loaded = false;
            }
        }
        if (loaded) {
            if (callback) {
                callback.apply(null, mdArr);

            }

        } else {
            //   var count = 0;
            for (var i = 0, len = fullname.length; i < len; i++) {

                if (!modules[fullname[i]]) {
                    var ns = fullname[i];
                    allPending.push(ns);
                    (function (ns) {
                        if (mapping[ns]) {
                            request(mapping[ns], function () {
                                if (callback) define.pendingCallback.push( callback);
                                remove(allPending, ns)
                                checkMainCpt();

                                
                                //}
                            })
                        } else {
                            throw "no module named :" + ns;
                        }

                    })(ns);
                }
            }

        }
    }


    //防止多次执行main
    var kmdmaincpt = false;
 
    function downloadFile(code, fileName) {
        if (window.URL.createObjectURL) {
            var fileParts = [code];

            // Create a blob object.
            var bb = new Blob(fileParts, { type: 'text/plain' });
            var dnlnk = window.URL.createObjectURL(bb);
            var dlLink = document.createElement("a");
            dlLink.setAttribute('href', dnlnk);
            dlLink.setAttribute('download', fileName);
            dlLink.click();
        }
    }
    function isInModules(mds,md){
        var result=false;
        each(mds,function(item){
            if(item.c==md.c)result=true;
        })
        return result;
    }
    var storeModule=[];
    function getDepModule(name){

        each(kmdmdinfo,function(item){
            if(item.c==name&&!isInModules(storeModule,item)){
                storeModule.push(item);
                each(item.d,function(depName){
                    getDepModule(depName);
                
                })
            }
        })
    }
    function checkMainCpt() {
        //for (var i = 0; i < pendingModules.length; i++) {
        //    for (var j = 0; j < pendingModules[i].deps.length; j++) {
        //        if (!checkModules.hasOwnProperty(pendingModules[i].deps[j])) return false;
        //    }
        //}
        if (allPending.length > 0) return;

        if (kmdmaincpt) return;
        kmdmaincpt = true;
        //pendingModules.length = 0;
        //checkModules = {};

        
        var buildArr=[];
        if (isMtClassesBuild) each(readyBuildClasses, function (item) {
            getDepModule(item);
            buildArr=storeModule;
        });
        //防止ie还没初始化完成该函数
        //setTimeout(function () {
            //  if(isMtClassesBuild||((!isView)&&(!isBuild)&&(!isCombine)))  new modules[ProjName + ".Main"];
        //}, 0);


        var topNsStr="";
        each(kmdmdinfo,function(item){
            var arr=nsToCode(item.c);
            
            for(var i=0;i<arr.length;i++){
                var item2=arr[i];
                var isInKMD=false;
                for(var k=0,klen=kmdmdinfo.length;k<klen;k++){
                    if(kmdmdinfo[k].c+"={};"==item2){
                        isInKMD=true;
                    }
                }
                if(!isInKMD){
                    (lastIndexOf( topNsStr,item2)==-1)&&(topNsStr+=item2+"\n");
                }
            }
                       
            //var nsSplitArr= item.c.split(".");
            //var dfNS= "var "+nsSplitArr[0]+"={};\n";
            //(lastIndexOf( topNsStr,dfNS)==-1)&&(topNsStr+=dfNS);

            //if(nsSplitArr.length>2){
            //    var subDfNS= item.c.substring(0, lastIndexOf( item.c,"."))+"={};\n";
            //    (lastIndexOf( topNsStr,subDfNS)==-1)&&(topNsStr+=subDfNS);
                         
            //}
        })
        var evalOrder=[];
        var outPutMd=[];
        function createParentCode(item){
            if(isInArray(outPutMd,item.c))return;
            each(kmdmdinfo, function(currentItem){ 
                if(currentItem.c==item.e){                                      
                    createParentCode(currentItem);
                                             
                }
            })
            outPutMd.push(item.c);
            var temp="";
            temp+="\n//begin-------------------"+item.c+"---------------------begin\n";                     
            temp+= item.b.substr(0,lastIndexOf( item.b,"return")) ;
            temp+="\n//end-------------------"+item.c+"---------------------end\n";
            combineCode+=temp;
            evalOrder.push(temp) ;
        }

        var cpCode ="//create by kmdjs   https://github.com/kmdjs/kmdjs \n";
        var combineCode=";(function(){\n"+topNsStr;
        // console.log(kmdmdinfo)
        kmdmdinfo.sort(function(l,r){

            return l.c.split(".").length-r.c.split(".").length;
        })

        for(var i=0;i<kmdmdinfo.length;i++){
            var item=kmdmdinfo[i];
            if(isInArray(outPutMd,item.c))continue;
         
            if((!item.e)){   
            
                outPutMd.push(item.c);
                var temp="";
                temp+="\n//begin-------------------"+item.c+"---------------------begin\n";                       
                temp+= item.b.substr(0,lastIndexOf( item.b,"return")) ;
                temp+="\n//end-------------------"+item.c+"---------------------end\n";
                combineCode+=temp;
                evalOrder.push(temp) ;
            }else{
                createParentCode(item) ;
               
            }
        } 
        for(var cptKey in  compotentMapping){

            combineCode += "\n" + cptKey + ".baseUrl=\"" + mapping[cptKey+"_baseUrl"]+"\"";
            combineCode += "\n" + cptKey + ".deps=" + compotentMapping[cptKey];
            evalOrder.push( "\n" + cptKey + ".baseUrl=\"" + mapping[cptKey+"_baseUrl"]+"\"");
            evalOrder.push("\n" + cptKey + ".deps=" + compotentMapping[cptKey]);
        }
        //  console.log(outPutMd)
        combineCode+="\nnew "+ProjName+".Main();\n})();";

        cpCode+= '(function(n){var initializing=!1,fnTest=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,__class=function(){};__class.extend=function(n){function i(){!initializing&&this.ctor&&this.ctor.apply(this,arguments)}var f=this.prototype,u,r,t;initializing=!0,u=new this,initializing=!1;for(t in n)t!="statics"&&(u[t]=typeof n[t]=="function"&&typeof f[t]=="function"&&fnTest.test(n[t])?function(n,t){return function(){var r=this._super,i;return this._super=f[n],i=t.apply(this,arguments),this._super=r,i}}(t,n[t]):n[t]);for(r in this)this.hasOwnProperty(r)&&r!="extend"&&(i[r]=this[r]);if(i.prototype=u,n.statics)for(t in n.statics)n.statics.hasOwnProperty(t)&&(i[t]=n.statics[t],t=="ctor"&&i[t]());return i.prototype.constructor=i,i.extend=arguments.callee,i.implement=function(n){for(var t in n)u[t]=n[t]},i};\n\n'+combineCode+'})(this)';
  
        if (isBuild||isCombine) {

            var ctt = doc.createElement("div");
            var msgDiv = doc.createElement("div");
            var titleDiv = doc.createElement("div");
            titleDiv.innerHTML = "Build Complete!"
            msgDiv.innerHTML =isMtClassesBuild?readyBuildClasses.join("<br/>"): ProjName + ".js ";
            var codePanel = doc.createElement("textarea");
            ctt.appendChild(titleDiv);
            ctt.appendChild(codePanel);
            ctt.appendChild(msgDiv);

            doc.body.appendChild(ctt);
            codePanel.setAttribute("rows", "8");
            codePanel.setAttribute("cols", "55");
            //ctt.style.position = "absolute";
            //ctt.style.left = "0px";
            //ctt.style.left = "0px";
            //ctt.style.top = "0px";

            //ctt.style.width = "100%";
            //ctt.style.zIndex = 10000;
            //ctt.style.textAlign = "center";
            if(isMtClassesBuild){
                cpCode="kmdjs.exec([\n";
                each(buildArr,function(item,index){
                    cpCode+="{\n"
                    cpCode+="a:"+JSON.stringify( item.a)+",\n";
                    cpCode+="b:function(){"+ item.b.toString()+"\n},\n";
                    cpCode+="c:"+JSON.stringify( item.c)+",\n";
                    cpCode+="d:"+JSON.stringify( item.d);
                    if(item.e){
                        cpCode+=",\ne:"+JSON.stringify( item.e)+"\n";
                    }else{

                        cpCode+="\n";
                    }
                    cpCode+="}"+((index==0)?"":",")+"\n";
                });
                cpCode+="])";
            }else{
                cpCode=isCombine?cpCode :compressor( cpCode);
            }
            codePanel.value = cpCode;
            codePanel.focus();
            codePanel.select();

            downloadFile(cpCode, ProjName + '.Main.js');

            var lmclone = [];
            each(lazyMdArr, function (item) {
                lmclone.push(item);
            })

            //kmdjs.get(lazyMdArr, function () {
            //    //to do  change
            //    var lzBuildArrs ;
            //   // var lzBuildArrs = getBuildArr(lmclone);
            //    each(lzBuildArrs, function (item) {
            //        var ctt = doc.createElement("div");
            //        var msgDiv = doc.createElement("div");
            //        msgDiv.innerHTML = item.name + ".js ";
            //        var codePanel = doc.createElement("textarea");
            //        ctt.appendChild(codePanel);
            //        ctt.appendChild(msgDiv);

            //        doc.body.appendChild(ctt);
            //        codePanel.setAttribute("rows", "8");
            //        codePanel.setAttribute("cols", "55");


            //        var cpCode = 'kmdjs.exec(' + JSON.stringify(item.buildArr).replace(/\s+/g, " ") + ')';
            //        codePanel.value = cpCode;
            //        // Create a blob object.                   
            //        downloadFile(cpCode, item.name + '.js');
            //    })
            //})

        }
        if (isDebug) {
            log(cpCode)
        }
        if((!isBuild)&&(!isCombine)&&(!isView)&&(!isSplit)) {
            eval('(function(n){var t=!1,r=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,i=function(){};i.extend=function(n){function u(){!t&&this.ctor&&this.ctor.apply(this,arguments)}var o=this.prototype,e,f,i;t=!0,e=new this,t=!1;for(i in n)i!="statics"&&(e[i]=typeof n[i]=="function"&&typeof o[i]=="function"&&r.test(n[i])?function(n,t){return function(){var r=this._super,i;return this._super=o[n],i=t.apply(this,arguments),this._super=r,i}}(i,n[i]):n[i]);for(f in this)this.hasOwnProperty(f)&&f!="extend"&&(u[f]=this[f]);if(u.prototype=e,n.statics)for(i in n.statics)n.statics.hasOwnProperty(i)&&(u[i]=n.statics[i],i=="ctor"&&u[i]());return u.prototype.constructor=u,u.extend=arguments.callee,u.implement=function(n){for(var t in n)e[t]=n[t]},u},n.__class=i})(this)');
            eval(topNsStr);
            for(var i=0;i<evalOrder.length;i++){

                eval(evalOrder[i]);
            }
            eval("new "+ProjName+".Main();");
        }  
        if(isSplit){
            var baseCode='(function(n){var t=!1,r=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,i=function(){};i.extend=function(n){function u(){!t&&this.ctor&&this.ctor.apply(this,arguments)}var o=this.prototype,e,f,i;t=!0,e=new this,t=!1;for(i in n)i!="statics"&&(e[i]=typeof n[i]=="function"&&typeof o[i]=="function"&&r.test(n[i])?function(n,t){return function(){var r=this._super,i;return this._super=o[n],i=t.apply(this,arguments),this._super=r,i}}(i,n[i]):n[i]);for(f in this)this.hasOwnProperty(f)&&f!="extend"&&(u[f]=this[f]);if(u.prototype=e,n.statics)for(i in n.statics)n.statics.hasOwnProperty(i)&&(u[i]=n.statics[i],i=="ctor"&&u[i]());return u.prototype.constructor=u,u.extend=arguments.callee,u.implement=function(n){for(var t in n)e[t]=n[t]},u},n.__class=i})(this)';
            renderToTextarea(baseCode,"Base.js");
            downloadFile(baseCode,"Base.js");

            renderToTextarea(topNsStr,"Namespace.js")
            downloadFile(topNsStr,"Namespace.js")
            for(var i=0;i<evalOrder.length;i++){
                renderToTextarea(evalOrder[i],evalOrder[i].match(/-------------------[\s\S]*?---------------------/)[0].replace(/[-]*/g,"")+".js");
                downloadFile(evalOrder[i],evalOrder[i].match(/-------------------[\s\S]*?---------------------/)[0].replace(/[-]*/g,"")+".js");
            }
            renderToTextarea("new "+ProjName+".Main();",ProjName+".Main.js");
            downloadFile("new "+ProjName+".Main();",ProjName+".Main.js");

        }
       
        if (isView) {
            var vp=getViewport();
            var center= document.createElement("center");
            var mainCanvas=document.createElement("canvas");
            mainCanvas.width=vp[2]-300;
            mainCanvas.height=vp[3]-20;
            var signCanvas=document.createElement("canvas");
            signCanvas.width=200;
            signCanvas.height=20;
            var lable=document.createElement("div");
            center.appendChild(mainCanvas);
            center.appendChild(signCanvas);
            center.appendChild(lable);
            document.body.style.cssText="margin: 0px; height: 100%;width: 100%;display: table;overflow:hidden;";
            center.style.cssText=" display: table-cell; vertical-align: middle;";
            signCanvas.style.cssText="  position: absolute;bottom: 10px;right: 10px;";
            lable.style.cssText=" position: absolute;bottom: 10px; left: 10px; font: 12pt Lucida Sans Typewriter, Monospace;";
            var data =[];
            each(kmdmdinfo,function(item){
                if(isInArray(item.d,item.c))remove(item.d,item.c);
                data.push({name:item.c,deps:item.d});
            })
            document.body.appendChild(center);
            new DependencyTreeControl(data,mainCanvas,signCanvas, lable).init();         
            //var holder = document.createElement("div");
            //document.body.style["textAlign"]="center";
            //holder.setAttribute("id", "holder");
            //holder.style.position="absolute", holder.style.left="0px",  holder.style.top="0px", holder.style["backgroundColor"]="#ccc",holder.style.display="inline-block", document.body.style.overflow="hidden";
            //document.body.appendChild(holder);


            //var data = [];
            //for (var i = 0, len = kmdmdinfo.length; i < len; i++) {
            //    var item = kmdmdinfo[i];
            //    data.push({ name: item.c, deps: item.d });

            //}
            //new DepTree(({
            //    renderTo: "holder",
            //    width: window.innerWidth,
            //    height: window.innerHeight,
            //    data: data
            //}))
        }
    }
    function renderToTextarea(code,fileName){
        
        var ctt = doc.createElement("div");
        var msgDiv = doc.createElement("div");
        msgDiv.innerHTML =fileName;
        var codePanel = doc.createElement("textarea");
        ctt.appendChild(codePanel);
        ctt.appendChild(msgDiv);
        doc.body.appendChild(ctt);
        codePanel.setAttribute("rows", "8");
        codePanel.setAttribute("cols", "55");      
        codePanel.value = code;

    }
    function getViewport() {
        var d = document.documentElement, b = document.body, w = window, div = document.createElement("div");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        var lt = !(div.firstChild.nodeType === 3) ?
                { left: b.scrollLeft || d.scrollLeft, top: b.scrollTop || d.scrollTop } :
                { left: w.pageXOffset, top: w.pageYOffset };
        var wh = w.innerWidth ?
                { width: w.innerWidth, height: w.innerHeight } :
                (d && d.clientWidth && d.clientWidth != 0 ?
                    { width: d.clientWidth, height: d.clientHeight } :
                    { width: b.clientWidth, height: b.clientHeight });

        return [lt.left, lt.top, wh.width, wh.height]
    }
    function nsToCode(ns) {
        var result = [];
        var nsSplitArr = ns.split(".");
        result.push("var " + nsSplitArr[0] + "={};");
        for (var i = 1; i < nsSplitArr.length-1; i++) {
            var str = nsSplitArr[0];
                
            for (var j = 1; j < i+1; j++) {
                str +="."+ nsSplitArr[j] ;
            }
            result.push(str+ "={};");
        }
        return result;
       

    }
 

    // define.pendingModules = pendingModules;


  
    function stringifyWithFuncs(obj) {
        Object.prototype.toJSON = function () {
            var sobj = {}, i;
            for (i in this)
                if (this.hasOwnProperty(i))
                    if( typeof this[i] == 'function'){
                        //补全分号
                      
                        sobj[i] = addSi(this[i]);
                    }else{
                        sobj[i] =this[i];

                    }

            return sobj;
        };
        //stringify老版本ie需要json2
        var str = JSON.stringify(obj);

        delete Object.prototype.toJSON;

        return str;
    }
 
    function isInScopeChainVariables(scope, name) {
        if(scope){
            var vars = scope.variables._values;
        
            //if (vars.hasOwnProperty("$" + name)) {
            //    return true;
            //}
            //防止穿越两层prototype导致hasOwnProperty方法为undefined
            if (Object.prototype.hasOwnProperty.call(vars, "$" + name)) {
                return true;
            }
            if (scope.parent_scope) {
                return isInScopeChainVariables(scope.parent_scope, name);
            }
        }
        return false;
    }
 
    function isResultNodeInArray(arr ,item){

        for(var i=0;i<arr.length;i++){
            if(arr[i].start.pos==item.start.pos){
                return true;

            }

        }
        return false;
    }
    function getRef(fn,deps) {
        //     console.log(deps)
        var U2 = UglifyJS;
        currentAST = U2.parse(fn.toString());
        currentAST.figure_out_scope();
        var result = [],resultNode=[];
        currentAST.walk(new U2.TreeWalker(function (node) {
            if (node instanceof U2.AST_New) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                if (name && name != "this"&&name!="arguments" && !(name in window) && !isInScopeChainVariables(scope, name)) {
                    isResultNodeInArray(resultNode, node) || (result.push(name),resultNode.push(node));
                }
            }
            if (node instanceof U2.AST_Dot) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                if (name && name != "this"&&name!="arguments" && !(name in window) && !isInScopeChainVariables(scope, name)) {
                    isResultNodeInArray(resultNode, node) || (result.push(name),resultNode.push(node));
                }
            }
            //if (node instanceof U2.AST_SymbolRef) {
            //    var name = node.name;
            //    if (name && name != "this" && !(name in window) && !isInScopeChainVariables(node.scope, name)) {
            //        isResultNodeInArray(resultNode, node) ||( result.push(name),resultNode.push(node));
            //    }
            //}
            if (node instanceof U2.AST_Call) {
                if (node.expression.property == "get" && node.expression.expression.name == "kmdjs") {
                    if (node.args[0].value) {
                        lazyMdArr.push(node.args[0].value);
                    } else {
                        for (var i = 0, len = node.args[0].elements.length; i < len; i++) {
                            var item = node.args[0].elements[i];
                            lazyMdArr.push(item.value);
                        }
                    };
                }
            }
        }));


        var code = fn.toString();
      
        var refs = [], refNodes = [],checkNames=[],checkClassNames=[],secNames=[];
        for (var j = 0; j < classList.length; j++) {
            var arr = classList[j].split(".");
            checkNames.push(arr[0]);
            secNames.push(arr[1]);
            checkClassNames.push(arr[arr.length - 1]);
        }
        for (var k = 0; k < result.length; k++) {
            if (!isInArray(checkNames, result[k])) {
                if (!isInArray(refNodes, resultNode[k])) {

                    refs.push(result[k]);
                    refNodes.push(resultNode[k]);
                }
            } else {
                if (isInArray(checkClassNames, result[k])) {
                    for (var i = 0; i < classList.length; i++) {
                        if (result[k]== classList[i].split(".")[0]&& resultNode[k].property != classList[i].split(".")[1]) {
                            if (!isInArray(refNodes, resultNode[k])) {

                                refs.push(result[k]);
                                refNodes.push(resultNode[k]);

                            }
                            break;
                        }
                    }
                      
                }
            }
        }
        remove(refs,"arguments");
        //console.log(refs)
        //console.log(refNodes)
        for (var m = 0; m < refs.length; m++) {
            for (var n = 0; n < deps.length; n++) {
                if (isInArray(classList, deps[n] + "." + refs[m])) {
                    if(refNodes[m]){
                        (refNodes[m].fullName = deps[n] + "." + refs[m]);}
                }
            }
        }
        each(refNodes,function(item){item.replaceArea=[]});

        for (var i = refNodes.length; --i >= 0;) {
            var node = refNodes[i];
            var start_pos = node.start.pos;
            var end_pos = node.end.endpos;
            var replacement;
            var fna = node.fullName || "KMDNull";
            if (node instanceof UglifyJS.AST_New) {
                // fns = chainNS(node.expression);
                replacement = new U2.AST_New({
                    expression: new U2.AST_SymbolRef({ name: fna }),
                    args: node.args
                }).print_to_string({ beautify: true });
            } else if (node instanceof UglifyJS.AST_SymbolRef) {
                // fns = chainNS(node);
                replacement = new U2.AST_SymbolRef({ name: fna })
                    .print_to_string({ beautify: true });
            } else {
                //node instanceof UglifyJS.AST_Dot
                // fns = chainNS(node);
                replacement = new U2.AST_Dot({
                    expression: new U2.AST_SymbolRef({ name: fna }),
                    property: node.property
                }).print_to_string({ beautify: true });
            }
     

            for (var k = 0; k < refNodes.length; k++) {

                var otherNode = refNodes[k];
                if (otherNode.start.pos < start_pos && otherNode.end.endpos > end_pos) {
                    //alert(fna.length - (fna.split(".")[fna.split(".").length - 1].length))
                    //console.log(otherNode)
                    // otherNode.end.endpos += fna.length - (fna.split(".")[fna.split(".").length - 1].length)
                    var fna2 = otherNode.fullName;
                    var step = fna2.length - (fna2.split(".")[fna2.split(".").length - 1].length);
                    //   otherNode.replaceArea = [];
                    otherNode.replaceArea.push({ step: step, begin: start_pos , end: end_pos , replaceM: replacement ,children:node,self:otherNode})
                    node.parent=otherNode;
                }
            }

            //  }
        }
        for (var i = refNodes.length; --i >= 0;) {
            var node = refNodes[i];
            if(node.parent)continue;
         
           
            var start_pos = node.start.pos;
            var end_pos = node.end.endpos;
            var replacement;
            var fna = node.fullName||"_________KMDNULL______________";
            if(!node.fullName)continue;
            //if((node.name+"."+node.property)==(ProjName+".Main")){
            //    alert(1)

            //}
            if (node instanceof UglifyJS.AST_New) {
                // fns = chainNS(node.expression);
                replacement = new U2.AST_New({
                    expression: new U2.AST_SymbolRef({ name: fna }),
                    args: node.args
                }).print_to_string({ beautify: true });
            } else if (node instanceof UglifyJS.AST_SymbolRef) {
                // fns = chainNS(node);
                replacement = new U2.AST_SymbolRef({ name: fna })
                    .print_to_string({ beautify: true });
            } else {
                //node instanceof UglifyJS.AST_Dot
                // fns = chainNS(node);
                replacement = new U2.AST_Dot({
                    expression: new U2.AST_SymbolRef({ name: fna }),
                    property: node.property
                }).print_to_string({ beautify: true });
            }
            //  if (isInArray(classList, fns.replace(/_/g, "."))) {
            //code.match("")
            code = splice_string(code, start_pos, end_pos, replacement);
        
            if (node.replaceArea&&node.replaceArea.length>0&&!node.parent) {
                //console.log(code)
                // console.log(node)
                code=fixNode(node,code);
                //for (var m = 0; m < node.replaceArea.length; m++) {
                //    var item = node.replaceArea[m];
                //    code = splice_string(code, item.begin, item.end, item.replaceM);
                //}
            }
          
            //  }
        }
        return [refs,code];
    }

    function fixNode(node,code){
        var step=+ node.replaceArea[0].step, target=code.substr( node.start.pos, node.end.endpos-node.start.pos+step) ;
        for (var m = node.replaceArea.length; --m >=0; ) {



            var item = node.replaceArea[m],child=item.children;          
            if(child  instanceof UglifyJS.AST_New ){
                //    if(isInArray(replaceArr,"new "+child.fullName))continue;
                target=target.replace(new RegExp("\\bnew\\s+"+child.fullName+"\\b","g"),"new "+child.expression.name);
                target=target.replace(new RegExp("\\bnew\\s+"+child.expression.name+"\\b","g"),"new "+child.fullName);
            }else{
                //  if(isInArray(replaceArr,child.fullName))continue;
                target=target.replace(new RegExp("\\b"+child.fullName+"\\b","g"),child.expression.name)
                target=target.replace(new RegExp("\\b"+child.expression.name+"\\b","g"),child.fullName)
            }
       
            //code = splice_string(code, item.begin+item.step, item.end+item.step, item.replaceM);
            //// console.log(code)
            //for(var n= node.replaceArea.length;--n>=0;){
            //    var item2=node.replaceArea[n];
            //    if(item2.begin>item.begin){
            //        var child =item2.children;
            //        var fna2 = child.fullName;
            //        var step = fna2.length - (fna2.split(".")[fna2.split(".").length - 1].length);
            //        item2.begin+=step;
            //        item2.end+=step;
            //    }
              
            //}
           
        }
        code = splice_string(code,node.start.pos,node.end.endpos+step, target);
   
        return code;
    }

    

    function getBaseUrl() {
        var baseUrl;
        var scripts = doc.getElementsByTagName("script");

        for (var i = 0, len = scripts.length; i < len; i++) {
            var scrp = scripts[i];
            var srcL = scrp.getAttribute("src");
            if (!srcL) continue;
            var src = srcL.toUpperCase();
            var arr = src.match(/\bKMD.JS\b/g);

            if (arr) {
                var m2 = src.match(/DEBUG/g);

                if (m2) isDebug = true;
                var arr = src.split('/');
                arr.pop();
                baseUrl = arr.length ? arr.join('/') + '/' : './';
                var dm = scrp.getAttribute('data-main');
                var arr2 = dm.split("?");

                dataMain = arr2[0];
                dataMain = dataMain.replace(/.js/g, "");
                if (arr2.length > 1) {
                    if (arr2[1].toLowerCase() == "build") {

                        isBuild = true;
                    } else if(arr2[1].toLowerCase()=="view"){
                        isView = true
                    }else if(arr2[1].toLowerCase()=="combine"){

                        isCombine=true;
                    }else if(arr2[1].toLowerCase()=="split"){
                        isSplit=true;
                    }
                }
                break;
            }
        }
        return baseUrl;
    }


    // request(baseUrl + "DepTree.js");

    allPending.push("Main");
    request(dataMain + ".js", function () {
        remove(allPending, "Main");
        checkMainCpt();

        
    });
  
    //ajax(baseUrl+ "Config.js", function (aa) {
    //     classList = JSON.parse(aa);


    //})

    function ajax(url, callback) {
        var httpRequest;
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
            httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
            try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) { }
            }
        }

        if (!httpRequest) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    callback(httpRequest.responseText);
                } else {
                    alert('There was a problem with the request.');
                }
            }
        };
        httpRequest.open('GET', url,false);

        httpRequest.send();
    }


    //文件目录严格按照namespace？
    kmdjs.config = function (option) {
        ProjName = option.name;
        cBaseUrl = option.baseUrl;
        var i;
        if(!isBuild){
            if(option.build){

            
                isMtClassesBuild=true;
                isBuild=true;
                readyBuildClasses=option.build;
    
           
            }
        }
        if( option.deps){
            for (i= 0; i < option.deps.length; i++) {
                var item = option.deps[i];
                var currentUrl=item.url;
                for(var j=0;j<item.classes.length;j++){
                    var cls=item.classes[j];
                    classList.push(cls.name);
                    var arr = cls.name.split(".");
                    if(lastIndexOf( item.url,"http:")==-1){
                        mapping[cls.name]= (cBaseUrl?(cBaseUrl + "/"):"") +(lastIndexOf(currentUrl,".js")==-1? (currentUrl+ ".js"):currentUrl);
                    }else{
                        mapping[cls.name] =currentUrl;

                    }
                    //class name冲突？
                    nsmp[arr[arr.length - 1]] = cls.name;

                }
            }
        }
        if(option.classes){
            for ( i = 0; i < option.classes.length; i++) {
                var item = option.classes[i];
                classList.push(item.name);
                var arr = item.name.split(".");
                if(item.url){
                    //不允许https
                    if(lastIndexOf( item.url,"http:")==-1){

                        mapping[item.name] = cBaseUrl + "/" + item.url + "/" + arr[arr.length - 1] + ".js";
                    }else{

                        mapping[item.name] = item.url;
                    }
              

                }else{
                    if(item.kmd==false){
                        mapping[item.name] = cBaseUrl + "/" + item.name + ".js";
                        xmdModules[item.name]=true;
                    }else{
                        mapping[item.name] = cBaseUrl + "/" + arr[arr.length - 1] + ".js";
                    }
                }
                if (item.deps) {
                    mapping[item.name + "_deps"] = item.deps;
                    mapping[item.name + "_baseUrl"] =cBaseUrl + "/" + item.url + "/";
                }
            
                nsmp[arr[arr.length - 1]] = item.name;
            }
        }
    }
    kmdjs.exec=function(a){
        each(a,function(item){
            var entire=item.b.toString();
            item.b=entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
            kmdmdinfo.push(item);
        })
        
    }
    global.__class = __class;
    define.modules = global.__modules = modules;
    define.kmd=true;
    global.define = define;
    global.kmdjs = kmdjs;
})(this);

})();