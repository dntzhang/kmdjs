!function (global, undefined) {
    var define, kmdjs = {};
    var currentAST;
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
    var currentPendingModuleFullName = [];
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
        var refArr = getRef(fn, deps), ref = refArr[0];
        remove(ref, "__class");
        var newArr = [];
        for (var i = 0, len = deps.length; i < len; i++) for (var k = 0; k < ref.length; k++) isInArray(classList, deps[i] + "." + ref[k]) && !isInArray(newArr, deps[i] + "." + ref[k]) && newArr.push(deps[i] + "." + ref[k]);
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
            if (!define.modules[ns]) {
                allPending.push(ns);
                if (mapping[ns]) request(mapping[ns], function () {
                    remove(allPending, ns);
                    checkMainCpt();
                }); else throw "no module named :" + ns;
            }
        }(newArr[k]);
        window.allPending = allPending;
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
    function checkMainCpt() {
        if (allPending.length > 0) return;
        if (kmdmaincpt) return;
        kmdmaincpt = true;
        var buildArr = [];
        if (isMtClassesBuild) each(readyBuildClasses, function (ns) {
            each(kmdmdinfo, function (item) {
                if (item.c == ns) buildArr.push(item);
            });
        });
        setTimeout(function () { }, 0);
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
            combineCode += temp;
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
                combineCode += temp;
                evalOrder.push(temp);
            } else createParentCode(item);
        }
        combineCode += "\nnew " + ProjName + ".Main();\n})();";
        cpCode += '(function(n){var initializing=!1,fnTest=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,__class=function(){};__class.extend=function(n){function i(){!initializing&&this.ctor&&this.ctor.apply(this,arguments)}var f=this.prototype,u,r,t;initializing=!0,u=new this,initializing=!1;for(t in n)t!="statics"&&(u[t]=typeof n[t]=="function"&&typeof f[t]=="function"&&fnTest.test(n[t])?function(n,t){return function(){var r=this._super,i;return this._super=f[n],i=t.apply(this,arguments),this._super=r,i}}(t,n[t]):n[t]);for(r in this)this.hasOwnProperty(r)&&r!="extend"&&(i[r]=this[r]);if(i.prototype=u,n.statics)for(t in n.statics)n.statics.hasOwnProperty(t)&&(i[t]=n.statics[t],t=="ctor"&&i[t]());return i.prototype.constructor=i,i.extend=arguments.callee,i.implement=function(n){for(var t in n)u[t]=n[t]},i};\n\n' + combineCode + "})(this)";
        if (isBuild || isCombine) {
            var ctt = doc.createElement("div");
            var msgDiv = doc.createElement("div");
            var titleDiv = doc.createElement("div");
            titleDiv.innerHTML = "Build Complete!";
            msgDiv.innerHTML = isMtClassesBuild ? readyBuildClasses.toString() : ProjName + ".js ";
            var codePanel = doc.createElement("textarea");
            ctt.appendChild(titleDiv);
            ctt.appendChild(codePanel);
            ctt.appendChild(msgDiv);
            doc.body.appendChild(ctt);
            codePanel.setAttribute("rows", "8");
            codePanel.setAttribute("cols", "55");
            if (isMtClassesBuild) {
                cpCode = "";
                cpCode += "kmdjs.exec(" + JSON.stringify(buildArr) + ")";
            } else cpCode = isCombine ? cpCode : compressor(cpCode);
            codePanel.value = cpCode;
            codePanel.focus();
            codePanel.select();
            downloadFile(cpCode, ProjName + ".Main.js");
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
    function getRef(fn, deps) {
        var U2 = UglifyJS;
        currentAST = U2.parse(fn.toString());
        currentAST.figure_out_scope();
        var result = [], resultNode = [];
        currentAST.walk(new U2.TreeWalker(function (node) {
            if (node instanceof U2.AST_New) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                if (name && "this" != name && "arguments" != name && !(name in window) && !isInScopeChainVariables(scope, name)) isResultNodeInArray(resultNode, node) || (result.push(name),
                resultNode.push(node));
            }
            if (node instanceof U2.AST_Dot) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                if (name && "this" != name && "arguments" != name && !(name in window) && !isInScopeChainVariables(scope, name)) isResultNodeInArray(resultNode, node) || (result.push(name),
                resultNode.push(node));
            }
            if (node instanceof U2.AST_Call) if ("get" == node.expression.property && "kmdjs" == node.expression.expression.name) if (node.args[0].value) lazyMdArr.push(node.args[0].value); else for (var i = 0, len = node.args[0].elements.length; i < len; i++) {
                var item = node.args[0].elements[i];
                lazyMdArr.push(item.value);
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
        remove(refs, "arguments");
        for (var m = 0; m < refs.length; m++) for (var n = 0; n < deps.length; n++) if (isInArray(classList, deps[n] + "." + refs[m])) if (refNodes[m]) refNodes[m].fullName = deps[n] + "." + refs[m];
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
        return [refs, code];
    }
    function fixNode(node, code) {
        for (var m = node.replaceArea.length; --m >= 0;) {
            var item = node.replaceArea[m];
            code = splice_string(code, item.begin + item.step, item.end + item.step, item.replaceM);
            for (var n = node.replaceArea.length; --n >= 0;) {
                var item2 = node.replaceArea[n];
                if (item2.begin > item.begin) {
                    var child = item2.children;
                    var fna2 = child.fullName;
                    var step = fna2.length - fna2.split(".")[fna2.split(".").length - 1].length;
                    item2.begin += step;
                    item2.end += step;
                }
            }
        }
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
                if (arr2.length > 1) if ("build" == arr2[1].toLowerCase()) isBuild = true; else if ("view" == arr2[1].toLowerCase()) isView = true; else if ("combine" == arr2[1].toLowerCase()) isCombine = true; else if ("split" == arr2[1].toLowerCase()) isSplit = true;
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
    kmdjs.config = function (option) {
        ProjName = option.name;
        cBaseUrl = option.baseUrl;
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
                if (lastIndexOf(item.url, "http:") == -1) mapping[cls.name] = (cBaseUrl ? cBaseUrl + "/" : "") + (lastIndexOf(currentUrl, ".js") == -1 ? currentUrl + ".js" : currentUrl); else mapping[cls.name] = currentUrl;
                nsmp[arr[arr.length - 1]] = cls.name;
            }
        }
        if (option.classes) for (i = 0; i < option.classes.length; i++) {
            var item = option.classes[i];
            classList.push(item.name);
            var arr = item.name.split(".");
            if (item.url) if (lastIndexOf(item.url, "http:") == -1) mapping[item.name] = cBaseUrl + "/" + item.url + "/" + arr[arr.length - 1] + ".js"; else mapping[item.name] = item.url; else if (false == item.kmd) {
                mapping[item.name] = cBaseUrl + "/" + item.name + ".js";
                xmdModules[item.name] = true;
            } else mapping[item.name] = cBaseUrl + "/" + arr[arr.length - 1] + ".js";
            nsmp[arr[arr.length - 1]] = item.name;
        }
    };
    kmdjs.exec = function (a) {
        each(a, function (item) {
            kmdmdinfo.push(item);
        });
    };
    global.__class = __class;
    define.modules = global.__modules = modules;
    global.define = define;
    global.kmdjs = kmdjs;
}(this);
})();