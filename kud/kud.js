/** kud v0.1.4
 * kmdjs bundler -> kud
 * kmdjs bundle builder-> kud
 * Created by dntzhang on 2016/6/17.
 */
var KMD_CONFIG= {},
    hasReadModule = {},
    cacheModule = [],
    nsList = [];

var winProps='NaN,Uint32Array,Math,JSON,RangeError,Float64Array,Infinity,Map,RegExp,encodeURIComponent,Uint16Array,unescape,Array,URIError,Error,Int16Array,eval,Symbol,DataView,ReadableStream,Uint8Array,ReferenceError,Function,WeakMap,String,Int32Array,decodeURI,TypeError,Reflect,Promise,Float32Array,ArrayBuffer,escape,EvalError,encodeURI,Number,Int8Array,isNaN,parseInt,isFinite,WeakSet,Intl,Set,Proxy,Boolean,Uint8ClampedArray,Object,SyntaxError,decodeURIComponent,parseFloat,Date,undefined,external,chrome,document,botguard,google_image_requests,globalProps,readGlobalProps,findNewEntries,Path2D,speechSynthesis,SpeechSynthesisUtterance,SpeechSynthesisEvent,webkitSpeechRecognitionEvent,webkitSpeechRecognitionError,webkitSpeechRecognition,webkitSpeechGrammarList,webkitSpeechGrammar,ScreenOrientation,PushSubscription,PushManager,PresentationRequest,Presentation,PresentationConnection,PresentationConnectionCloseEvent,PresentationConnectionAvailableEvent,PresentationAvailability,Permissions,PermissionStatus,Notification,MediaRecorder,BlobEvent,MediaDevices,CanvasCaptureMediaStreamTrack,caches,ondeviceorientationabsolute,PasswordCredential,FederatedCredential,CredentialsContainer,Credential,SyncManager,BeforeInstallPromptEvent,AppBannerPromptResult,webkitOfflineAudioContext,webkitAudioContext,OfflineAudioContext,AudioContext,localStorage,sessionStorage,webkitStorageInfo,webkitRTCPeerConnection,webkitMediaStream,webkitIDBTransaction,webkitIDBRequest,webkitIDBObjectStore,webkitIDBKeyRange,webkitIDBIndex,webkitIDBFactory,webkitIDBDatabase,webkitIDBCursor,indexedDB,webkitIndexedDB,ondeviceorientation,ondevicemotion,crypto,WebSocket,WebGLUniformLocation,WebGLTexture,WebGLShaderPrecisionFormat,WebGLShader,WebGLRenderingContext,WebGLRenderbuffer,WebGLProgram,WebGLFramebuffer,WebGLContextEvent,WebGLBuffer,WebGLActiveInfo,WaveShaperNode,TextEncoder,TextDecoder,SubtleCrypto,StorageEvent,Storage,SourceBufferList,SourceBuffer,ServiceWorkerRegistration,ServiceWorkerMessageEvent,ServiceWorkerContainer,ServiceWorker,ScriptProcessorNode,Response,Request,RTCSessionDescription,RTCIceCandidate,RTCCertificate,Plugin,PluginArray,PeriodicWave,OscillatorNode,OfflineAudioCompletionEvent,MimeType,MimeTypeArray,MediaStreamTrack,MediaStreamEvent,MediaStreamAudioSourceNode,MediaStreamAudioDestinationNode,MediaSource,MediaKeys,MediaKeySystemAccess,MediaKeyStatusMap,MediaKeySession,MediaKeyMessageEvent,MediaEncryptedEvent,MediaElementAudioSourceNode,MIDIPort,MIDIOutputMap,MIDIOutput,MIDIMessageEvent,MIDIInputMap,MIDIInput,MIDIConnectionEvent,MIDIAccess,IIRFilterNode,IDBVersionChangeEvent,IDBTransaction,IDBRequest,IDBOpenDBRequest,IDBObjectStore,IDBKeyRange,IDBIndex,IDBFactory,IDBDatabase,IDBCursorWithValue,IDBCursor,Headers,GamepadEvent,Gamepad,GamepadButton,GainNode,DynamicsCompressorNode,DeviceOrientationEvent,DeviceMotionEvent,DelayNode,CryptoKey,Crypto,ConvolverNode,CloseEvent,ChannelSplitterNode,ChannelMergerNode,CanvasRenderingContext2D,CanvasPattern,CanvasGradient,CacheStorage,Cache,BiquadFilterNode,BatteryManager,AudioProcessingEvent,AudioParam,AudioNode,AudioListener,AudioDestinationNode,AudioBufferSourceNode,AudioBuffer,AnalyserNode,postMessage,blur,focus,close,XSLTProcessor,SVGMPathElement,SVGDiscardElement,SVGAnimationElement,SharedWorker,IdleDeadline,onautocompleteerror,onautocomplete,onunhandledrejection,onrejectionhandled,PromiseRejectionEvent,IntersectionObserverEntry,IntersectionObserver,InputDeviceCapabilities,applicationCache,performance,onunload,onstorage,onpopstate,onpageshow,onpagehide,ononline,onoffline,onmessage,onlanguagechange,onhashchange,onbeforeunload,onwaiting,onvolumechange,ontoggle,ontimeupdate,onsuspend,onsubmit,onstalled,onshow,onselect,onseeking,onseeked,onscroll,onresize,onreset,onratechange,onprogress,onplaying,onplay,onpause,onmousewheel,onmouseup,onmouseover,onmouseout,onmousemove,onmouseleave,onmouseenter,onmousedown,onloadstart,onloadedmetadata,onloadeddata,onload,onkeyup,onkeypress,onkeydown,oninvalid,oninput,onfocus,onerror,onended,onemptied,ondurationchange,ondrop,ondragstart,ondragover,ondragleave,ondragenter,ondragend,ondrag,ondblclick,oncuechange,oncontextmenu,onclose,onclick,onchange,oncanplaythrough,oncanplay,oncancel,onblur,onabort,XPathResult,XPathExpression,XPathEvaluator,XMLSerializer,XMLHttpRequestUpload,XMLHttpRequestEventTarget,XMLHttpRequest,XMLDocument,Worker,Window,WheelEvent,WebKitCSSMatrix,ValidityState,VTTCue,URLSearchParams,URL,UIEvent,TreeWalker,TransitionEvent,TrackEvent,TouchList,TouchEvent,Touch,TimeRanges,TextTrackList,TextTrackCueList,TextTrackCue,TextTrack,TextMetrics,TextEvent,Text,StyleSheetList,StyleSheet,ShadowRoot,Selection,SecurityPolicyViolationEvent,Screen,SVGZoomEvent,SVGViewSpec,SVGViewElement,SVGUseElement,SVGUnitTypes,SVGTransformList,SVGTransform,SVGTitleElement,SVGTextPositioningElement,SVGTextPathElement,SVGTextElement,SVGTextContentElement,SVGTSpanElement,SVGSymbolElement,SVGSwitchElement,SVGStyleElement,SVGStringList,SVGStopElement,SVGSetElement,SVGScriptElement,SVGSVGElement,SVGRectElement,SVGRect,SVGRadialGradientElement,SVGPreserveAspectRatio,SVGPolylineElement,SVGPolygonElement,SVGPointList,SVGPoint,SVGPatternElement,SVGPathElement,SVGNumberList,SVGNumber,SVGMetadataElement,SVGMatrix,SVGMaskElement,SVGMarkerElement,SVGLinearGradientElement,SVGLineElement,SVGLengthList,SVGLength,SVGImageElement,SVGGraphicsElement,SVGGradientElement,SVGGeometryElement,SVGGElement,SVGForeignObjectElement,SVGFilterElement,SVGFETurbulenceElement,SVGFETileElement,SVGFESpotLightElement,SVGFESpecularLightingElement,SVGFEPointLightElement,SVGFEOffsetElement,SVGFEMorphologyElement,SVGFEMergeNodeElement,SVGFEMergeElement,SVGFEImageElement,SVGFEGaussianBlurElement,SVGFEFuncRElement,SVGFEFuncGElement,SVGFEFuncBElement,SVGFEFuncAElement,SVGFEFloodElement,SVGFEDropShadowElement,SVGFEDistantLightElement,SVGFEDisplacementMapElement,SVGFEDiffuseLightingElement,SVGFEConvolveMatrixElement,SVGFECompositeElement,SVGFEComponentTransferElement,SVGFEColorMatrixElement,SVGFEBlendElement,SVGEllipseElement,SVGElement,SVGDescElement,SVGDefsElement,SVGCursorElement,SVGComponentTransferFunctionElement,SVGClipPathElement,SVGCircleElement,SVGAnimatedTransformList,SVGAnimatedString,SVGAnimatedRect,SVGAnimatedPreserveAspectRatio,SVGAnimatedNumberList,SVGAnimatedNumber,SVGAnimatedLengthList,SVGAnimatedLength,SVGAnimatedInteger,SVGAnimatedEnumeration,SVGAnimatedBoolean,SVGAnimatedAngle,SVGAnimateTransformElement,SVGAnimateMotionElement,SVGAnimateElement,SVGAngle,SVGAElement,ReadableByteStream,Range,RadioNodeList,ProgressEvent,ProcessingInstruction,PopStateEvent,PerformanceTiming,PerformanceResourceTiming,PerformanceNavigation,PerformanceMeasure,PerformanceMark,PerformanceEntry,Performance,PageTransitionEvent,NodeList,NodeIterator,NodeFilter,Node,Navigator,NamedNodeMap,MutationRecord,MutationObserver,MutationEvent,MouseEvent,MessagePort,MessageEvent,MessageChannel,MediaQueryListEvent,MediaQueryList,MediaList,MediaError,Location,KeyboardEvent,ImageData,ImageBitmap,History,HashChangeEvent,HTMLVideoElement,HTMLUnknownElement,HTMLUListElement,HTMLTrackElement,HTMLTitleElement,HTMLTextAreaElement,HTMLTemplateElement,HTMLTableSectionElement,HTMLTableRowElement,HTMLTableElement,HTMLTableColElement,HTMLTableCellElement,HTMLTableCaptionElement,HTMLStyleElement,HTMLSpanElement,HTMLSourceElement,HTMLShadowElement,HTMLSelectElement,HTMLScriptElement,HTMLQuoteElement,HTMLProgressElement,HTMLPreElement,HTMLPictureElement,HTMLParamElement,HTMLParagraphElement,HTMLOutputElement,HTMLOptionsCollection,Option,HTMLOptionElement,HTMLOptGroupElement,HTMLObjectElement,HTMLOListElement,HTMLModElement,HTMLMeterElement,HTMLMetaElement,HTMLMenuElement,HTMLMediaElement,HTMLMarqueeElement,HTMLMapElement,HTMLLinkElement,HTMLLegendElement,HTMLLabelElement,HTMLLIElement,HTMLKeygenElement,HTMLInputElement,Image,HTMLImageElement,HTMLIFrameElement,HTMLHtmlElement,HTMLHeadingElement,HTMLHeadElement,HTMLHRElement,HTMLFrameSetElement,HTMLFrameElement,HTMLFormElement,HTMLFormControlsCollection,HTMLFontElement,HTMLFieldSetElement,HTMLEmbedElement,HTMLElement,HTMLDocument,HTMLDivElement,HTMLDirectoryElement,HTMLDialogElement,HTMLDetailsElement,HTMLDataListElement,HTMLDListElement,HTMLContentElement,HTMLCollection,HTMLCanvasElement,HTMLButtonElement,HTMLBodyElement,HTMLBaseElement,HTMLBRElement,Audio,HTMLAudioElement,HTMLAreaElement,HTMLAnchorElement,HTMLAllCollection,FormData,FontFace,FocusEvent,FileReader,FileList,FileError,File,EventTarget,EventSource,Event,ErrorEvent,Element,DragEvent,DocumentType,DocumentFragment,Document,DataTransferItemList,DataTransferItem,DataTransfer,DOMTokenList,DOMStringMap,DOMStringList,DOMParser,DOMImplementation,DOMException,DOMError,CustomEvent,CompositionEvent,Comment,ClipboardEvent,ClientRectList,ClientRect,CharacterData,CSSViewportRule,CSSSupportsRule,CSSStyleSheet,CSSStyleRule,CSSStyleDeclaration,CSSRuleList,CSSRule,CSSPageRule,CSSNamespaceRule,CSSMediaRule,CSSKeyframesRule,CSSKeyframeRule,CSSImportRule,CSSGroupingRule,CSSFontFaceRule,CSS,CDATASection,Blob,BeforeUnloadEvent,BarProp,AutocompleteErrorEvent,Attr,ApplicationCacheErrorEvent,ApplicationCache,AnimationEvent,isSecureContext,onwheel,onwebkittransitionend,onwebkitanimationstart,onwebkitanimationiteration,onwebkitanimationend,ontransitionend,onsearch,onanimationstart,onanimationiteration,onanimationend,WebKitMutationObserver,webkitURL,WebKitAnimationEvent,WebKitTransitionEvent,styleMedia,defaultstatus,defaultStatus,screenTop,screenLeft,offscreenBuffering,event,clientInformation,console,devicePixelRatio,outerHeight,outerWidth,screenY,screenX,pageYOffset,scrollY,pageXOffset,scrollX,innerHeight,innerWidth,screen,navigator,frameElement,parent,opener,top,length,frames,closed,status,toolbar,statusbar,scrollbars,personalbar,menubar,locationbar,history,location,name,self,window,stop,open,alert,confirm,prompt,print,requestAnimationFrame,cancelAnimationFrame,captureEvents,releaseEvents,getComputedStyle,matchMedia,moveTo,moveBy,resizeTo,resizeBy,getSelection,find,getMatchedCSSRules,webkitRequestAnimationFrame,webkitCancelAnimationFrame,webkitCancelRequestAnimationFrame,btoa,atob,setTimeout,clearTimeout,setInterval,clearInterval,createImageBitmap,requestIdleCallback,cancelIdleCallback,scroll,scrollTo,scrollBy,fetch,webkitRequestFileSystem,webkitResolveLocalFileSystemURL,openDatabase'.split(',');

var moduleCount = 0;

var U2 = require("uglify-js"),
    fs = require("fs");

function readModule(path,end){
    if( hasReadModule[path])return;
    hasReadModule[path]=true;
    var content=fs.readFileSync(path, "utf8");
    var moduleInfo = getModuleInfo(content);
    var i= 0,
        len=moduleInfo.deps.length;
    for(;i<len;i++){
        readModule(KMD_CONFIG.mmp[moduleInfo.deps[i]]);
    }
    cacheModule.push(moduleInfo);

    if(moduleCount===cacheModule.length){
        sortFactories();
        var bundle=buildBundler();
        //fs.writeFileSync('bundle.js', bundle);
        //fs.writeFileSync('bundle.min.js', U2.minify(bundle, {fromString: true}).code);
        //console.log(bundle)
        end&&end(bundle, U2.minify(bundle, {fromString: true}).code);
    }
}

function getModuleInfo(code){
    var arr = /kmdjs\.define[\s]*\(([\s\S]*?)function[\s]*\(/g.exec(code)
    var str = arr[1].replace(/'|"/g,"");
    var depsMatch = /\[([\s\S]*)\]/g.exec(str);
    var deps=depsMatch?depsMatch[1].split(','):[];
    var name = str.split(',')[0];
    return {
        name:name,
        deps:deps,
        factory:/function[\s]*\([\s\S]*\)[\s\S]*\{[\s\S]*\}/g.exec(code)[0]
    };
}

function buildBundler(){
    var bundle = "";
    each(cacheModule, function (item) {
        if(checkBundleIgnore(item.name))nsToCode(item.name);
    });
    bundle+=  nsList.join('\n') +"\n\n";
    each(cacheModule, function (item) {
        if(checkBundleIgnore(item.name))bundle+=item.name+' = ('+ fixDeps(item.factory,item.deps)+')();\n\n' ;
    });
    return bundle;
}

function checkBundleIgnore(name){
    if(isInArray(name ,KMD_CONFIG.bundleIgnore))return false;
    return true;
}

function isInArray(str,arr){
    for(var i= 0,len=arr.length;i<len;i++){
        if(str === arr[i]){
            return true;
        }
    }
}

function each(array, action) {
    for (var i = 0,len= array.length; i < len; i++) {
        var result = action(array[i],i);
        if (result === false) break;
    }
}
function nsToCode(ns) {
    var nsSplitArr = ns.split(".");
    var topStr = "var " + nsSplitArr[0] + "={};";
    if(!isInArray(topStr,nsList)){
        nsList.push(topStr);
    }
    for (var i = 1; i < nsSplitArr.length -1; i++) {
        var str = nsSplitArr[0];
        for (var j = 1; j < i + 1; j++) str += "." + nsSplitArr[j];
        if(!isInArray(str + "={};",nsList)){
            nsList.push(str + "={};");
        }
    }
}

function fixDeps(fn,deps) {

    //uglify2不支持匿名转ast
    var code = fn.toString().replace('function','function ___kmdjs_temp');
    var ast = U2.parse(code);
    ast.figure_out_scope();
    var nodes = [];

    var topArr = [];
    each(deps,function(item){
        topArr.push(item.split('.')[0]);
    })

    ast.walk(new U2.TreeWalker(function (node) {

        if (node instanceof U2.AST_New) {
            var ex = node.expression;
            var name = ex.name;
            isInArray(name,topArr)||isInWindow(name) ||  isInScopeChainVariables(ex.scope, name) || nodes.push({name:name,node:node});
        }

        if (node instanceof U2.AST_Dot) {
            var ex = node.expression;
            var name = ex.name;
            var scope = ex.scope;
            if (scope) {
                isInArray(name,topArr)||isInWindow(name) || isInScopeChainVariables(ex.scope, name) || nodes.push({name:name,node:node});
            }
        }

        if (node instanceof U2.AST_SymbolRef) {
            var name = node.name;
            isInArray(name,topArr)||isInWindow(name) ||  isInScopeChainVariables(node.scope, name) || nodes.push({name:name,node:node});
        }
    }));

    var cloneNodes = [].concat(nodes);
    //过滤new nodes 中的symbo nodes
    for (var i = 0, len = nodes.length; i < len; i++) {
        var item = nodes[i];
        var nodeA = item.node;
        nodeA.replaceArea = [];
        nodeA.fullName=getFullName(deps, item.name);
        for (var j = 0, cLen = cloneNodes.length; j < cLen; j++) {
            var nodeB = cloneNodes[j].node;
            if (nodeB.expression === nodeA) {
                nodes.splice(i--, 1);
                len--;
            }
        }
    }

    for (var i = nodes.length; --i >= 0;) {
        var item = nodes[i],
            node=item.node;
        //   name=item.name;
        //var fullName=getFullName(deps,name);
        var replacement;
        if (node instanceof  U2.AST_New) {
            replacement = new U2.AST_New({
                expression: new U2.AST_SymbolRef({
                    name:node.fullName
                }),
                args: node.args
            });
        } else if (node instanceof  U2.AST_Dot) {
            replacement = new U2.AST_Dot({
                expression: new U2.AST_SymbolRef({
                    name: node.fullName
                }),
                property: node.property
            });
        }else if(node instanceof U2.AST_SymbolRef){
            replacement = new U2.AST_SymbolRef({
                name: node.fullName
            });
        }
        var start_pos = node.start.pos;
        var end_pos = node.end.endpos;
        for (var k = 0; k < nodes.length; k++) {
            var item2 = nodes[k];
            var otherNode = item2.node;
            if (otherNode.start.pos < start_pos && otherNode.end.endpos > end_pos) {
                var fna2 = otherNode.fullName;
                var step = fna2.length - item2.name.length;
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
        //
        //code = splice_string(code, start_pos, end_pos, replacement.print_to_string({
        //    beautify: true
        //}));
    }
    for (var i = nodes.length; --i >= 0;) {
        var node = nodes[i].node;
        if (node.parent) continue;
        var start_pos = node.start.pos;
        var end_pos = node.end.endpos;
        var replacement;
        var fna = node.fullName ;
        if (!node.fullName) continue;
        if (node instanceof U2.AST_New)
            replacement = new U2.AST_New({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                args: node.args
            }); else if (node instanceof U2.AST_SymbolRef)
            replacement = new U2.AST_SymbolRef({
                name: fna
            }); else replacement = new U2.AST_Dot({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                property: node.property
            });
        code = splice_string(code, start_pos, end_pos, replacement.print_to_string({
            beautify: true
        }));
        if (node.replaceArea && node.replaceArea.length > 0 && !node.parent) code = fixNode(node, code);
    }
    return code.replace('function ___kmdjs_temp','function');
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
        if (child instanceof U2.AST_New) {
            target=replaceToFullName(target, "new\\s+" + child.fullName ,"new " + child.expression.name);
            target=replaceToFullName(target, "new\\s+" + child.expression.name,"new " + child.fullName);
        } else {
            target=replaceToFullName(target,  child.fullName  , child.expression.name);
            target=replaceToFullName(target,  child.expression.name , child.fullName);
        }
    }
    code = splice_string(code, node.start.pos, node.end.endpos + step, target);
    return code;
}

function getFullName(deps,name){
    var i= 0,
        len=deps.length,
        matchCount= 0,
        result=[];

    for(;i<len;i++) {
        var fullName = deps[i];
        if (fullName.split('.').pop() === name) {
            matchCount++;
            if (!isInArray(result, fullName))  result.push(fullName);
        }
    }

    if(matchCount>1){
        throw "the same name conflict: "+result.join(" and ");
    } else if(matchCount===1){
        return result[0];
    }else{
        throw ' can not find module ['+name+']';
    }
}

function splice_string(str, begin, end, replacement) {
    return str.substr(0, begin) + replacement + str.substr(end);
}

function isInScopeChainVariables(scope, name) {
    var vars = scope.variables._values;
    if (Object.prototype.hasOwnProperty.call(vars, "$" + name)) {
        return true;
    }

    if (scope.parent_scope) {
        return isInScopeChainVariables(scope.parent_scope, name);
    }

    return false;
}

function isInWindow(name){
    if(name==='this')return true;
    if(isInArray(name,KMD_CONFIG.dependencies))return true;
    return isInArray(name,winProps);
}

function sortFactories(){
    var newArr = [];
    each(KMD_CONFIG.mapping, function (item) {
        each(cacheModule, function (factory) {
            if(item[0]===factory.name){
                newArr.push(factory);
            }
        });
    });
    cacheModule = newArr;
}

module.exports =  function(config,end){
    KMD_CONFIG = config;
    if(!KMD_CONFIG.dependencies){
        KMD_CONFIG.dependencies=[];
    }
    if(!KMD_CONFIG.bundleIgnore){
        KMD_CONFIG.bundleIgnore=[];
    }
    var mapping = KMD_CONFIG.mapping;
    moduleCount = mapping.length;
    var i= 0;
    KMD_CONFIG.mmp={};
    for(;i<moduleCount;i++){
        KMD_CONFIG.mmp[mapping[i][0]]=mapping[i][1];
    }
    readModule( KMD_CONFIG.mmp['main'],end)
}