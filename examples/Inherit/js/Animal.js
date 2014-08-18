define("Animal", {
    statics: {
        TestStaticsProperty: 1,
        TestStaticsMethod: function () {
            return 2;
        }
    },
    ctor: function (age) {
        this.age = age;
    },
    eat: function () {
        alert(Animal.TestStaticsProperty);
        alert(Animal.TestStaticsMethod());
        return "nice";
    }
})
