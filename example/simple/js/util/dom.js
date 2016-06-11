kmdjs.define("util.dom",['util.bom'] ,function(){
    var Dom={};

    Dom.add = function(a,b){

        return util.bom.sub(a,b);
    }

    return Dom;
});