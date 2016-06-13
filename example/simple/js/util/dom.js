kmdjs.define("util.dom",['util.bom'] ,function(bom){
    var Dom={};

    Dom.add = function(a,b){
        //循环依赖导致的bom undefined，所以这里写上namespace
        return util.bom.sub(a,b);
    }

    return Dom;
});