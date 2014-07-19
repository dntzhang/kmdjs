!function(global, undefined) {
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
    function getRefWithNS(fn) {
        var U2 = UglifyJS, code = "" + fn, ast = U2.parse(code);
        ast.figure_out_scope();
        var result = [], result2 = [], walker = new U2.TreeWalker(function(node) {
            if (node instanceof UglifyJS.AST_Dot) {
                var ob = findScope(node), name = (node.expression, ob.name), scope = ob.sp;
                if (name && "this" != name && !(name in window) && !isInScopeChainVariables(scope, name)) {
                    var p = walker.parent();
                    if (p instanceof UglifyJS.AST_New) result.push(p), result2.push(node); else if (!(p instanceof UglifyJS.AST_Dot)) if (p instanceof UglifyJS.AST_VarDef) p.value.expression instanceof UglifyJS.AST_Dot && (result2.push(node), 
                    result.push(node)); else if (p instanceof UglifyJS.AST_Call) {
                        if (p.expression.expression instanceof UglifyJS.AST_Dot) result2.push(node), result.push(node); else if (p.args.length > 0) for (var i = 0, len = p.args.length; len > i; i++) p.args[i].expression instanceof UglifyJS.AST_Dot && (result2.push(node), 
                        result.push(node));
                    } else p instanceof UglifyJS.AST_SimpleStatement && p.body.expression instanceof UglifyJS.AST_Dot && (result2.push(node), 
                    result.push(node));
                }
            }
        });
        ast.walk(walker);
        for (var i = result.length; --i >= 0; ) {
            var replacement, fns, node = result[i], start_pos = node.start.pos, end_pos = node.end.endpos;
            node instanceof UglifyJS.AST_New ? (fns = chainNS(node.expression), replacement = new U2.AST_New({
                expression: new U2.AST_SymbolRef({
                    name: fns
                }),
                args: node.args
            }).print_to_string({
                beautify: !0
            })) : (fns = chainNS(node), replacement = new U2.AST_Dot({
                expression: new U2.AST_SymbolRef({
                    name: fns
                }),
                property: node.property
            }).print_to_string({
                beautify: !0
            })), isInArray(classList, fns.replace(/_/g, ".")) && (code = splice_string(code, start_pos, end_pos, replacement));
        }
        for (var i = 0; i < result2.length; i++) conflictMapping.hasOwnProperty(result2[i].property) ? conflictMapping[result2[i].property + Math.random()] = chainNS(result2[i]) : conflictMapping[result2[i].property] = chainNS(result2[i]);
        return code;
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
    function addSi(fn) {
        function addOneSI(codeStr, index, evidence) {
            var arr = codeStr.split("\n");
            return arr[index] = evidence + ";", arr.join("\n");
        }
        var codeStr = "var a=" + fn + ";";
        JSLINT.jslint(codeStr, {
            maxerr: 1e4
        });
        for (var i = 0, len = JSLINT.errors.length; len > i; i++) {
            var item = JSLINT.errors[i];
            item && ";" == item.a && (codeStr = addOneSI(codeStr, item.line - 1, item.evidence));
        }
        return codeStr.substring(6, codeStr.length - 1);
    }
    function compressor(fn) {
        var ast = UglifyJS.parse("" + fn);
        ast.figure_out_scope();
        var sq = UglifyJS.Compressor(), compressed_ast = ast.transform(sq);
        compressed_ast.compute_char_frequency(), compressed_ast.mangle_names();
        var code = compressed_ast.print_to_string();
        return code;
    }
    function refrence(className, deps, foctory, fullname) {
        conflictMapping = {};
        var body = foctory.replace(/"function[\s\S]*?\}"/g, function(str) {
            return str.substr(1, str.length - 2);
        }).replace(/([\s]*?)\/\/([\s\S]*?)(?=(\\r)?\\n(\\t)?)/g, "").replace(/(\/\*[\s\S]*?\*\/)/g, "").replace(/\\r\\n/g, "").replace(/\\n/g, function(item, b, c) {
            return "\\" == c.charAt(b - 1) ? item : "";
        }).replace(/\\t/g, function(item, b, c) {
            return "\\" == c.charAt(b - 1) ? item : "";
        }).replace(/\\"/g, function(item, b, c) {
            return "\\" == c.charAt(b - 1) ? item : '"';
        }).replace(/\\'/g, function(item, b, c) {
            return "\\" == c.charAt(b - 1) ? item : "'";
        }).replace(/\\\\/g, "\\");
        body = js_beautify(body);
        var fn = Function(body), ref = getRef(fn);
        remove(ref, "__class");
        for (var newArr = [], i = 0, len = deps.length; len > i; i++) for (var k = 0; k < ref.length; k++) isInArray(classList, deps[i] + "." + ref[k]) && !isInArray(newArr, deps[i] + "." + ref[k]) && newArr.push(deps[i] + "." + ref[k]);
        var entire = (getNSRef(fn), getRefWithNS(fn));
        if (body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}")), isDebug && (log(fullname + "  ref:" + ref), 
        log(body + "\n//@ sourceURL=" + (className || "anonymous") + ".js")), (isBuild || isMDBuild) && !isDebug) {
            var fx = Function(body), entire = compressor(fx);
            body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        }
        rLen = ref.length;
        var moduleNameArr = [];
        for (i = 0; i < newArr.length; i++) {
            var xx = newArr[i].split(".");
            moduleNameArr.push(xx[xx.length - 1]);
        }
        var isPush = !1;
        each(kmdmdinfo, function(item) {
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
            d: newArr
        }), 0 != newArr.length || isBuild) for (var k = 0; k < newArr.length; k++) !function(ns) {
            if (!define.modules[ns]) {
                if (allPending.push(ns), !mapping[ns]) throw "no module named :" + ns;
                request(mapping[ns], function() {
                    remove(allPending, ns), currentPendingModuleFullName.length > 0 ? checkModuleCpt() : checkMainCpt();
                });
            }
        }(newArr[k]); else currentPendingModuleFullName.length > 0 ? checkModuleCpt() : checkMainCpt();
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
        ast.walk(new U2.TreeWalker(function(node) {
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
    function getBuildArr(fns) {
        var buildArrs = [];
        return each(fns, function(currentFullname) {
            function catchAllDep(md) {
                pendingCount++, md && isInArray(arr, md.c) && remove(arr, md.c), md && arr.push(md.c), 
                md && md.d.length > 0 ? (each(md.d, function(item) {
                    isInArray(arr, item) && remove(arr, item), arr.push(item);
                    var next;
                    each(kmdmdinfo, function(item2) {
                        return item2.c == item ? (next = item2, !1) : undefined;
                    }), next && catchAllDep(next);
                }), pendingCount--) : pendingCount--;
            }
            -1 == lastIndexOf(currentFullname, ".") && (currentFullname = ProjName + "." + currentFullname);
            var mainDep;
            each(kmdmdinfo, function(item) {
                item.c == currentFullname && (mainDep = item);
            });
            var arr = [], pendingCount = 0;
            catchAllDep(mainDep);
            var buildArr = [];
            each(arr, function(item2) {
                each(kmdmdinfo, function(item) {
                    if (item.c == item2) {
                        buildArr.push(item);
                        var moduleArr = [], fnResult = Function(item.a, item.b);
                        for (i = 0; i < item.d.length; i++) moduleArr.push(modules[item.d[i]]);
                        var obj = fnResult.apply(null, moduleArr);
                        modules[item.c] = obj;
                    }
                });
            }), buildArrs.push({
                name: currentFullname,
                buildArr: buildArr
            });
        }), buildArrs;
    }
    function checkModuleCpt() {
        if (!(allPending.length > 0) && 0 != currentPendingModuleFullName.length) {
            checkModules = {};
            var buildArrs = [];
            each(currentPendingModuleFullName, function(currentFullname) {
                function catchAllDep(md) {
                    pendingCount++, md && isInArray(arr, md.c) && remove(arr, md.c), md && arr.push(md.c), 
                    md && md.d.length > 0 ? (each(md.d, function(item) {
                        isInArray(arr, item) && remove(arr, item), arr.push(item);
                        var next;
                        each(kmdmdinfo, function(item2) {
                            return item2.c == item ? (next = item2, !1) : undefined;
                        }), next && catchAllDep(next);
                    }), pendingCount--) : pendingCount--;
                }
                var mainDep;
                each(kmdmdinfo, function(item) {
                    item.c == currentFullname && (mainDep = item);
                });
                var arr = [], pendingCount = 0;
                catchAllDep(mainDep);
                var buildArr = [];
                each(arr, function(item2) {
                    each(kmdmdinfo, function(item) {
                        if (item.c == item2) {
                            buildArr.push(item);
                            var moduleArr = [], fnResult = Function(item.a, item.b);
                            for (i = 0; i < item.d.length; i++) moduleArr.push(modules[item.d[i]]);
                            var obj = fnResult.apply(null, moduleArr);
                            modules[item.c] = obj;
                        }
                    });
                }), buildArrs.push({
                    name: currentFullname,
                    buildArr: buildArr
                });
            }), setTimeout(function() {
                for (var mdArr = [], i = 0, len = currentPendingModuleFullName.length; len > i; i++) modules[currentPendingModuleFullName[i]] && mdArr.push(modules[currentPendingModuleFullName[i]]);
                currentPendingModuleFullName.length = 0, define.pendingCallback && define.pendingCallback.apply(null, mdArr);
            }, 0), isMDBuild && (each(buildArrs, function(item) {
                var ctt = doc.createElement("div"), msgDiv = doc.createElement("div"), titleDiv = doc.createElement("div");
                titleDiv.innerHTML = "Build Complete!", msgDiv.innerHTML = item.name + ".js  ";
                var codePanel = doc.createElement("textarea");
                ctt.appendChild(titleDiv), ctt.appendChild(codePanel), ctt.appendChild(msgDiv), 
                doc.body.appendChild(ctt), codePanel.setAttribute("rows", "25"), codePanel.setAttribute("cols", "45");
                var cpCode = "kmdjs.exec(" + JSON.stringify(item.buildArr).replace(/\s+/g, " ") + ")";
                codePanel.value = cpCode, codePanel.focus(), codePanel.select(), downloadFile(cpCode, item.name + ".js");
            }), isMDBuild = !1);
        }
    }
    function downloadFile(code, fileName) {
        if (window.URL.createObjectURL) {
            var fileParts = [ code ], bb = new Blob(fileParts, {
                type: "text/plain"
            }), dnlnk = window.URL.createObjectURL(bb), dlLink = document.createElement("a");
            dlLink.setAttribute("href", dnlnk), dlLink.setAttribute("download", fileName), dlLink.click();
        }
    }
    function checkMainCpt() {
        function catchAllDep(md) {
            pendingCount++, md && isInArray(arr, md.c) && remove(arr, md.c), md && arr.push(md.c), 
            md && md.d.length > 0 ? (each(md.d, function(item) {
                isInArray(arr, item) && remove(arr, item), arr.push(item);
                var next;
                each(kmdmdinfo, function(item2) {
                    return item2.c == item ? (next = item2, !1) : undefined;
                }), next && catchAllDep(next);
            }), pendingCount--) : pendingCount--;
        }
        if (!(allPending.length > 0 || kmdmaincpt)) {
            kmdmaincpt = !0;
            var mainDep;
            each(kmdmdinfo, function(item) {
                item.c == ProjName + ".Main" && (mainDep = item);
            });
            var arr = [], pendingCount = 0;
            catchAllDep(mainDep, 0);
            var buildArr = [];
            if (each(arr, function(item2) {
                each(kmdmdinfo, function(item) {
                    if (item.c == item2) {
                        buildArr.push(item);
                        var moduleArr = [], fnResult = Function(item.a, item.b);
                        for (i = 0; i < item.d.length; i++) moduleArr.push(modules[item.d[i]]);
                        var obj = fnResult.apply(null, moduleArr);
                        modules[item.c] = obj;
            }
            });
            }), setTimeout(function() {
                new modules[ProjName + ".Main"]();
            }, 0), isBuild) {
                var ctt = doc.createElement("div"), msgDiv = doc.createElement("div"), titleDiv = doc.createElement("div");
                titleDiv.innerHTML = "Build Complete!", msgDiv.innerHTML = ProjName + ".js ";
                var codePanel = doc.createElement("textarea");
                ctt.appendChild(titleDiv), ctt.appendChild(codePanel), ctt.appendChild(msgDiv), 
                doc.body.appendChild(ctt), codePanel.setAttribute("rows", "8"), codePanel.setAttribute("cols", "55");
                var cpCode = '(function(n){function l(n,t,u){var f=i.createElement("script"),s;u&&(s=isFunction(u)?u(n):u,s&&(f.charset=s)),a(f,t,n),f.async=!0,f.src=n,o=f,e?r.insertBefore(f,e):r.appendChild(f),o=null}function a(n,t,i){function u(i){n.onload=n.onerror=n.onreadystatechange=null,c.debug||r.removeChild(n),n=null,t(i)}var f="onload"in n;f?(n.onload=u,n.onerror=function(){throw"bad request!__"+i+"  404 (Not Found) ";}):n.onreadystatechange=function(){/loaded|complete/.test(n.readyState)&&u()}}function v(n,t){var r,i;if(n.lastIndexOf)return n.lastIndexOf(t);for(r=t.length,i=n.length-1-r;i>-1;i--)if(t===n.substr(i,r))return i;return-1}var h="' + ProjName + '",i=document,c={},r=i.head||i.getElementsByTagName("head")[0]||i.documentElement,e=r.getElementsByTagName("base")[0],o,u={},t;u.get=function(n,i){var f,e,o,u,r,s;for(typeof n=="string"&&(n=[n]),r=0,u=n.length;r<u;r++)v(n[r],".")==-1&&(n[r]=h+"."+n[r]);for(f=!0,e=[],r=0,u=n.length;r<u;r++)t.modules[n[r]]?e.push(t.modules[n[r]]):f=!1;if(f)i.apply(null,e);else for(o=0,u=n.length,r=0;r<u;r++)s=[],l(n[r]+".js",function(){if(o++,o==u){for(var r=0;r<u;r++)t.modules[n[r]]&&s.push(t.modules[n[r]]);i.apply(null,s)}})},u.exec=function(n){for(var u,o,s,r=0,f=n.length;r<f;r++){var i=n[r],e=[],h=new Function(i.a,i.b);for(u=0,o=i.d.length;u<o;u++)e.push(t.modules[i.d[u]]);s=h.apply(null,e),t.modules[i.c]=s}},n.kmdjs=u;var f=!1,y=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/,s=function(){};s.extend=function(n){function i(){!f&&this.init&&this.init.apply(this,arguments)}var e=this.prototype,u,r,t;f=!0,u=new this,f=!1;for(t in n)t!="statics"&&(u[t]=typeof n[t]=="function"&&typeof e[t]=="function"&&y.test(n[t])?function(n,t){return function(){var r=this._super,i;return this._super=e[n],i=t.apply(this,arguments),this._super=r,i}}(t,n[t]):n[t]);for(r in this)this.hasOwnProperty(r)&&r!="extend"&&(i[r]=this[r]);if(n.statics)for(t in n.statics)t=="init"?n.statics[t].call(i):i[t]=n.statics[t];return i.prototype=u,i.prototype.constructor=i,i.extend=arguments.callee,i},n.__class=s,t={},t.modules={},n.__modules=t.modules,t.all=' + JSON.stringify(buildArr).replace(/\s+/g, " ") + ',u.exec(t.all),new t.modules["' + ProjName + '.Main"]})(this)';
                codePanel.value = cpCode, codePanel.focus(), codePanel.select(), downloadFile(cpCode, ProjName + ".Main.js");
                var lmclone = [];
                each(lazyMdArr, function(item) {
                    lmclone.push(item);
                }), kmdjs.get(lazyMdArr, function() {
                    var lzBuildArrs = getBuildArr(lmclone);
                    each(lzBuildArrs, function(item) {
                        var ctt = doc.createElement("div"), msgDiv = doc.createElement("div");
                        msgDiv.innerHTML = item.name + ".js ";
                        var codePanel = doc.createElement("textarea");
                        ctt.appendChild(codePanel), ctt.appendChild(msgDiv), doc.body.appendChild(ctt), 
                        codePanel.setAttribute("rows", "8"), codePanel.setAttribute("cols", "55");
                        var cpCode = "kmdjs.exec(" + JSON.stringify(item.buildArr).replace(/\s+/g, " ") + ")";
                        codePanel.value = cpCode, downloadFile(cpCode, item.name + ".js");
                    });
                });
            }
            if (isView) {
                var holder = document.createElement("div");
                holder.setAttribute("id", "holder"), document.body.appendChild(holder);
                for (var data = [], i = 0, len = buildArr.length; len > i; i++) {
                    var item = buildArr[i];
                    data.push({
                        name: item.c,
                        deps: item.d
                    });
                }
                new DepTree({
                    renderTo: "holder",
                    width: "820",
                    height: "580",
                    data: data
                });
            }
        }
    }
    function remove(arr, item) {
        for (var i = arr.length - 1; i > -1; i--) arr[i] == item && arr.splice(i, 1);
    }
    function each(arry, action) {
        for (var i = arry.length - 1; i > -1; i--) {
            var result = action(arry[i]);
            if (isBoolean(result) && !result) break;
        }
    }
    function stringifyWithFuncs(obj) {
        Object.prototype.toJSON = function() {
            var i, sobj = {};
            for (i in this) this.hasOwnProperty(i) && (sobj[i] = "function" == typeof this[i] ? addSi(this[i]) : this[i]);
            return sobj;
        };
        var str = JSON.stringify(obj);
        return delete Object.prototype.toJSON, str;
    }
    function lastIndexOf(str, word) {
        if (str.lastIndexOf) return str.lastIndexOf(word);
        for (var len = word.length, i = str.length - 1 - len; i > -1; i--) if (word === str.substr(i, len)) return i;
        return -1;
    }
    function isInArray(arr, item) {
        for (var i = 0, j = arr.length; j > i; i++) if (arr[i] == item) return !0;
        return !1;
    }
    function isInScopeChainVariables(scope, name) {
        var vars = scope.variables._values;
        return Object.prototype.hasOwnProperty.call(vars, "$" + name) ? !0 : scope.parent_scope ? isInScopeChainVariables(scope.parent_scope, name) : !1;
    }
    function getRef(fn) {
        var U2 = UglifyJS, ast = U2.parse("" + fn);
        ast.figure_out_scope();
        var result = [];
        return ast.walk(new U2.TreeWalker(function(node) {
            if (node instanceof U2.AST_New) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                !name || "this" == name || name in window || isInScopeChainVariables(scope, name) || isInArray(result, name) || result.push(name);
            }
            if (node instanceof U2.AST_Dot) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                !name || "this" == name || name in window || isInScopeChainVariables(scope, name) || isInArray(result, name) || result.push(name);
            }
            if (node instanceof U2.AST_SymbolRef) {
                var name = node.name;
                !name || "this" == name || name in window || isInScopeChainVariables(node.scope, name) || isInArray(result, name) || result.push(name);
            }
            if (node instanceof U2.AST_Call && "get" == node.expression.property && "kmdjs" == node.expression.expression.name) if (node.args[0].value) lazyMdArr.push(node.args[0].value); else for (var i = 0, len = node.args[0].elements.length; len > i; i++) {
                var item = node.args[0].elements[i];
                lazyMdArr.push(item.value);
            }
        })), result;
    }
    function log(msg) {
        try {
            console.log(msg);
        } catch (ex) {}
    }
    function getBaseUrl() {
        for (var baseUrl, scripts = doc.getElementsByTagName("script"), i = 0, len = scripts.length; len > i; i++) {
            var scrp = scripts[i], srcL = scrp.getAttribute("src");
            if (srcL) {
                var src = srcL.toUpperCase(), arr = src.match(/\bKMD\b/g);
                if (arr) {
                    var m2 = src.match(/DEBUG/g);
                    m2 && (isDebug = !0);
                    var arr = src.split("/");
                    arr.pop(), baseUrl = arr.length ? arr.join("/") + "/" : "./";
                    var dm = scrp.getAttribute("data-main"), arr2 = dm.split("?");
                    dataMain = arr2[0], dataMain = dataMain.replace(/.js/g, ""), arr2.length > 1 && ("build" == arr2[1] ? isBuild = !0 : isView = !0);
                    break;
                }
            }
        }
        return baseUrl;
    }
    var define, cBaseUrl, dataMain, ProjName, kmdjs = {}, isView = !1, isDebug = !1, isBuild = !1, modules = {}, classList = [], mapping = (getBaseUrl(), 
    {}), nsmp = {}, kmdmdinfo = (!("undefined" == typeof window || "undefined" == typeof navigator || !window.document), 
    []), lazyMdArr = [], isMDBuild = !1, checkModules = {}, allPending = [], conflictMapping = {};
    define = function(name, deps, foctory) {
        var argc = arguments.length;
        if (1 == argc) throw "the class must take a name";
        2 == argc ? (foctory = deps, deps = []) : isString(deps) && (deps = [ deps ]);
        var mda = name.split(":"), fullname = mda[0], lastIndex = lastIndexOf(fullname, ".");
        -1 == lastIndex && (fullname = ProjName + "." + fullname, lastIndex = lastIndexOf(fullname, ".")), 
        mda.length > 1 && -1 == lastIndexOf(mda[1], ".") && (mda[1] = ProjName + "." + mda[1]);
        var baseClass = 1 == mda.length ? "__class" : ' __modules["' + mda[1] + '"]', className = fullname.substring(lastIndex + 1, fullname.length);
        deps.unshift(fullname.substring(0, lastIndex)), isInArray(deps, ProjName) || deps.unshift(ProjName), 
        refrence(className, deps, "var " + className + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname);
    };
    var currentPendingModuleFullName = [];
    window.kmdmdinfo = kmdmdinfo, define.build = function() {
        isBuild = !0, define.apply(null, arguments);
    }, define.view = function() {
        isView = !0, define.apply(null, arguments);
    }, kmdjs.get = function(fullname, callback) {
        isString(fullname) && (fullname = [ fullname ]);
        for (var i = 0, len = fullname.length; len > i; i++) -1 == lastIndexOf(fullname[i], ".") && (fullname[i] = ProjName + "." + fullname[i]);
        currentPendingModuleFullName = fullname;
        for (var loaded = !0, mdArr = [], i = 0, len = fullname.length; len > i; i++) modules[fullname[i]] ? mdArr.push(modules[fullname[i]]) : loaded = !1;
        if (loaded) callback && callback.apply(null, mdArr); else for (var i = 0, len = fullname.length; len > i; i++) if (!modules[fullname[i]]) {
            var ns = fullname[i];
            allPending.push(ns), function(ns) {
                if (!mapping[ns]) throw "no module named :" + ns;
                request(mapping[ns], function() {
                    callback && (define.pendingCallback = callback), remove(allPending, ns), currentPendingModuleFullName.length > 0 ? checkModuleCpt() : checkMainCpt();
                });
            }(ns);
        }
    };
    var kmdmaincpt = !1;
    kmdjs.build = function(fullname) {
        if (currentPendingModuleFullName = [ fullname ], isMDBuild = !0, allPending.push(fullname), 
        !mapping[fullname]) throw "no module named :" + ns;
        request(mapping[fullname], function() {
            remove(allPending, fullname), currentPendingModuleFullName.length > 0 ? checkModuleCpt() : checkMainCpt();
        });
    }, String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    }), allPending.push("Main"), request(dataMain + ".js", function() {
        remove(allPending, "Main"), currentPendingModuleFullName.length > 0 ? checkModuleCpt() : checkMainCpt();
    }), kmdjs.config = function(option) {
        ProjName = option.name, cBaseUrl = option.baseUrl;
        for (var i = 0; i < option.classes.length; i++) {
            var item = option.classes[i];
            classList.push(item.name);
            var arr = item.name.split(".");
            mapping[item.name] = cBaseUrl + "/" + (item.url ? item.url + "/" : "") + arr[arr.length - 1] + ".js", 
            nsmp[arr[arr.length - 1]] = item.name;
        }
    }, global.__class = __class, define.modules = global.__modules = modules, global.define = define, 
    global.kmdjs = kmdjs;
}(this);
})();