﻿(function(global, undefined) {
    var define, kmdjs = {};
    var currentAST;
    var isView = false, isDebug = false, isBuild = false, modules = {}, classList = [], baseUrl = getBaseUrl(), mapping = {}, cBaseUrl, nsmp = {}, dataMain;
    var isBrowser = !!(typeof window !== "undefined" && typeof navigator !== "undefined" && window.document);
    var ProjName;
    var kmdmdinfo = [];
    var lazyMdArr = [];
    var isMDBuild = false;
    var checkModules = {};
    var allPending = [];
    var conflictMapping = {};
    var xmdModules = {};
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
        return {
            sp: sp,
            name: name
        };
    }
    function getRefWithNS(fn) {
        var U2 = UglifyJS;
        var code = fn.toString();
        var result = [], result2 = [];
        var walker = new U2.TreeWalker(function(node) {
            if (node instanceof UglifyJS.AST_Dot) {
                var ob = findScope(node);
                var ex = node.expression, name = ob.name, scope = ob.sp;
                if (name && name != "this" && !(name in window) && !isInScopeChainVariables(scope, name)) {
                    var p = walker.parent();
                    if (p instanceof UglifyJS.AST_New) {
                        result.push(p);
                        result2.push(node);
                    } else if (!(p instanceof UglifyJS.AST_Dot)) {
                        if (p instanceof UglifyJS.AST_VarDef) {
                            if (p.value.expression instanceof UglifyJS.AST_Dot) {
                                result2.push(node);
                                result.push(node);
                            }
                        } else if (p instanceof UglifyJS.AST_Call) {
                            if (p.expression.expression instanceof UglifyJS.AST_Dot) {
                                result2.push(node);
                                result.push(node);
                            } else if (p.args.length > 0) {
                                for (var i = 0, len = p.args.length; i < len; i++) {
                                    if (p.args[i].expression instanceof UglifyJS.AST_Dot) {
                                        result2.push(node);
                                        result.push(node);
                                    }
                                }
                            }
                        } else if (p instanceof UglifyJS.AST_SimpleStatement) {
                            if (p.body.expression instanceof UglifyJS.AST_Dot) {
                                result2.push(node);
                                result.push(node);
                            }
                        }
                    }
                }
            }
        });
        currentAST.walk(walker);
        for (var i = result.length; --i >= 0; ) {
            var node = result[i];
            var start_pos = node.start.pos;
            var end_pos = node.end.endpos;
            var replacement, fns;
            if (node instanceof UglifyJS.AST_New) {
                fns = chainNS(node.expression);
                replacement = new U2.AST_New({
                    expression: new U2.AST_SymbolRef({
                        name: fns
                    }),
                    args: node.args
                }).print_to_string({
                    beautify: true
                });
            } else {
                fns = chainNS(node);
                replacement = new U2.AST_Dot({
                    expression: new U2.AST_SymbolRef({
                        name: fns
                    }),
                    property: node.property
                }).print_to_string({
                    beautify: true
                });
            }
            if (isInArray(classList, fns.replace(/_/g, "."))) {
                code = splice_string(code, start_pos, end_pos, replacement);
            }
        }
        for (var i = 0; i < result2.length; i++) {
            if (conflictMapping.hasOwnProperty(result2[i].property)) {
                conflictMapping[result2[i].property + Math.random()] = chainNS(result2[i]);
            } else {
                conflictMapping[result2[i].property] = chainNS(result2[i]);
            }
        }
        return code;
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
                if (item && item.a == ";") {
                    codeStr = addOneSI(codeStr, item.line - 1, item.evidence);
                }
            }
            return codeStr.substring(6, codeStr.length - 1);
        } else {
            var ast = UglifyJS.parse(codeStr);
            var out = ast.print_to_string(beautifier_options_defaults);
            return out.replace("var a = ", "");
        }
    }
    var defined = {};
    define = function(name, deps, foctory) {
        var argc = arguments.length;
        if (argc == 1) {
            throw "the class must take a name";
        } else if (argc == 2) {
            foctory = deps;
            deps = [];
        } else {
            if (isString(deps)) {
                deps = [ deps ];
            }
        }
        var mda = name.split(":");
        var fullname = mda[0];
        var lastIndex = lastIndexOf(fullname, ".");
        if (lastIndex == -1) {
            fullname = ProjName + "." + fullname;
            lastIndex = lastIndexOf(fullname, ".");
        }
        if (defined[fullname]) return;
        defined[fullname] = true;
        if (mda.length > 1 && lastIndexOf(mda[1], ".") == -1) {
            mda[1] = ProjName + "." + mda[1];
        }
        var baseClass = "__class";
        if (mda.length != 1) {
            if (mda[1].split(".")[0] in window && !isInArray(classList, mda[1])) {
                baseClass = mda[1];
            } else {
                baseClass = ' __modules["' + mda[1] + '"]';
            }
        }
        var className = fullname.substring(lastIndex + 1, fullname.length);
        deps.unshift(fullname.substring(0, lastIndex));
        var xmd = [];
        for (var i = 0; i < deps.length; i++) {
            if (xmdModules[deps[i]]) {
                if (!isInArray(xmd, deps[i])) xmd.push(deps[i]);
                deps.splice(i, 1);
                i--;
            }
        }
        if (!isInArray(deps, ProjName)) deps.unshift(ProjName);
        var ldCount = 0, xmdLen = xmd.length;
        if (xmdLen > 0) {
            for (var j = 0; j < xmdLen; j++) {
                (function(ns) {
                    allPending.push(ns);
                    request(mapping[ns], function() {
                        remove(allPending, ns);
                        ldCount++;
                        if (ldCount == xmdLen) {
                            refrence(className, deps, "var " + className + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname);
                            if (currentPendingModuleFullName.length > 0) {
                                checkModuleCpt();
                            } else {
                                checkMainCpt();
                            }
                        }
                    });
                })(xmd[j]);
            }
        } else {
            refrence(className, deps, "var " + className + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname);
        }
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
    function refrence(className, deps, foctory, fullname) {
        conflictMapping = {};
        var body;
        if (isIE6) {
            body = foctory.replace(/"function[\s\S]*?\}"/g, function(str) {
                return str.substr(1, str.length - 2);
            });
        } else {
            body = foctory.replace(/"function[\s\S]*?\};"/g, function(str) {
                return str.substr(1, str.length - 4) + "}";
            });
        }
        body = body.replace(/(\\r)?\\n(\\t)?([\s]*?)\/\/([\s\S]*?)(?=(\\r)?\\n(\\t)?)/g, "").replace(/(\/\*[\s\S]*?\*\/)/g, "").replace(/\\r\\n/g, "").replace(/\\n/g, function(item, b, c) {
            if (c.charAt(b - 1) == "\\") {
                return item;
            }
            return "";
        }).replace(/\\t/g, function(item, b, c) {
            if (c.charAt(b - 1) == "\\") {
                return item;
            }
            return "";
        }).replace(/\\"/g, function(item, b, c) {
            return '"';
        }).replace(/\\'/g, function(item, b, c) {
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
        var ref = getRef(fn);
        remove(ref, "__class");
        var newArr = [];
        for (var i = 0, len = deps.length; i < len; i++) {
            for (var k = 0; k < ref.length; k++) {
                isInArray(classList, deps[i] + "." + ref[k]) && !isInArray(newArr, deps[i] + "." + ref[k]) && newArr.push(deps[i] + "." + ref[k]);
            }
        }
        var entire = getRefWithNS(fn);
        body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        if (isDebug) {
            log(fullname + "  ref:" + ref.toString());
            log(body + "\n//@ sourceURL=" + (className || "anonymous") + ".js");
        }
        if (isBuild || isMDBuild) {
            var fx = new Function(body);
            var entire = compressor(fx);
            body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        }
        rLen = ref.length;
        var moduleNameArr = [];
        for (i = 0; i < newArr.length; i++) {
            var xx = newArr[i].split(".");
            moduleNameArr.push(xx[xx.length - 1]);
        }
        var isPush = false;
        each(kmdmdinfo, function(item) {
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
            d: newArr
        });
        if (newArr.length == 0 && !isBuild) {
            if (currentPendingModuleFullName.length > 0) {
                checkModuleCpt();
            } else {
                checkMainCpt();
            }
        } else {
            for (var k = 0; k < newArr.length; k++) {
                (function(ns) {
                    if (!define.modules[ns]) {
                        allPending.push(ns);
                        if (mapping[ns]) {
                            request(mapping[ns], function() {
                                remove(allPending, ns);
                                if (currentPendingModuleFullName.length > 0) {
                                    checkModuleCpt();
                                } else {
                                    checkMainCpt();
                                }
                            });
                        } else {
                            throw "no module named :" + ns;
                        }
                    }
                })(newArr[k]);
            }
        }
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
            if (node.property) {
                chain(node.expression);
            } else {
                cNode = node;
            }
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
        ast.walk(new U2.TreeWalker(function(node) {
            if (node instanceof U2.AST_Dot) {
                var cc = getTopName(node);
                var ex = node.expression, name = cc.name, scope = cc.scope;
                if (name && name != "this" && !(name in window) && !isInScopeChainVariables(scope, name)) {
                    allNS.push(dotChain(node));
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
    define.build = function() {
        isBuild = true;
        define.apply(null, arguments);
    };
    define.view = function() {
        isView = true;
        define.apply(null, arguments);
    };
    define.pendingCallback = [];
    kmdjs.get = function(fullname, callback) {
        if (isString(fullname)) {
            fullname = [ fullname ];
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
            for (var i = 0, len = fullname.length; i < len; i++) {
                if (!modules[fullname[i]]) {
                    var ns = fullname[i];
                    allPending.push(ns);
                    (function(ns) {
                        if (mapping[ns]) {
                            request(mapping[ns], function() {
                                if (callback) define.pendingCallback.push(callback);
                                remove(allPending, ns);
                                if (currentPendingModuleFullName.length > 0) {
                                    checkModuleCpt();
                                } else {
                                    checkMainCpt();
                                }
                            });
                        } else {
                            throw "no module named :" + ns;
                        }
                    })(ns);
                }
            }
        }
    };
    var kmdmaincpt = false;
    function getBuildArr(fns) {
        var buildArrs = [];
        each(fns, function(currentFullname) {
            if (lastIndexOf(currentFullname, ".") == -1) {
                currentFullname = ProjName + "." + currentFullname;
            }
            var mainDep;
            each(kmdmdinfo, function(item) {
                if (item.c == currentFullname) {
                    mainDep = item;
                }
            });
            var arr = [];
            var pendingCount = 0;
            catchAllDep(mainDep);
            function catchAllDep(md) {
                pendingCount++;
                if (md && isInArray(arr, md.c)) {
                    remove(arr, md.c);
                }
                if (md) arr.push(md.c);
                if (md && md.d.length > 0) {
                    each(md.d, function(item) {
                        if (isInArray(arr, item)) {
                            remove(arr, item);
                        }
                        arr.push(item);
                        var next;
                        each(kmdmdinfo, function(item2) {
                            if (item2.c == item) {
                                next = item2;
                                return false;
                            }
                        });
                        if (next) catchAllDep(next);
                    });
                    pendingCount--;
                } else {
                    pendingCount--;
                }
            }
            var buildArr = [];
            each(arr, function(item2) {
                each(kmdmdinfo, function(item) {
                    if (item.c == item2) {
                        buildArr.push(item);
                        var moduleArr = [];
                        var fnResult = new Function(item.a, item.b);
                        for (i = 0; i < item.d.length; i++) {
                            moduleArr.push(modules[item.d[i]]);
                        }
                        var obj = fnResult.apply(null, moduleArr);
                        modules[item.c] = obj;
                    }
                });
            });
            buildArrs.push({
                name: currentFullname,
                buildArr: buildArr
            });
        });
        return buildArrs;
    }
    function checkModuleCpt() {
        if (allPending.length > 0) return;
        if (currentPendingModuleFullName.length == 0) return;
        checkModules = {};
        var buildArrs = [];
        each(currentPendingModuleFullName, function(currentFullname) {
            var mainDep;
            each(kmdmdinfo, function(item) {
                if (item.c == currentFullname) {
                    mainDep = item;
                }
            });
            var arr = [];
            var pendingCount = 0;
            catchAllDep(mainDep);
            function catchAllDep(md) {
                pendingCount++;
                if (md && isInArray(arr, md.c)) {
                    remove(arr, md.c);
                }
                if (md) arr.push(md.c);
                if (md && md.d.length > 0) {
                    each(md.d, function(item) {
                        if (isInArray(arr, item)) {
                            remove(arr, item);
                        }
                        arr.push(item);
                        var next;
                        each(kmdmdinfo, function(item2) {
                            if (item2.c == item) {
                                next = item2;
                                return false;
                            }
                        });
                        if (next) catchAllDep(next);
                    });
                    pendingCount--;
                } else {
                    pendingCount--;
                }
            }
            var buildArr = [];
            each(arr, function(item2) {
                each(kmdmdinfo, function(item) {
                    if (item.c == item2) {
                        buildArr.push(item);
                        var moduleArr = [];
                        var fnResult = new Function(item.a, item.b);
                        for (i = 0; i < item.d.length; i++) {
                            moduleArr.push(modules[item.d[i]]);
                        }
                        var obj = fnResult.apply(null, moduleArr);
                        modules[item.c] = obj;
                    }
                });
            });
            buildArrs.push({
                name: currentFullname,
                buildArr: buildArr
            });
        });
        setTimeout(function() {
            var mdArr = [];
            for (var i = 0, len = currentPendingModuleFullName.length; i < len; i++) {
                if (modules[currentPendingModuleFullName[i]]) {
                    mdArr.push(modules[currentPendingModuleFullName[i]]);
                }
            }
            currentPendingModuleFullName.length = 0;
            if (define.pendingCallback.length > 0) {
                each(define.pendingCallback, function(item) {
                    remove(define.pendingCallback, item);
                    item && item.apply(null, mdArr);
                });
            }
        }, 0);
        if (isMDBuild) {
            each(buildArrs, function(item) {
                var ctt = doc.createElement("div");
                var msgDiv = doc.createElement("div");
                var titleDiv = doc.createElement("div");
                titleDiv.innerHTML = "Build Complete!";
                msgDiv.innerHTML = item.name + ".js  ";
                var codePanel = doc.createElement("textarea");
                ctt.appendChild(titleDiv);
                ctt.appendChild(codePanel);
                ctt.appendChild(msgDiv);
                doc.body.appendChild(ctt);
                codePanel.setAttribute("rows", "25");
                codePanel.setAttribute("cols", "45");
                var cpCode = "kmdjs.exec(" + JSON.stringify(item.buildArr).replace(/\s+/g, " ") + ")";
                codePanel.value = cpCode;
                codePanel.focus();
                codePanel.select();
                downloadFile(cpCode, item.name + ".js");
            });
            isMDBuild = false;
        }
    }
    function downloadFile(code, fileName) {
        if (window.URL.createObjectURL) {
            var fileParts = [ code ];
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
    var breakCycleModules = [];
    function fixCycle(deps, nick, p) {
        for (var i = 0; i < deps.length; i++) {
            for (var j = 0; j < kmdmdinfo.length; j++) {
                if (deps[i] == kmdmdinfo[j].c) {
                    if (kmdmdinfo[j].c == nick || fixCycle(kmdmdinfo[j].d, nick, kmdmdinfo[j])) {
                        remove(p.d, nick);
                        if (!isInArray(breakCycleModules, nick)) breakCycleModules.push(nick);
                        var className = nick.split(".")[nick.split(".").length - 1];
                        remove(p.a, className);
                        p.b = p.b.replace(new RegExp("\\b" + className + "\\b", "g"), "__modules['" + nick + "']");
                    }
                }
            }
        }
    }
    function checkMainCpt() {
        if (allPending.length > 0) return;
        if (kmdmaincpt) return;
        kmdmaincpt = true;
        var mainDep;
        each(kmdmdinfo, function(item) {
            fixCycle(item.d, item.c, item);
            if (item.c == ProjName + ".Main") {
                mainDep = item;
            }
        });
        var arr = [];
        var pendingCount = 0;
        catchAllDep(mainDep);
        var nextBuildArr = [];
        each(breakCycleModules, function(item) {
            each(kmdmdinfo, function(item2) {
                if (item == item2.c) {
                    nextBuildArr.push(item2);
                }
            });
        });
        each(nextBuildArr, function(item) {
            catchAllDep(item);
        });
        function catchAllDep(md) {
            pendingCount++;
            if (md && isInArray(arr, md.c)) {
                remove(arr, md.c);
            }
            if (md) arr.push(md.c);
            if (md && md.d.length > 0) {
                each(md.d, function(item) {
                    if (isInArray(arr, item)) {
                        remove(arr, item);
                    }
                    arr.push(item);
                    var next;
                    each(kmdmdinfo, function(item2) {
                        if (item2.c == item) {
                            next = item2;
                            return false;
                        }
                    });
                    if (next) catchAllDep(next);
                });
                pendingCount--;
            } else {
                pendingCount--;
            }
        }
        var buildArr = [];
        each(arr, function(item2) {
            each(kmdmdinfo, function(item) {
                if (item.c == item2) {
                    buildArr.push(item);
                    var moduleArr = [];
                    var fnResult = new Function(item.a, item.b);
                    for (i = 0; i < item.d.length; i++) {
                        moduleArr.push(modules[item.d[i]]);
                    }
                    var obj = fnResult.apply(null, moduleArr);
                    modules[item.c] = obj;
                }
            });
        });
        setTimeout(function() {
            if (!isView && !isBuild) new modules[ProjName + ".Main"]();
        }, 0);
        if (isBuild) {
            var ctt = doc.createElement("div");
            var msgDiv = doc.createElement("div");
            var titleDiv = doc.createElement("div");
            titleDiv.innerHTML = "Build Complete!";
            msgDiv.innerHTML = ProjName + ".js ";
            var codePanel = doc.createElement("textarea");
            ctt.appendChild(titleDiv);
            ctt.appendChild(codePanel);
            ctt.appendChild(msgDiv);
            doc.body.appendChild(ctt);
            codePanel.setAttribute("rows", "8");
            codePanel.setAttribute("cols", "55");
            var cpCode = '(function(n){function l(n,t,u){var f=i.createElement("script"),s;u&&(s=isFunction(u)?u(n):u,s&&(f.charset=s)),a(f,t,n),f.async=!0,f.src=n,o=f,e?r.insertBefore(f,e):r.appendChild(f),o=null}function a(n,t,i){function u(i){n.onload=n.onerror=n.onreadystatechange=null,c.debug||r.removeChild(n),n=null,t(i)}var f="onload"in n;f?(n.onload=u,n.onerror=function(){throw"bad request!__"+i+"  404 (Not Found) ";}):n.onreadystatechange=function(){/loaded|complete/.test(n.readyState)&&u()}}function v(n,t){var r,i;if(n.lastIndexOf)return n.lastIndexOf(t);for(r=t.length,i=n.length-1-r;i>-1;i--)if(t===n.substr(i,r))return i;return-1}var h="' + ProjName + '",i=document,c={},r=i.head||i.getElementsByTagName("head")[0]||i.documentElement,e=r.getElementsByTagName("base")[0],o,u={},t;u.get=function(n,i){var f,e,o,u,r,s;for(typeof n=="string"&&(n=[n]),r=0,u=n.length;r<u;r++)v(n[r],".")==-1&&(n[r]=h+"."+n[r]);for(f=!0,e=[],r=0,u=n.length;r<u;r++)t.modules[n[r]]?e.push(t.modules[n[r]]):f=!1;if(f)i.apply(null,e);else for(o=0,u=n.length,r=0;r<u;r++)s=[],l(n[r]+".js",function(){if(o++,o==u){for(var r=0;r<u;r++)t.modules[n[r]]&&s.push(t.modules[n[r]]);i.apply(null,s)}})},u.exec=function(n){for(var u,o,s,r=0,f=n.length;r<f;r++){var i=n[r],e=[],h=new Function(i.a,i.b);for(u=0,o=i.d.length;u<o;u++)e.push(t.modules[i.d[u]]);s=h.apply(null,e),t.modules[i.c]=s}},n.kmdjs=u;var f=!1,y=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/,s=function(){};s.extend=function(n){function i(){!f&&this.ctor&&this.ctor.apply(this,arguments)}var e=this.prototype,u,r,t;f=!0,u=new this,f=!1;for(t in n)t!="statics"&&(u[t]=typeof n[t]=="function"&&typeof e[t]=="function"&&y.test(n[t])?function(n,t){return function(){var r=this._super,i;return this._super=e[n],i=t.apply(this,arguments),this._super=r,i}}(t,n[t]):n[t]);for(r in this)this.hasOwnProperty(r)&&r!="extend"&&(i[r]=this[r]);if(n.statics)for(t in n.statics)t=="ctor"?n.statics[t].call(i):i[t]=n.statics[t];return i.prototype=u,i.prototype.constructor=i,i.extend=arguments.callee,i},n.__class=s,t={},t.modules={},n.__modules=t.modules,t.all=' + JSON.stringify(buildArr) + ',u.exec(t.all),new t.modules["' + ProjName + '.Main"]})(this)';
            codePanel.value = cpCode;
            codePanel.focus();
            codePanel.select();
            downloadFile(cpCode, ProjName + ".Main.js");
            var lmclone = [];
            each(lazyMdArr, function(item) {
                lmclone.push(item);
            });
            kmdjs.get(lazyMdArr, function() {
                var lzBuildArrs = getBuildArr(lmclone);
                each(lzBuildArrs, function(item) {
                    var ctt = doc.createElement("div");
                    var msgDiv = doc.createElement("div");
                    msgDiv.innerHTML = item.name + ".js ";
                    var codePanel = doc.createElement("textarea");
                    ctt.appendChild(codePanel);
                    ctt.appendChild(msgDiv);
                    doc.body.appendChild(ctt);
                    codePanel.setAttribute("rows", "8");
                    codePanel.setAttribute("cols", "55");
                    var cpCode = "kmdjs.exec(" + JSON.stringify(item.buildArr).replace(/\s+/g, " ") + ")";
                    codePanel.value = cpCode;
                    downloadFile(cpCode, item.name + ".js");
                });
            });
        }
        if (isView) {
            var holder = document.createElement("div");
            holder.setAttribute("id", "holder");
            document.body.appendChild(holder);
            var data = [];
            for (var i = 0, len = buildArr.length; i < len; i++) {
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
    function remove(arr, item) {
        for (var i = arr.length - 1; i > -1; i--) {
            if (arr[i] == item) {
                arr.splice(i, 1);
            }
        }
    }
    function each(arry, action) {
        for (var i = arry.length - 1; i > -1; i--) {
            var result = action(arry[i]);
            if (isBoolean(result) && !result) break;
        }
    }
    kmdjs.build = function(fullname) {
        currentPendingModuleFullName = [ fullname ];
        isMDBuild = true;
        allPending.push(fullname);
        if (mapping[fullname]) {
            request(mapping[fullname], function() {
                remove(allPending, fullname);
                if (currentPendingModuleFullName.length > 0) {
                    checkModuleCpt();
                } else {
                    checkMainCpt();
                }
            });
        } else {
            throw "no module named :" + ns;
        }
    };
    function stringifyWithFuncs(obj) {
        Object.prototype.toJSON = function() {
            var sobj = {}, i;
            for (i in this) if (this.hasOwnProperty(i)) if (typeof this[i] == "function") {
                sobj[i] = addSi(this[i]);
            } else {
                sobj[i] = this[i];
            }
            return sobj;
        };
        var str = JSON.stringify(obj);
        delete Object.prototype.toJSON;
        return str;
    }
    function lastIndexOf(str, word) {
        if (str.lastIndexOf) return str.lastIndexOf(word);
        var len = word.length;
        for (var i = str.length - 1 - len; i > -1; i--) {
            if (word === str.substr(i, len)) {
                return i;
            }
        }
        return -1;
    }
    function isInArray(arr, item) {
        for (var i = 0, j = arr.length; i < j; i++) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }
    function isInScopeChainVariables(scope, name) {
        if (scope) {
            var vars = scope.variables._values;
            if (Object.prototype.hasOwnProperty.call(vars, "$" + name)) {
                return true;
            }
            if (scope.parent_scope) {
                return isInScopeChainVariables(scope.parent_scope, name);
            }
        }
        return false;
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "");
        };
    }
    function getRef(fn) {
        var U2 = UglifyJS;
        currentAST = U2.parse(fn.toString());
        currentAST.figure_out_scope();
        var result = [];
        currentAST.walk(new U2.TreeWalker(function(node) {
            if (node instanceof U2.AST_New) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                if (name && name != "this" && !(name in window) && !isInScopeChainVariables(scope, name)) {
                    isInArray(result, name) || result.push(name);
                }
            }
            if (node instanceof U2.AST_Dot) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                if (name && name != "this" && !(name in window) && !isInScopeChainVariables(scope, name)) {
                    isInArray(result, name) || result.push(name);
                }
            }
            if (node instanceof U2.AST_SymbolRef) {
                var name = node.name;
                if (name && name != "this" && !(name in window) && !isInScopeChainVariables(node.scope, name)) {
                    isInArray(result, name) || result.push(name);
                }
            }
            if (node instanceof U2.AST_Call) {
                if (node.expression.property == "get" && node.expression.expression.name == "kmdjs") {
                    if (node.args[0].value) {
                        lazyMdArr.push(node.args[0].value);
                    } else {
                        for (var i = 0, len = node.args[0].elements.length; i < len; i++) {
                            var item = node.args[0].elements[i];
                            lazyMdArr.push(item.value);
                        }
                    }
                }
            }
        }));
        return result;
    }
    function log(msg) {
        try {
            console.log(msg);
        } catch (ex) {}
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
                    if (arr2[1] == "build") {
                        isBuild = true;
                    } else {
                        isView = true;
                    }
                }
                break;
            }
        }
        return baseUrl;
    }
    allPending.push("Main");
    request(dataMain + ".js", function() {
        remove(allPending, "Main");
        if (currentPendingModuleFullName.length > 0) {
            checkModuleCpt();
        } else {
            checkMainCpt();
        }
    });
    kmdjs.config = function(option) {
        ProjName = option.name;
        cBaseUrl = option.baseUrl;
        var i;
        if (option.deps) {
            for (i = 0; i < option.deps.length; i++) {
                var item = option.deps[i];
                classList.push(item.name);
                var arr = item.name.split(".");
                mapping[item.name] = cBaseUrl + "/" + (item.url ? item.url + "/" : "") + item.name + ".js";
                nsmp[arr[arr.length - 1]] = item.name;
            }
        }
        if (option.classes) {
            for (i = 0; i < option.classes.length; i++) {
                var item = option.classes[i];
                classList.push(item.name);
                var arr = item.name.split(".");
                if (item.url) {
                    if (lastIndexOf(item.url, "http:") == -1) {
                        mapping[item.name] = cBaseUrl + "/" + item.url + "/" + arr[arr.length - 1] + ".js";
                    } else {
                        mapping[item.name] = item.url;
                    }
                } else {
                    if (item.kmd == false) {
                        mapping[item.name] = cBaseUrl + "/" + item.name + ".js";
                        xmdModules[item.name] = true;
                    } else {
                        mapping[item.name] = cBaseUrl + "/" + arr[arr.length - 1] + ".js";
                    }
                }
                nsmp[arr[arr.length - 1]] = item.name;
            }
        }
    };
    kmdjs.exec = function(a) {
        each(a, function(item) {
            kmdmdinfo.push(item);
        });
    };
    global.__class = __class;
    define.modules = global.__modules = modules;
    global.define = define;
    global.kmdjs = kmdjs;
})(this);
})();