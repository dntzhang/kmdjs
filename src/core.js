!function (global, undefined) {
    function findScope(node) {
        function chain(node) {
            node.property ? chain(node.expression) : (sp = node.scope, name = node.name);
        }
        var sp;
        return chain(node), {
            sp: sp,
            name: name
        };
    }
    function chainNS(node) {
        function chain(node) {
            node.property ? (result.unshift(node.property), chain(node.expression)) : result.unshift(node.name);
        }
        var result = [];
        return chain(node), result.join("_");
    }
    function splice_string(str, begin, end, replacement) {
        return str.substr(0, begin) + replacement + str.substr(end);
    }
    function addOneSI(codeStr, index, evidence) {
        var arr = codeStr.split("\n");
        return arr[index] = evidence + ";", arr.join("\n");
    }
    function addSi(fn) {
        var codeStr = "var a=" + fn + ";";
        if (isIE6) {
            JSLINT.jslint(codeStr, {
                maxerr: 1e4
            });
            for (var i = 0, len = JSLINT.errors.length; len > i; i++) {
                var item = JSLINT.errors[i];
                item && ";" == item.a && (codeStr = addOneSI(codeStr, item.line - 1, item.evidence));
            }
            return codeStr.substring(6, codeStr.length - 1);
        }
        var ast = UglifyJS.parse(codeStr), out = ast.print_to_string(beautifier_options_defaults);
        return out.replace("var a = ", "");
    }
    function compressor(fn) {
        var ast = UglifyJS.parse("" + fn);
        ast.figure_out_scope();
        var sq = UglifyJS.Compressor(), compressed_ast = ast.transform(sq);
        compressed_ast.compute_char_frequency(), compressed_ast.mangle_names();
        var code = compressed_ast.print_to_string();
        return code;
    }
    function refrence(className, deps, foctory, fullname, parentClass) {
        conflictMapping = {};
        var body;
        body = isIE6 ? foctory.replace(/"function[\s\S]*?\}"/g, function (str) {
            return str.substr(1, str.length - 2);
        }) : foctory.replace(/"function[\s\S]*?\};"/g, function (str) {
            return str.substr(1, str.length - 4) + "}";
        }), body = body.replace(/(\\r)?\\n(\\t)?([\s]*?)\/\/([\s\S]*?)(?=(\\r)?\\n(\\t)?)/g, "").replace(/(\/\*[\s\S]*?\*\/)/g, "").replace(/\\r\\n/g, "").replace(/\\n/g, function (item, b, c) {
            return "\\" == c.charAt(b - 1) ? item : "";
        }).replace(/\\t/g, function (item, b, c) {
            return "\\" == c.charAt(b - 1) ? item : "";
        }).replace(/\\"/g, function () {
            return '"';
        }).replace(/\\'/g, function () {
            return "'";
        }).replace(/\\\\/g, "\\"), body = js_beautify(body);
        try {
            var fn = Function(body);
        } catch (ex) {
            throw log(body), ex.name + "__" + ex.message + "__" + ex.number + "__" + ex.description;
        }
        if (parentClass) {
            var parentNs = parentClass.substr(0, lastIndexOf(parentClass, "."));
            !isInArray(deps, parentNs) && deps.push(parentNs);
        }
        var refArr = getRef(fn, deps), ref = refArr[0];
        remove(ref, "__class");
        for (var newArr = [], i = 0, len = deps.length; len > i; i++) for (var k = 0; k < ref.length; k++) isInArray(classList, deps[i] + "." + ref[k]) && !isInArray(newArr, deps[i] + "." + ref[k]) && newArr.push(deps[i] + "." + ref[k]);
        parentClass && !isInArray(newArr, parentClass) && newArr.push(parentClass), isMtClassesBuild && "MAIN" == className.toUpperCase() && each(readyBuildClasses, function (item) {
            newArr.push(item);
        });
        var entire = refArr[1];
        body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}")), isDebug && (log(fullname + "  ref:" + ref),
        log(body + "\n//@ sourceURL=" + (className || "anonymous") + ".js"));
        var moduleNameArr = [];
        for (i = 0; i < newArr.length; i++) {
            var xx = newArr[i].split(".");
            moduleNameArr.push(xx[xx.length - 1]);
        }
        var isPush = !1;
        each(kmdmdinfo, function (item) {
            return item.c == fullname ? (isPush = !0, !1) : undefined;
        });
        for (var ck in conflictMapping) {
            var fname = conflictMapping[ck], fnameReal = fname.replace(/_/g, ".");
            isInArray(classList, fnameReal) && (moduleNameArr.push(fname), newArr.push(fnameReal));
        }
        if (isPush || kmdmdinfo.push({
            a: moduleNameArr,
            b: body,
            c: fullname,
            d: newArr,
            e: parentClass
        }), 0 != newArr.length || isBuild) for (var k = 0; k < newArr.length; k++) !function (ns) {
            if (!define.modules[ns]) {
                if (allPending.push(ns), !mapping[ns]) throw "no module named :" + ns;
                request(mapping[ns], function () {
                    remove(allPending, ns), checkMainCpt();
                });
            }
        }(newArr[k]); else checkMainCpt();
        window.allPending = allPending;
    }
    function dotChain(node) {
        function chain(node) {
            node.property ? (result.unshift(node.property), chain(node.expression)) : (bp = node.end.pos,
            result.unshift(node.name));
        }
        var bp, result = [], ep = node.end.endpos;
        return chain(node), {
            ns: result.join("."),
            bp: bp,
            ep: ep
        };
    }
    function getTopName(node) {
        function chain(node) {
            node.property ? chain(node.expression) : cNode = node;
        }
        var cNode;
        return chain(node), {
            name: cNode.name,
            scope: cNode.scope
        };
    }
    function getNSRef(fn) {
        var U2 = UglifyJS, ast = U2.parse("" + fn);
        ast.figure_out_scope();
        var allNS = [];
        ast.walk(new U2.TreeWalker(function (node) {
            if (node instanceof U2.AST_Dot) {
                var cc = getTopName(node), name = (node.expression, cc.name), scope = cc.scope;
                !name || "this" == name || name in window || isInScopeChainVariables(scope, name) || allNS.push(dotChain(node));
            }
        }));
        for (var len = allNS.length, result = {}, i = 0; len > i; i++) {
            var item = allNS[i];
            result[item.bp] ? result[item.bp] == item.bp && item.ep > result[item.bp].ep && (result[item.bp] = item) : result[item.bp] = item;
        }
        return result;
    }
    function downloadFile(code, fileName) {
        if (window.URL.createObjectURL) {
            var fileParts = [code], bb = new Blob(fileParts, {
                type: "text/plain"
            }), dnlnk = window.URL.createObjectURL(bb), dlLink = document.createElement("a");
            dlLink.setAttribute("href", dnlnk), dlLink.setAttribute("download", fileName), dlLink.click();
        }
    }
    function checkMainCpt() {
        function createParentCode(item) {
            if (!isInArray(outPutMd, item.c)) {
                each(kmdmdinfo, function (currentItem) {
                    currentItem.c == item.e && createParentCode(currentItem);
                }), outPutMd.push(item.c);
                var temp = "";
                temp += "\n//begin-------------------" + item.c + "---------------------begin\n",
                temp += item.b.substr(0, lastIndexOf(item.b, "return")), temp += "\n//end-------------------" + item.c + "---------------------end\n",
                combineCode += temp, evalOrder.push(temp);
            }
        }
        if (!(allPending.length > 0 || kmdmaincpt)) {
            kmdmaincpt = !0;
            var buildArr = [];
            isMtClassesBuild && each(readyBuildClasses, function (ns) {
                each(kmdmdinfo, function (item) {
                    item.c == ns && buildArr.push(item);
                });
            }), setTimeout(function () { }, 0);
            var topNsStr = "";
            each(kmdmdinfo, function (item) {
                for (var arr = nsToCode(item.c), i = 0; i < arr.length; i++) {
                    var item2 = arr[i];
                    -1 == lastIndexOf(topNsStr, item2) && (topNsStr += item2 + "\n");
                }
            });
            for (var evalOrder = [], outPutMd = [], cpCode = "//create by kmdjs   https://github.com/kmdjs/kmdjs \n", combineCode = ";(function(){\n" + topNsStr, i = 0; i < kmdmdinfo.length; i++) {
                var item = kmdmdinfo[i];
                if (!isInArray(outPutMd, item.c)) if (item.e) createParentCode(item); else {
                    outPutMd.push(item.c);
                    var temp = "";
                    temp += "\n//begin-------------------" + item.c + "---------------------begin\n",
                    temp += item.b.substr(0, lastIndexOf(item.b, "return")), temp += "\n//end-------------------" + item.c + "---------------------end\n",
                    combineCode += temp, evalOrder.push(temp);
                }
            }
            if (combineCode += "\nnew " + ProjName + ".Main();\n})();", cpCode += '(function(n){var initializing=!1,fnTest=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,__class=function(){};__class.extend=function(n){function i(){!initializing&&this.ctor&&this.ctor.apply(this,arguments)}var f=this.prototype,u,r,t;initializing=!0,u=new this,initializing=!1;for(t in n)t!="statics"&&(u[t]=typeof n[t]=="function"&&typeof f[t]=="function"&&fnTest.test(n[t])?function(n,t){return function(){var r=this._super,i;return this._super=f[n],i=t.apply(this,arguments),this._super=r,i}}(t,n[t]):n[t]);for(r in this)this.hasOwnProperty(r)&&r!="extend"&&(i[r]=this[r]);if(i.prototype=u,n.statics)for(t in n.statics)n.statics.hasOwnProperty(t)&&(i[t]=n.statics[t],t=="ctor"&&i[t]());return i.prototype.constructor=i,i.extend=arguments.callee,i.implement=function(n){for(var t in n)u[t]=n[t]},i};\n\n' + combineCode + "})(this)",
            isBuild || isCombine) {
                var ctt = doc.createElement("div"), msgDiv = doc.createElement("div"), titleDiv = doc.createElement("div");
                titleDiv.innerHTML = "Build Complete!", msgDiv.innerHTML = isMtClassesBuild ? "" + readyBuildClasses : ProjName + ".js ";
                var codePanel = doc.createElement("textarea");
                ctt.appendChild(titleDiv), ctt.appendChild(codePanel), ctt.appendChild(msgDiv),
                doc.body.appendChild(ctt), codePanel.setAttribute("rows", "8"), codePanel.setAttribute("cols", "55"),
                isMtClassesBuild ? (cpCode = "", cpCode += "kmdjs.exec(" + JSON.stringify(buildArr) + ")") : cpCode = isCombine ? cpCode : compressor(cpCode),
                codePanel.value = cpCode, codePanel.focus(), codePanel.select(), downloadFile(cpCode, ProjName + ".Main.js");
                var lmclone = [];
                each(lazyMdArr, function (item) {
                    lmclone.push(item);
                });
            }
            if (!isBuild && !isCombine && !isView) {
                eval('(function(n){var t=!1,r=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,i=function(){};i.extend=function(n){function u(){!t&&this.ctor&&this.ctor.apply(this,arguments)}var o=this.prototype,e,f,i;t=!0,e=new this,t=!1;for(i in n)i!="statics"&&(e[i]=typeof n[i]=="function"&&typeof o[i]=="function"&&r.test(n[i])?function(n,t){return function(){var r=this._super,i;return this._super=o[n],i=t.apply(this,arguments),this._super=r,i}}(i,n[i]):n[i]);for(f in this)this.hasOwnProperty(f)&&f!="extend"&&(u[f]=this[f]);if(u.prototype=e,n.statics)for(i in n.statics)n.statics.hasOwnProperty(i)&&(u[i]=n.statics[i],i=="ctor"&&u[i]());return u.prototype.constructor=u,u.extend=arguments.callee,u.implement=function(n){for(var t in n)e[t]=n[t]},u},n.__class=i})(this)'),
                eval(topNsStr);
                for (var i = 0; i < evalOrder.length; i++) eval(evalOrder[i]);
                eval("new " + ProjName + ".Main();");
            }
            if (isView) {
                var vp = getViewport(), center = document.createElement("center"), mainCanvas = document.createElement("canvas");
                mainCanvas.width = vp[2] - 300, mainCanvas.height = vp[3] - 20;
                var signCanvas = document.createElement("canvas");
                signCanvas.width = 200, signCanvas.height = 20;
                var lable = document.createElement("div");
                center.appendChild(mainCanvas), center.appendChild(signCanvas), center.appendChild(lable),
                document.body.style.cssText = "margin: 0px; height: 100%;width: 100%;display: table;overflow:hidden;",
                center.style.cssText = " display: table-cell; vertical-align: middle;", signCanvas.style.cssText = "  position: absolute;bottom: 10px;right: 10px;",
                lable.style.cssText = " position: absolute;bottom: 10px; left: 10px; font: 12pt Lucida Sans Typewriter, Monospace;";
                var data = [];
                each(kmdmdinfo, function (item) {
                    isInArray(item.d, item.c) && remove(item.d, item.c), data.push({
                        name: item.c,
                        deps: item.d
                    });
                }), document.body.appendChild(center), new DependencyTreeControl(data, mainCanvas, signCanvas, lable).init();
            }
        }
    }
    function getViewport() {
        var d = document.documentElement, b = document.body, w = window, div = document.createElement("div");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        var lt = 3 !== div.firstChild.nodeType ? {
            left: b.scrollLeft || d.scrollLeft,
            top: b.scrollTop || d.scrollTop
        } : {
            left: w.pageXOffset,
            top: w.pageYOffset
        }, wh = w.innerWidth ? {
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
        var result = [], nsSplitArr = ns.split(".");
        result.push("var " + nsSplitArr[0] + "={};");
        for (var i = 1; i < nsSplitArr.length - 1; i++) {
            for (var str = nsSplitArr[0], j = 1; i + 1 > j; j++) str += "." + nsSplitArr[j];
            result.push(str + "={}");
        }
        return result;
    }
    function stringifyWithFuncs(obj) {
        Object.prototype.toJSON = function () {
            var i, sobj = {};
            for (i in this) this.hasOwnProperty(i) && (sobj[i] = "function" == typeof this[i] ? addSi(this[i]) : this[i]);
            return sobj;
        };
        var str = JSON.stringify(obj);
        return delete Object.prototype.toJSON, str;
    }
    function isInScopeChainVariables(scope, name) {
        if (scope) {
            var vars = scope.variables._values;
            if (Object.prototype.hasOwnProperty.call(vars, "$" + name)) return !0;
            if (scope.parent_scope) return isInScopeChainVariables(scope.parent_scope, name);
        }
        return !1;
    }
    function isResultNodeInArray(arr, item) {
        for (var i = 0; i < arr.length; i++) if (arr[i].start.pos == item.start.pos) return !0;
        return !1;
    }
    function getRef(fn, deps) {
        var U2 = UglifyJS;
        currentAST = U2.parse("" + fn), currentAST.figure_out_scope();
        var result = [], resultNode = [];
        currentAST.walk(new U2.TreeWalker(function (node) {
            if (node instanceof U2.AST_New) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                !name || "this" == name || "arguments" == name || name in window || isInScopeChainVariables(scope, name) || isResultNodeInArray(resultNode, node) || (result.push(name),
                resultNode.push(node));
            }
            if (node instanceof U2.AST_Dot) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                !name || "this" == name || "arguments" == name || name in window || isInScopeChainVariables(scope, name) || isResultNodeInArray(resultNode, node) || (result.push(name),
                resultNode.push(node));
            }
            if (node instanceof U2.AST_Call && "get" == node.expression.property && "kmdjs" == node.expression.expression.name) if (node.args[0].value) lazyMdArr.push(node.args[0].value); else for (var i = 0, len = node.args[0].elements.length; len > i; i++) {
                var item = node.args[0].elements[i];
                lazyMdArr.push(item.value);
            }
        }));
        for (var code = "" + fn, refs = [], refNodes = [], checkNames = [], checkClassNames = [], secNames = [], j = 0; j < classList.length; j++) {
            var arr = classList[j].split(".");
            checkNames.push(arr[0]), secNames.push(arr[1]), checkClassNames.push(arr[arr.length - 1]);
        }
        for (var k = 0; k < result.length; k++) if (isInArray(checkNames, result[k])) {
            if (isInArray(checkClassNames, result[k])) for (var i = 0; i < classList.length; i++) if (result[k] == classList[i].split(".")[0] && resultNode[k].property != classList[i].split(".")[1]) {
                isInArray(refNodes, resultNode[k]) || (refs.push(result[k]), refNodes.push(resultNode[k]));
                break;
            }
        } else isInArray(refNodes, resultNode[k]) || (refs.push(result[k]), refNodes.push(resultNode[k]));
        remove(refs, "arguments");
        for (var m = 0; m < refs.length; m++) for (var n = 0; n < deps.length; n++) isInArray(classList, deps[n] + "." + refs[m]) && refNodes[m] && (refNodes[m].fullName = deps[n] + "." + refs[m]);
        each(refNodes, function (item) {
            item.replaceArea = [];
        });
        for (var i = refNodes.length; --i >= 0;) {
            var replacement, node = refNodes[i], start_pos = node.start.pos, end_pos = node.end.endpos, fna = node.fullName || "KMDNull";
            replacement = node instanceof UglifyJS.AST_New ? new U2.AST_New({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                args: node.args
            }).print_to_string({
                beautify: !0
            }) : node instanceof UglifyJS.AST_SymbolRef ? new U2.AST_SymbolRef({
                name: fna
            }).print_to_string({
                beautify: !0
            }) : new U2.AST_Dot({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                property: node.property
            }).print_to_string({
                beautify: !0
            });
            for (var k = 0; k < refNodes.length; k++) {
                var otherNode = refNodes[k];
                if (otherNode.start.pos < start_pos && otherNode.end.endpos > end_pos) {
                    otherNode.end.endpos += fna.length - fna.split(".")[fna.split(".").length - 1].length;
                    var fna2 = otherNode.fullName, step = fna2.length - fna2.split(".")[fna2.split(".").length - 1].length;
                    otherNode.replaceArea.push({
                        step: step,
                        begin: start_pos + step,
                        end: end_pos + step,
                        replaceM: replacement
                    });
                }
            }
        }
        for (var i = refNodes.length; --i >= 0;) {
            var replacement, node = refNodes[i], start_pos = node.start.pos, end_pos = node.end.endpos, fna = node.fullName || "_________KMDNULL______________";
            if (node.fullName && (replacement = node instanceof UglifyJS.AST_New ? new U2.AST_New({
                expression: new U2.AST_SymbolRef({
                name: fna
            }),
                args: node.args
            }).print_to_string({
                beautify: !0
            }) : node instanceof UglifyJS.AST_SymbolRef ? new U2.AST_SymbolRef({
                name: fna
            }).print_to_string({
                beautify: !0
            }) : new U2.AST_Dot({
                expression: new U2.AST_SymbolRef({
                name: fna
            }),
                property: node.property
            }).print_to_string({
                beautify: !0
            }), code = splice_string(code, start_pos, end_pos, replacement), node.replaceArea)) for (var m = 0; m < node.replaceArea.length; m++) {
                var item = node.replaceArea[m];
                code = splice_string(code, item.begin, item.end, item.replaceM);
            }
        }
        return [refs, code];
    }
    function getBaseUrl() {
        for (var baseUrl, scripts = doc.getElementsByTagName("script"), i = 0, len = scripts.length; len > i; i++) {
            var scrp = scripts[i], srcL = scrp.getAttribute("src");
            if (srcL) {
                var src = srcL.toUpperCase(), arr = src.match(/\bKMD.JS\b/g);
                if (arr) {
                    var m2 = src.match(/DEBUG/g);
                    m2 && (isDebug = !0);
                    var arr = src.split("/");
                    arr.pop(), baseUrl = arr.length ? arr.join("/") + "/" : "./";
                    var dm = scrp.getAttribute("data-main"), arr2 = dm.split("?");
                    dataMain = arr2[0], dataMain = dataMain.replace(/.js/g, ""), arr2.length > 1 && ("build" == arr2[1] ? isBuild = !0 : "view" == arr2[1] ? isView = !0 : "combine" == arr2[1] && (isCombine = !0));
                    break;
                }
            }
        }
        return baseUrl;
    }
    var define, kmdjs = {}, currentAST, isDebug = !1, modules = {}, classList = [], baseUrl = getBaseUrl(), mapping = {}, cBaseUrl, nsmp = {}, dataMain, isBrowser = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document), ProjName, kmdmdinfo = [], lazyMdArr = [], isMDBuild = !1, allPending = [], isMtClassesBuild = !1, readyBuildClasses = [], conflictMapping = {}, xmdModules = {}, beautifier_options_defaults = {
        indent_start: 0,
        indent_level: 4,
        quote_keys: !1,
        space_colon: !0,
        ascii_only: !1,
        inline_script: !1,
        width: 80,
        max_line_len: 32e3,
        screw_ie8: !1,
        beautify: !0,
        bracketize: !1,
        comments: !1,
        semicolons: !1
    }, isIE = !!window.ActiveXObject, isIE6 = isIE && !window.XMLHttpRequest, defined = {};
    define = function (name, deps, foctory) {
        var argc = arguments.length;
        if (1 == argc) throw "the class must take a name";
        2 == argc ? (foctory = deps, deps = []) : isString(deps) && (deps = [deps]);
        var mda = name.split(":"), fullname = mda[0], lastIndex = lastIndexOf(fullname, ".");
        if (-1 == lastIndex && (fullname = ProjName + "." + fullname, lastIndex = lastIndexOf(fullname, ".")),
        !defined[fullname]) {
            defined[fullname] = !0, mda.length > 1 && -1 == lastIndexOf(mda[1], ".") && (mda[1] = ProjName + "." + mda[1]);
            var parentClass, baseClass = "__class";
            1 != mda.length && (mda[1].split(".")[0] in window && !isInArray(classList, mda[1]) ? baseClass = mda[1] : (baseClass = mda[1],
            parentClass = mda[1]));
            var className = fullname.substring(lastIndex + 1, fullname.length);
            deps.unshift(fullname.substring(0, lastIndex));
            for (var xmd = [], i = 0; i < deps.length; i++) xmdModules[deps[i]] && (isInArray(xmd, deps[i]) || xmd.push(deps[i]),
            deps.splice(i, 1), i--);
            isInArray(deps, ProjName) || deps.unshift(ProjName);
            var ldCount = 0, xmdLen = xmd.length;
            if (xmdLen > 0) for (var j = 0; xmdLen > j; j++) !function (ns) {
                allPending.push(ns), request(mapping[ns], function () {
                    remove(allPending, ns), ldCount++, ldCount == xmdLen && (refrence(className, deps, fullname + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname),
                    checkMainCpt());
                });
            }(xmd[j]); else refrence(className, deps, fullname + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname, parentClass);
        }
    };
    var currentPendingModuleFullName = [];
    window.kmdmdinfo = kmdmdinfo, define.pendingCallback = [], kmdjs.get = function (fullname, callback) {
        isString(fullname) && (fullname = [fullname]);
        for (var i = 0, len = fullname.length; len > i; i++) -1 == lastIndexOf(fullname[i], ".") && (fullname[i] = ProjName + "." + fullname[i],
        currentPendingModuleFullName.push(fullname[i]));
        for (var loaded = !0, mdArr = [], i = 0, len = fullname.length; len > i; i++) modules[fullname[i]] ? mdArr.push(modules[fullname[i]]) : loaded = !1;
        if (loaded) callback && callback.apply(null, mdArr); else for (var i = 0, len = fullname.length; len > i; i++) if (!modules[fullname[i]]) {
            var ns = fullname[i];
            allPending.push(ns), function (ns) {
                if (!mapping[ns]) throw "no module named :" + ns;
                request(mapping[ns], function () {
                    callback && define.pendingCallback.push(callback), remove(allPending, ns), checkMainCpt();
                });
            }(ns);
        }
    };
    var kmdmaincpt = !1;
    allPending.push("Main"), request(dataMain + ".js", function () {
        remove(allPending, "Main"), checkMainCpt();
    }), kmdjs.config = function (option) {
        ProjName = option.name, cBaseUrl = option.baseUrl;
        var i;
        if (isBuild || option.build && (isMtClassesBuild = !0, isBuild = !0, readyBuildClasses = option.build),
        option.deps) for (i = 0; i < option.deps.length; i++) for (var item = option.deps[i], currentUrl = item.url, j = 0; j < item.classes.length; j++) {
            var cls = item.classes[j];
            classList.push(cls.name);
            var arr = cls.name.split(".");
            mapping[cls.name] = -1 == lastIndexOf(item.url, "http:") ? (cBaseUrl ? cBaseUrl + "/" : "") + (-1 == lastIndexOf(currentUrl, ".js") ? currentUrl + ".js" : currentUrl) : currentUrl,
            nsmp[arr[arr.length - 1]] = cls.name;
        }
        if (option.classes) for (i = 0; i < option.classes.length; i++) {
            var item = option.classes[i];
            classList.push(item.name);
            var arr = item.name.split(".");
            item.url ? mapping[item.name] = -1 == lastIndexOf(item.url, "http:") ? cBaseUrl + "/" + item.url + "/" + arr[arr.length - 1] + ".js" : item.url : 0 == item.kmd ? (mapping[item.name] = cBaseUrl + "/" + item.name + ".js",
            xmdModules[item.name] = !0) : mapping[item.name] = cBaseUrl + "/" + arr[arr.length - 1] + ".js",
            nsmp[arr[arr.length - 1]] = item.name;
        }
    }, kmdjs.exec = function (a) {
        each(a, function (item) {
            kmdmdinfo.push(item);
        });
    }, global.__class = __class, define.modules = global.__modules = modules, global.define = define,
    global.kmdjs = kmdjs;
}(this);
})();