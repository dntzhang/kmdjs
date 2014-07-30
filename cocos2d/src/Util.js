define("Util", {

    statics: {
        randomColor: function () {
            var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
            var str = "#";
            for (var i = 0; i < 6; i++) {
                str += arr[Math.floor(Math.random() * arr.length)];
            }
            return str;

        },

        random: function (min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }
    }

})