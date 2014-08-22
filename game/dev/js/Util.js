define("Util", {

    statics: {
        randomColor: function () {
            var arr = ["FF6347", "DA70D6", "A020F0", "7171C6", "5F9EA0", "008B00", "00CDCD", "8B475D", "FF6A6A"];
            return "#" + arr[Math.floor(Math.random() * arr.length)];
        },

        each: function (arry, action) {
            for (var i = arry.length - 1; i > -1; i--) {
                var result = action(arry[i]);
            }
        },
        random : function (min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }
    }

})