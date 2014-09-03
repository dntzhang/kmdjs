define("Util", {

    statics: {
        randomColor: function () {
            var arr = ["F6626E"];
            return "#" + arr[Math.floor(Math.random() * arr.length)];
        },

        each: function (arry, action) {
            for (var i = arry.length - 1; i > -1; i--) {
                var result = action(arry[i],i);
            }
        },
        random : function (min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }
    }

})