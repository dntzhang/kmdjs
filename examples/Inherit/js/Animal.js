define("Animal", {
    statics: {
        TestStaticsProperty: 1,
        TestStaticsMethod: function () {
            return 2;
        }
    },
    init: function (age) {
        this.age = age;
    },
    eat: function () {
        return "nice";
    }
})
