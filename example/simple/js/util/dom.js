kmdjs.define("util.dom",['util.bom'] ,function(){
    var Dom={};

    Dom.add = function(a,b){
        return bom.sub(a,b);
    }

    return Dom;
});