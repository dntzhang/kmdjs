require('kud')(require('./kmd.json'),function(bundle,min_bundle){
    //you can get bundle here
    console.log(bundle);
    console.log(min_bundle);
    console.log("------------------- end of kud -------------------")
});