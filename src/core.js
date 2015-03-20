!function (global, undefined) {
    var define, kmdjs = {};
    var currentAST, exportNamespace;
    var isDebug = false, modules = {}, classList = [], baseUrl = getBaseUrl(), mapping = {}, cBaseUrl, nsmp = {}, dataMain;
    var isBrowser = !!("undefined" !== typeof window && "undefined" !== typeof navigator && window.document);
    var ProjName;
    var kmdmdinfo = [];
    var lazyMdArr = [];
    var isMDBuild = false;
    var allPending = [];
    var isMtClassesBuild = false, readyBuildClasses = [];
    var conflictMapping = {};
    var xmdModules = {};
    function findScope(node) {
        var sp;
        function chain(node) {
            if (node.property) chain(node.expression); else {
                sp = node.scope;
                name = node.name;
            }
        }
        chain(node);
        return {
            sp: sp,
            name: name
        };
    }
    function chainNS(node) {
        var result = [];
        function chain(node) {
            if (node.property) {
                result.unshift(node.property);
                chain(node.expression);
            } else result.unshift(node.name);
        }
        chain(node);
        return result.join("_");
    }
    function splice_string(str, begin, end, replacement) {
        return str.substr(0, begin) + replacement + str.substr(end);
    }
    var beautifier_options_defaults = {
        indent_start: 0,
        indent_level: 4,
        quote_keys: false,
        space_colon: true,
        ascii_only: false,
        inline_script: false,
        width: 80,
        max_line_len: 32e3,
        screw_ie8: false,
        beautify: true,
        bracketize: false,
        comments: false,
        semicolons: false
    };
    var isIE = !!window.ActiveXObject;
    var isIE6 = isIE && !window.XMLHttpRequest;
    function addOneSI(codeStr, index, evidence) {
        var arr = codeStr.split("\n");
        arr[index] = evidence + ";";
        return arr.join("\n");
    }
    function addSi(fn) {
        var codeStr = "var a=" + fn.toString() + ";";
        if (isIE6) {
            JSLINT.jslint(codeStr, {
                maxerr: 1e4
            });
            for (var i = 0, len = JSLINT.errors.length; i < len; i++) {
                var item = JSLINT.errors[i];
                if (item && ";" == item.a) codeStr = addOneSI(codeStr, item.line - 1, item.evidence);
            }
            return codeStr.substring(6, codeStr.length - 1);
        } else {
            var ast = UglifyJS.parse(codeStr);
            var out = ast.print_to_string(beautifier_options_defaults);
            return out.replace("var a = ", "");
        }
    }
    var defined = {};
    define = function (name, deps, foctory) {
        var argc = arguments.length;
        if (1 == argc) throw "the class must take a name"; else if (2 == argc) {
            foctory = deps;
            deps = [];
        } else if (isString(deps)) deps = [deps];
        var mda = name.split(":");
        mda[0] = mda[0].trim();
        if (mda.length > 1) { mda[1] = mda[1].trim() }
        var fullname = mda[0];
        var lastIndex = lastIndexOf(fullname, ".");
        if (lastIndex == -1) {
            fullname = ProjName + "." + fullname;
            lastIndex = lastIndexOf(fullname, ".");
        }
        if (defined[fullname]) return;
        defined[fullname] = true;
        if (mda.length > 1 && lastIndexOf(mda[1], ".") == -1) mda[1] = ProjName + "." + mda[1];
        var baseClass = "__class", parentClass;
        if (1 != mda.length) if (mda[1].split(".")[0] in window && !isInArray(classList, mda[1])) baseClass = mda[1]; else {
            baseClass = mda[1];
            parentClass = mda[1];
        }
        var className = fullname.substring(lastIndex + 1, fullname.length);
        deps.unshift(fullname.substring(0, lastIndex));
        var xmd = [];
        for (var i = 0; i < deps.length; i++) if (xmdModules[deps[i]]) {
            if (!isInArray(xmd, deps[i])) xmd.push(deps[i]);
            deps.splice(i, 1);
            i--;
        }
        if (!isInArray(deps, ProjName)) deps.unshift(ProjName);
        var ldCount = 0, xmdLen = xmd.length;
        if (xmdLen > 0) for (var j = 0; j < xmdLen; j++) !function (ns) {
            allPending.push(ns);
            request(mapping[ns], function () {
                remove(allPending, ns);
                ldCount++;
                if (ldCount == xmdLen) {
                    refrence(className, deps, fullname + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname);
                    checkMainCpt();
                }
            });
        }(xmd[j]); else refrence(className, deps, fullname + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname, parentClass);
    };
    var currentPendingModuleFullName = [], compotentMapping = {};
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
    function refrence(className, deps, foctory, fullname, parentClass) {
        conflictMapping = {};
        var body;
        if (isIE6) body = foctory.replace(/"function[\s\S]*?\}"/g, function (str) {
            return str.substr(1, str.length - 2);
        }); else body = foctory.replace(/"function[\s\S]*?\};"/g, function (str) {
            return str.substr(1, str.length - 4) + "}";
        });
        body = body.replace(/(\\r)?\\n(\\t)?([\s]*?)\/\/([\s\S]*?)(?=(\\r)?\\n(\\t)?)/g, "").replace(/(\/\*[\s\S]*?\*\/)/g, "").replace(/\\r\\n/g, "").replace(/\\n/g, function (item, b, c) {
            if ("\\" == c.charAt(b - 1)) return item;
            return "";
        }).replace(/\\t/g, function (item, b, c) {
            if ("\\" == c.charAt(b - 1)) return item;
            return "";
        }).replace(/\\"/g, function (item, b, c) {
            return '"';
        }).replace(/\\'/g, function (item, b, c) {
            return "'";
        }).replace(/\\\\/g, "\\");
        body = js_beautify(body);
        try {
            var fn = new Function(body);
        } catch (ex) {
            log(body);
            throw ex.name + "__" + ex.message + "__" + ex.number + "__" + ex.description;
            return;
        }
        var allFullNameDeps = [];
        if (parentClass) {
            var parentNs = parentClass.substr(0, lastIndexOf(parentClass, "."));
            !isInArray(deps, parentNs) && deps.push(parentNs);
        }
        var refArr = getRef(fn, deps, fullname), ref = refArr[0];
        remove(ref, "__class");
        var newArr = [];
        for (var i = 0, len = deps.length; i < len; i++) for (var k = 0; k < ref.length; k++) isInArray(classList, deps[i] + "." + ref[k]) && !isInArray(newArr, deps[i] + "." + ref[k]) && newArr.push(deps[i] + "." + ref[k]);

        var frArr=refArr[2]
        for (var m = 0, frLen = frArr.length; m < frLen; m++) {
            var fr = frArr[m];
            !isInArray(newArr, fr) && newArr.push(fr);
        }
        if (parentClass && !isInArray(newArr, parentClass)) newArr.push(parentClass);
        if (isMtClassesBuild && "MAIN" == className.toUpperCase()) each(readyBuildClasses, function (item) {
            newArr.push(item);
        });
        var entire = refArr[1];
        body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        if (isDebug) log(fullname + "  ref:" + ref.toString());
        var moduleNameArr = [];
        for (i = 0; i < newArr.length; i++) {
            var xx = newArr[i].split(".");
            moduleNameArr.push(xx[xx.length - 1]);
        }
        var isPush = false;
        each(kmdmdinfo, function (item) {
            if (item.c == fullname) {
                isPush = true;
                return false;
            }
        });
        for (var ck in conflictMapping) {
            var fname = conflictMapping[ck];
            var fnameReal = fname.replace(/_/g, ".");
            if (isInArray(classList, fnameReal)) {
                moduleNameArr.push(fname);
                newArr.push(fnameReal);
            }
        }
        if (!isPush) kmdmdinfo.push({
            a: moduleNameArr,
            b: body,
            c: fullname,
            d: newArr,
            e: parentClass
        });
        if (0 == newArr.length && !isBuild) checkMainCpt(); else for (var k = 0; k < newArr.length; k++) !function (ns) {
            if (!define.modules[ns]) if (mapping[ns + "_deps"] && !compotentMapping[ns]) loadComponent(mapping[ns + "_deps"], function () {
                compotentMapping[ns] = JSON.stringify(Array.prototype.slice.call(arguments));
                allPending.push(ns);
                if (mapping[ns]) request(mapping[ns], function () {
                    remove(allPending, ns);
                    checkMainCpt();
                }); else throw "no module named :" + ns;
            }); else {
                allPending.push(ns);
                if (mapping[ns]) request(mapping[ns], function () {
                    remove(allPending, ns);
                    checkMainCpt();
                }); else throw "no module named :" + ns;
            }
        }(newArr[k]);
        window.allPending = allPending;
    }
    function loadComponent(arr, callback) {
        var count = 0, len = arr.length, datas = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            var currentUrl = cBaseUrl + "/" + arr[i];
            !function (currentUrl) {
                ajax(currentUrl, function (data) {
                    datas.push(data);
                    if (lastIndexOf(currentUrl, ".css") != -1) {
                        var cssStr = data;
                        var style = doc.createElement("style");
                        style.setAttribute("type", "text/css");
                        if (style.styleSheet) style.styleSheet.cssText = cssStr; else {
                            var cssText = doc.createTextNode(cssStr);
                            style.appendChild(cssText);
                        }
                        head.appendChild(style);
                    }
                    count++;
                    if (count == len) callback.apply(null, datas);
                });
            }(currentUrl);
        }
    }
    function dotChain(node) {
        var result = [], ep = node.end.endpos, bp;
        function chain(node) {
            if (node.property) {
                result.unshift(node.property);
                chain(node.expression);
            } else {
                bp = node.end.pos;
                result.unshift(node.name);
            }
        }
        chain(node);
        return {
            ns: result.join("."),
            bp: bp,
            ep: ep
        };
    }
    function getTopName(node) {
        var cNode;
        function chain(node) {
            if (node.property) chain(node.expression); else cNode = node;
        }
        chain(node);
        return {
            name: cNode.name,
            scope: cNode.scope
        };
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
                if (name && "this" != name && !(name in window) && !isInScopeChainVariables(scope, name)) allNS.push(dotChain(node));
            }
        }));
        var len = allNS.length;
        var result = {};
        for (var i = 0; i < len; i++) {
            var item = allNS[i];
            if (!result[item.bp]) result[item.bp] = item; else if (result[item.bp] == item.bp && item.ep > result[item.bp].ep) result[item.bp] = item;
        }
        return result;
    }
    define.pendingCallback = [];
    kmdjs.get = function (fullname, callback) {
        if (isString(fullname)) fullname = [fullname];
        for (var i = 0, len = fullname.length; i < len; i++) if (lastIndexOf(fullname[i], ".") == -1) {
            fullname[i] = ProjName + "." + fullname[i];
            currentPendingModuleFullName.push(fullname[i]);
        }
        var loaded = true;
        var mdArr = [];
        for (var i = 0, len = fullname.length; i < len; i++) if (modules[fullname[i]]) mdArr.push(modules[fullname[i]]); else loaded = false;
        if (loaded) {
            if (callback) callback.apply(null, mdArr);
        } else for (var i = 0, len = fullname.length; i < len; i++) if (!modules[fullname[i]]) {
            var ns = fullname[i];
            allPending.push(ns);
            !function (ns) {
                if (mapping[ns]) request(mapping[ns], function () {
                    if (callback) define.pendingCallback.push(callback);
                    remove(allPending, ns);
                    checkMainCpt();
                }); else throw "no module named :" + ns;
            }(ns);
        }
    };
    var kmdmaincpt = false;
    function downloadFile(code, fileName) {
        if (window.URL.createObjectURL) {
            var fileParts = [code];
            var bb = new Blob(fileParts, {
                type: "text/plain"
            });
            var dnlnk = window.URL.createObjectURL(bb);
            var dlLink = document.createElement("a");
            dlLink.setAttribute("href", dnlnk);
            dlLink.setAttribute("download", fileName);
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
        if (allPending.length > 0) return;
        if (kmdmaincpt) return;
        kmdmaincpt = true;
        var buildArr = [];
        if (isMtClassesBuild) each(readyBuildClasses, function (item) {
            getDepModule(item);
            buildArr=storeModule;
        });
        var topNsStr = "";
        each(kmdmdinfo, function (item) {
            var arr = nsToCode(item.c);
            for (var i = 0; i < arr.length; i++) {
                var item2 = arr[i];
                var isInKMD = false;
                for (var k = 0, klen = kmdmdinfo.length; k < klen; k++) if (kmdmdinfo[k].c + "={};" == item2) isInKMD = true;
                if (!isInKMD) lastIndexOf(topNsStr, item2) == -1 && (topNsStr += item2 + "\n");
            }
        });
        if (exportNamespace) {
            topNsStr = "var " + exportNamespace + "={};";

        }
        var evalOrder = [];
        var outPutMd = [];
        function createParentCode(item) {
            if (isInArray(outPutMd, item.c)) return;
            each(kmdmdinfo, function (currentItem) {
                if (currentItem.c == item.e) createParentCode(currentItem);
            });
            outPutMd.push(item.c);
            var temp = "";
            temp += "\n//begin-------------------" + item.c + "---------------------begin\n";
            temp += item.b.substr(0, lastIndexOf(item.b, "return"));
            temp += "\n//end-------------------" + item.c + "---------------------end\n";
            if (exportNamespace) {
                if (item.c.split(".")[0].toUpperCase() == exportNamespace.toUpperCase()) {

                    combineCode += temp;
                }
            } else {
                combineCode += temp;
            }
            evalOrder.push(temp);
        }
        var cpCode = "//create by kmdjs   https://github.com/kmdjs/kmdjs \n";
        var combineCode = ";(function(){\n" + topNsStr;
        kmdmdinfo.sort(function (l, r) {
            return l.c.split(".").length - r.c.split(".").length;
        });
        for (var i = 0; i < kmdmdinfo.length; i++) {
            var item = kmdmdinfo[i];
            if (isInArray(outPutMd, item.c)) continue;
            if (!item.e) {
                outPutMd.push(item.c);
                var temp = "";
                temp += "\n//begin-------------------" + item.c + "---------------------begin\n";
                temp += item.b.substr(0, lastIndexOf(item.b, "return"));
                temp += "\n//end-------------------" + item.c + "---------------------end\n";
                if (exportNamespace) {
                    if (item.c.split(".")[0].toUpperCase() == exportNamespace.toUpperCase()) {

                        combineCode += temp;
                    }
                } else {
                    combineCode += temp;
                }
                evalOrder.push(temp);
            } else createParentCode(item);
        }
        for (var cptKey in compotentMapping) {
            combineCode += "\n" + cptKey + ".baseUrl=\"" + mapping[cptKey+"_baseUrl"]+"\"";
            combineCode += "\n" + cptKey + ".deps=" + compotentMapping[cptKey];
            evalOrder.push( "\n" + cptKey + ".baseUrl=\"" + mapping[cptKey+"_baseUrl"]+"\"");
            evalOrder.push("\n" + cptKey + ".deps=" + compotentMapping[cptKey]);
        }
        if (!exportNamespace) combineCode += "\nnew " + ProjName + ".Main();\n";
        if (exportNamespace) {
            combineCode+=
                 "  if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = "+exportNamespace+" }\n"+
        "else if (typeof define === 'function' && define.amd) { define("+exportNamespace+") }\n"+
        "else { win." + exportNamespace + " = " + exportNamespace + " };"
        }
        cpCode += '(function(win){var initializing=!1,fnTest=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,__class=function(){};__class.extend=function(n){function i(){!initializing&&this.ctor&&this.ctor.apply(this,arguments)}var f=this.prototype,u,r,t;initializing=!0,u=new this,initializing=!1;for(t in n)t!="statics"&&(u[t]=typeof n[t]=="function"&&typeof f[t]=="function"&&fnTest.test(n[t])?function(n,t){return function(){var r=this._super,i;return this._super=f[n],i=t.apply(this,arguments),this._super=r,i}}(t,n[t]):n[t]);for(r in this)this.hasOwnProperty(r)&&r!="extend"&&(i[r]=this[r]);if(i.prototype=u,n.statics)for(t in n.statics)n.statics.hasOwnProperty(t)&&(i[t]=n.statics[t],t=="ctor"&&i[t]());return i.prototype.constructor=i,i.extend=arguments.callee,i.implement=function(n){for(var t in n)u[t]=n[t]},i};\n\n' + combineCode + "})();})(Function('return this')())";
        if (isBuild || isCombine) {
            var ctt = doc.createElement("div");
            var msgDiv = doc.createElement("div");
            var titleDiv = doc.createElement("div");
            titleDiv.innerHTML = "Build Complete!";
            msgDiv.innerHTML = isMtClassesBuild ? readyBuildClasses.join("<br/>") : ProjName + ".js ";
            if (exportNamespace) {
                msgDiv.innerHTML = exportNamespace.toLowerCase() + ".js ";

            }
            var codePanel = doc.createElement("textarea");
            ctt.appendChild(titleDiv);
            ctt.appendChild(codePanel);
            ctt.appendChild(msgDiv);
            doc.body.appendChild(ctt);
            codePanel.setAttribute("rows", "8");
            codePanel.setAttribute("cols", "55");
            if (isMtClassesBuild) {
                cpCode = "kmdjs.exec([\n";
                each(buildArr, function (item, index) {
                    cpCode += "{\n";
                    cpCode += "a:" + JSON.stringify(item.a) + ",\n";
                    cpCode += "b:function(){" + item.b.toString() + "\n},\n";
                    cpCode += "c:" + JSON.stringify(item.c) + ",\n";
                    cpCode += "d:" + JSON.stringify(item.d);
                    if (item.e) cpCode += ",\ne:" + JSON.stringify(item.e) + "\n"; else cpCode += "\n";
                    cpCode += "}" + (0 == index ? "" : ",") + "\n";
                });
                cpCode += "])";
            } else cpCode = isCombine ? cpCode : compressor(cpCode);
            codePanel.value = cpCode;
            codePanel.focus();
            codePanel.select();
            if (exportNamespace) {
                downloadFile(cpCode, exportNamespace.toLowerCase()+ ".js");
            } else {
                downloadFile(cpCode, ProjName + ".Main.js");
            }
           
            var lmclone = [];
            each(lazyMdArr, function (item) {
                lmclone.push(item);
            });
        }
        if (isDebug) log(cpCode);
        if (!isBuild && !isCombine && !isView && !isSplit) {
            eval('(function(n){var t=!1,r=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,i=function(){};i.extend=function(n){function u(){!t&&this.ctor&&this.ctor.apply(this,arguments)}var o=this.prototype,e,f,i;t=!0,e=new this,t=!1;for(i in n)i!="statics"&&(e[i]=typeof n[i]=="function"&&typeof o[i]=="function"&&r.test(n[i])?function(n,t){return function(){var r=this._super,i;return this._super=o[n],i=t.apply(this,arguments),this._super=r,i}}(i,n[i]):n[i]);for(f in this)this.hasOwnProperty(f)&&f!="extend"&&(u[f]=this[f]);if(u.prototype=e,n.statics)for(i in n.statics)n.statics.hasOwnProperty(i)&&(u[i]=n.statics[i],i=="ctor"&&u[i]());return u.prototype.constructor=u,u.extend=arguments.callee,u.implement=function(n){for(var t in n)e[t]=n[t]},u},n.__class=i})(this)');
            eval(topNsStr);
            for (var i = 0; i < evalOrder.length; i++) eval(evalOrder[i]);
            eval("new " + ProjName + ".Main();");
        }
        if (isSplit) {
            var baseCode = '(function(n){var t=!1,r=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,i=function(){};i.extend=function(n){function u(){!t&&this.ctor&&this.ctor.apply(this,arguments)}var o=this.prototype,e,f,i;t=!0,e=new this,t=!1;for(i in n)i!="statics"&&(e[i]=typeof n[i]=="function"&&typeof o[i]=="function"&&r.test(n[i])?function(n,t){return function(){var r=this._super,i;return this._super=o[n],i=t.apply(this,arguments),this._super=r,i}}(i,n[i]):n[i]);for(f in this)this.hasOwnProperty(f)&&f!="extend"&&(u[f]=this[f]);if(u.prototype=e,n.statics)for(i in n.statics)n.statics.hasOwnProperty(i)&&(u[i]=n.statics[i],i=="ctor"&&u[i]());return u.prototype.constructor=u,u.extend=arguments.callee,u.implement=function(n){for(var t in n)e[t]=n[t]},u},n.__class=i})(this)';
            renderToTextarea(baseCode, "Base.js");
            downloadFile(baseCode, "Base.js");
            renderToTextarea(topNsStr, "Namespace.js");
            downloadFile(topNsStr, "Namespace.js");
            for (var i = 0; i < evalOrder.length; i++) {
                renderToTextarea(evalOrder[i], evalOrder[i].match(/-------------------[\s\S]*?---------------------/)[0].replace(/[-]*/g, "") + ".js");
                downloadFile(evalOrder[i], evalOrder[i].match(/-------------------[\s\S]*?---------------------/)[0].replace(/[-]*/g, "") + ".js");
            }
            renderToTextarea("new " + ProjName + ".Main();", ProjName + ".Main.js");
            downloadFile("new " + ProjName + ".Main();", ProjName + ".Main.js");
        }
        if (isView) {
            var vp = getViewport();
            var center = document.createElement("center");
            var mainCanvas = document.createElement("canvas");
            mainCanvas.width = vp[2] - 300;
            mainCanvas.height = vp[3] - 20;
            var signCanvas = document.createElement("canvas");
            signCanvas.width = 200;
            signCanvas.height = 20;
            var lable = document.createElement("div");
            center.appendChild(mainCanvas);
            center.appendChild(signCanvas);
            center.appendChild(lable);
            document.body.style.cssText = "margin: 0px; height: 100%;width: 100%;display: table;overflow:hidden;";
            center.style.cssText = " display: table-cell; vertical-align: middle;";
            signCanvas.style.cssText = "  position: absolute;bottom: 10px;right: 10px;";
            lable.style.cssText = " position: absolute;bottom: 10px; left: 10px; font: 12pt Lucida Sans Typewriter, Monospace;";
            var data = [];
            each(kmdmdinfo, function (item) {
                if (isInArray(item.d, item.c)) remove(item.d, item.c);
                data.push({
                    name: item.c,
                    deps: item.d
                });
            });
            document.body.appendChild(center);
            new DependencyTreeControl(data, mainCanvas, signCanvas, lable).init();
        }
    }
    function renderToTextarea(code, fileName) {
        var ctt = doc.createElement("div");
        var msgDiv = doc.createElement("div");
        msgDiv.innerHTML = fileName;
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
        var lt = !(3 === div.firstChild.nodeType) ? {
            left: b.scrollLeft || d.scrollLeft,
            top: b.scrollTop || d.scrollTop
        } : {
            left: w.pageXOffset,
            top: w.pageYOffset
        };
        var wh = w.innerWidth ? {
            width: w.innerWidth,
            height: w.innerHeight
        } : d && d.clientWidth && 0 != d.clientWidth ? {
            width: d.clientWidth,
            height: d.clientHeight
        } : {
            width: b.clientWidth,
            height: b.clientHeight
        };
        return [lt.left, lt.top, wh.width, wh.height];
    }
    function nsToCode(ns) {
        var result = [];
        var nsSplitArr = ns.split(".");
        result.push("var " + nsSplitArr[0] + "={};");
        for (var i = 1; i < nsSplitArr.length - 1; i++) {
            var str = nsSplitArr[0];
            for (var j = 1; j < i + 1; j++) str += "." + nsSplitArr[j];
            result.push(str + "={};");
        }
        return result;
    }
    function stringifyWithFuncs(obj) {
        Object.prototype.toJSON = function () {
            var sobj = {}, i;
            for (i in this) if (this.hasOwnProperty(i)) if ("function" == typeof this[i]) sobj[i] = addSi(this[i]); else sobj[i] = this[i];
            return sobj;
        };
        var str = JSON.stringify(obj);
        delete Object.prototype.toJSON;
        return str;
    }
    function isInScopeChainVariables(scope, name) {
        if (scope) {
            var vars = scope.variables._values;
            if (Object.prototype.hasOwnProperty.call(vars, "$" + name)) return true;
            if (scope.parent_scope) return isInScopeChainVariables(scope.parent_scope, name);
        }
        return false;
    }
    function isResultNodeInArray(arr, item) {
        for (var i = 0; i < arr.length; i++) if (arr[i].start.pos == item.start.pos) return true;
        return false;
    }
    function chainDotNames(dotNode) {
        var arr = [];
        function chain(node) {
            arr.push(node.property||node.name);
            if (node.expression)
                chain(node.expression);
        }
        chain(dotNode)
        return arr.reverse().join(".")
    }
    function getRef(fn, deps, fullname) {
        var U2 = UglifyJS;
        currentAST = U2.parse(fn.toString());
        currentAST.figure_out_scope();
        var result = [], resultNode = [],dotNodes=[];
        currentAST.walk(new U2.TreeWalker(function (node) {
            if (node instanceof U2.AST_New) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                if (name && "this" != name && "console" != name && "arguments" != name && !isInScopeChainVariables(scope, name)) isResultNodeInArray(resultNode, node) || (result.push(name),
                resultNode.push(node));
            }
            if (node instanceof U2.AST_Dot) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                if (name && "this" != name && "console" != name && "arguments" != name && !isInScopeChainVariables(scope, name)) isResultNodeInArray(resultNode, node) || (result.push(name),
                resultNode.push(node));
                dotNodes.push(node);
            }
            if (node instanceof U2.AST_Call) if ("get" == node.expression.property && "kmdjs" == node.expression.expression.name) if (node.args[0].value) lazyMdArr.push(node.args[0].value); else for (var i = 0, len = node.args[0].elements.length; i < len; i++) {
                var item = node.args[0].elements[i];
                lazyMdArr.push(item.value);
            }

            if (node instanceof U2.AST_SymbolRef) {
                var name = node.name, scope = node.scope;
                if (name && "this" != name && "console" != name && "arguments" != name && !isInScopeChainVariables(scope, name)) isResultNodeInArray(resultNode, node) || (result.push(name),
               resultNode.push(node));
            }
        }));

       
        var code = fn.toString();
        var refs = [], refNodes = [], checkNames = [], checkClassNames = [], secNames = [];
        for (var j = 0; j < classList.length; j++) {
            var arr = classList[j].split(".");
            checkNames.push(arr[0]);
            secNames.push(arr[1]);
            checkClassNames.push(arr[arr.length - 1]);
        }
        for (var k = 0; k < result.length; k++) if (!isInArray(checkNames, result[k])) {
            if (!isInArray(refNodes, resultNode[k])) {
                refs.push(result[k]);
                refNodes.push(resultNode[k]);
            }
        } else if (isInArray(checkClassNames, result[k])) for (var i = 0; i < classList.length; i++) if (result[k] == classList[i].split(".")[0] && resultNode[k].property != classList[i].split(".")[1]) {
            if (!isInArray(refNodes, resultNode[k])) {
                refs.push(result[k]);
                refNodes.push(resultNode[k]);
            }
            break;
        }

        for (var m = 0, refsLength = refs.length; m <refsLength; m++) {
            var hasAddToClass = false;
            for (var n = 0; n < deps.length; n++) {


                if (isInArray(classList, deps[n] + "." + refs[m])) {
                    if (refNodes[m]) { refNodes[m].fullName = deps[n] + "." + refs[m]; }
                    hasAddToClass = true;
                } 
            }

        
            if (refs[m] != ProjName && refs[m].toUpperCase() != "MAIN" && !hasAddToClass) {
                var fnStr = fn.toString(), errorNode = refNodes[m], unRegistClass = refs[m];
                if (unRegistClass in window) {
                    refNodes.splice(m, 1);
                    refs.splice(m, 1);
                    m--;
                    refsLength--;
                } else {
                    console.error(".....\n" + fnStr.substring(errorNode.start.pos - 150, errorNode.end.endpos + 150) + "\n....." + "\n See the above code !【" + unRegistClass + "】 class is not in classes of kmdjs.config ! the error is from  【" + mapping[fullname] + "】");

                    throw " Please solve the problem mentioned above and then run the code again :) ";
                }
            }
       
        }
     
        each(refNodes, function (item) {
            item.replaceArea = [];
        });
        for (var i = refNodes.length; --i >= 0;) {
            var node = refNodes[i];
            var start_pos = node.start.pos;
            var end_pos = node.end.endpos;
            var replacement;
            var fna = node.fullName || "KMDNull";
            if (node instanceof UglifyJS.AST_New) replacement = new U2.AST_New({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                args: node.args
            }).print_to_string({
                beautify: true
            }); else if (node instanceof UglifyJS.AST_SymbolRef) replacement = new U2.AST_SymbolRef({
                name: fna
            }).print_to_string({
                beautify: true
            }); else replacement = new U2.AST_Dot({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                property: node.property
            }).print_to_string({
                beautify: true
            });
            for (var k = 0; k < refNodes.length; k++) {
                var otherNode = refNodes[k];
                if (otherNode.start.pos < start_pos && otherNode.end.endpos > end_pos) {
                    var fna2 = otherNode.fullName;
                    var step = fna2.length - fna2.split(".")[fna2.split(".").length - 1].length;
                    otherNode.replaceArea.push({
                        step: step,
                        begin: start_pos,
                        end: end_pos,
                        replaceM: replacement,
                        children: node,
                        self: otherNode
                    });
                    node.parent = otherNode;
                }
            }
        }
        for (var i = refNodes.length; --i >= 0;) {
            var node = refNodes[i];
            if (node.parent) continue;
            var start_pos = node.start.pos;
            var end_pos = node.end.endpos;
            var replacement;
            var fna = node.fullName || "_________KMDNULL______________";
            if (!node.fullName) continue;
            if (node instanceof UglifyJS.AST_New) replacement = new U2.AST_New({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                args: node.args
            }).print_to_string({
                beautify: true
            }); else if (node instanceof UglifyJS.AST_SymbolRef) replacement = new U2.AST_SymbolRef({
                name: fna
            }).print_to_string({
                beautify: true
            }); else replacement = new U2.AST_Dot({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                property: node.property
            }).print_to_string({
                beautify: true
            });
            code = splice_string(code, start_pos, end_pos, replacement);
            if (node.replaceArea && node.replaceArea.length > 0 && !node.parent) code = fixNode(node, code);
        }

        //找出直接ns打点使用类的
        var fullRef = [];
            for (var kkk = 0, len = dotNodes.length; kkk < len; kkk++) {
                var fr= chainDotNames(dotNodes[kkk]);
                if (isInArray(classList, fr) && !isInArray(fullRef, fr)) {
                    fullRef.push(fr);
                }
            }
           
      
        return [refs, code, fullRef];
    }
    function replaceToFullName(code,target,replacement){
        var matchReg = new RegExp("\"(?:\\\\\"|[^\"])*\"|\'(?:\\\\\'|[^\'])*\'|\\/\\*[\\S\\s]*?\\*\\/|\\/(?:\\\\\\/|[^/\\r\\n])+\\/(?=[^\\/])|\\/\\/.*|(?:)(\\b)("+target+")\\1", "g");
        code=code.replace(matchReg, function (m, m1, m2) {                  
            if (m2) {
                return replacement;
            }
            return m;
        })
        return code;
    }
    function fixNode(node, code) {
        var step = +node.replaceArea[0].step, target = code.substr(node.start.pos, node.end.endpos - node.start.pos + step);
        for (var m = node.replaceArea.length; --m >= 0;) {
            var item = node.replaceArea[m], child = item.children;
            if (child instanceof UglifyJS.AST_New) {
                //target = target.replace(new RegExp("\\bnew\\s+" + child.fullName + "\\b", "g"), "new " + child.expression.name);
                //target = target.replace(new RegExp("\\bnew\\s+" + child.expression.name + "\\b", "g"), "new " + child.fullName);
                target=replaceToFullName(target, "new\\s+" + child.fullName ,"new " + child.expression.name);
                target=replaceToFullName(target, "new\\s+" + child.expression.name,"new " + child.fullName);
            } else if (child instanceof UglifyJS.AST_SymbolRef) {
                //target = target.replace(new RegExp("\\b" + child.fullName + "\\b", "g"), child.expression.name);
                //target = target.replace(new RegExp("\\b" + child.expression.name + "\\b", "g"), child.fullName);
                target = replaceToFullName(target, child.fullName, child.name);
                target = replaceToFullName(target, child.name, child.fullName);
            } else {
                target = replaceToFullName(target, child.fullName, child.expression.name);
                target = replaceToFullName(target, child.expression.name, child.fullName);
            }
        }
        code = splice_string(code, node.start.pos, node.end.endpos + step, target);
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
                var arr = src.split("/");
                arr.pop();
                baseUrl = arr.length ? arr.join("/") + "/" : "./";
                var dm = scrp.getAttribute("data-main");
                var arr2 = dm.split("?");
                dataMain = arr2[0];
                dataMain = dataMain.replace(/.js/g, "");
                if (arr2.length > 1) {
                    if (lastIndexOf(arr2[1], "&") == -1) {
                        if ("build" == arr2[1].toLowerCase()) isBuild = true; else if ("view" == arr2[1].toLowerCase()) isView = true; else if ("combine" == arr2[1].toLowerCase()) isCombine = true; else if ("split" == arr2[1].toLowerCase()) isSplit = true;
                    } else {
                        var actionCmd = arr2[1].split("&")[0];
                        exportNamespace = arr2[1].split("&")[1];
                        
                        if ("build" == actionCmd.toLowerCase()) isBuild = true; else if ("view" == actionCmd.toLowerCase()) isView = true; else if ("combine" == actionCmd.toLowerCase()) isCombine = true; else if ("split" == actionCmd.toLowerCase()) isSplit = true;
                    }
                }
                break;
            }
        }
        return baseUrl;
    }
    allPending.push("Main");
    request(dataMain + ".js", function () {
        remove(allPending, "Main");
        checkMainCpt();
    });
    function ajax(url, callback) {
        var httpRequest;
        if (window.XMLHttpRequest) httpRequest = new XMLHttpRequest(); else if (window.ActiveXObject) try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) { }
        }
        if (!httpRequest) {
            alert("Giving up :( Cannot create an XMLHTTP instance");
            return false;
        }
        httpRequest.onreadystatechange = function () {
            if (4 === httpRequest.readyState) if (200 === httpRequest.status) callback(httpRequest.responseText); else alert("There was a problem with the request.");
        };
        httpRequest.open("GET", url, false);
        httpRequest.send();
    }
    function correctionUrl(url) {
        if (url.substring(url.length - 3) == ".js") {
            return url;
        } else {
            return url+".js";
        }

    }
    function generateUrl(baseUrl, url) {
        var index = baseUrl.length - 1;
        if (baseUrl[index] === "/") baseUrl = baseUrl.substr(0, index);

        var urlDotArr = url.match(/\.\./g);
        var urlDotCount = urlDotArr ? urlDotArr.length : 0;

        var fullUrl = (baseUrl + "/" + url).replace(/\/+/g, "/");
        if (urlDotCount === 0) return fullUrl;

        var arr1 = baseUrl.split("/");
        var arr2 = url.split("/");

        var uLen = arr2.length, bLen = arr1.length, removeCount = 0;;
        for (var i = bLen - 1; i > -1 ; i--) {
            if (arr1[i] !== ".." && removeCount < urlDotCount) {
                arr1.splice(i, 1);
                removeCount++;
                arr2.splice(0, 1);

            } else {
                break;
            }


        }
        var result = arr1.join("/") + "/" + arr2.join("/");
        if (result[0] === "/") {
            result = result.substr(1, result.length - 1);
        }
        return result;
    }
    kmdjs.config = function (option) {
        ProjName = option.name;
        cBaseUrl = option.baseUrl;
        if (!cBaseUrl) {
           
            var dataMainArr = dataMain.split("/"), dataMainArrLen = dataMainArr.length;
           
            if (dataMainArrLen > 0) {
                dataMainArr.splice(dataMainArr.length - 1, 1)
                cBaseUrl = dataMainArr.join("/");
            } else {
                cBaseUrl = "";
            }       
        }
       
        var i;
        if (!isBuild) if (option.build) {
            isMtClassesBuild = true;
            isBuild = true;
            readyBuildClasses = option.build;
        }
        if (option.deps) for (i = 0; i < option.deps.length; i++) {
            var item = option.deps[i];
            var currentUrl = item.url;
            for (var j = 0; j < item.classes.length; j++) {
                var cls = item.classes[j];
                classList.push(cls.name);
                var arr = cls.name.split(".");
                if (lastIndexOf(item.url, "http:") == -1) {
                    mapping[cls.name] = correctionUrl(generateUrl(cBaseUrl, currentUrl));
                } else {
                    mapping[cls.name] = currentUrl;
                }
                nsmp[arr[arr.length - 1]] = cls.name;
            }
        }
        if (option.classes) {
            for (i = 0; i < option.classes.length; i++) {
                var item = option.classes[i];
                classList.push(item.name);
                var arr = item.name.split(".");
                if (item.url) {
                    if (lastIndexOf(item.url, "http:") == -1) {
                        if (item.url.indexOf("./") == 0) {
                            mapping[item.name] = correctionUrl(item.url.replace("./", ""));
                        } else {
                            mapping[item.name] = correctionUrl(generateUrl(cBaseUrl, item.url));
                        }
                    } else {
                        mapping[item.name] = item.url;
                    }
                } else if (false == item.kmd) {
                    mapping[item.name] = cBaseUrl + "/" + item.name + ".js";
                    xmdModules[item.name] = true;
                } else {
                    mapping[item.name] = cBaseUrl + "/" + arr[arr.length - 1].toLowerCase() + ".js";
                }
                if (item.deps) {
                    mapping[item.name + "_deps"] = item.deps;
                    mapping[item.name + "_baseUrl"] = cBaseUrl + "/" + item.url + "/";
                }
                nsmp[arr[arr.length - 1]] = item.name;
            }
        }
    };
    kmdjs.exec = function (a) {
        each(a, function (item) {
            var entire = item.b.toString();
            item.b = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
            kmdmdinfo.push(item);
        });
    };
    global.__class = __class;
    define.modules = global.__modules = modules;
    define.kmd=true;
    global.define = define;
    global.kmdjs = kmdjs;
}(this);
})();