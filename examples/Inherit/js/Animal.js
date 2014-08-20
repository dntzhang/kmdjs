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
        //test("Test Class Static  Property Access", function () {

        //    equal(Animal.TestStaticsProperty, 1);
        //})
        //test("Test Class Static  Method Access", function () {

        //    equal(Animal.TestStaticsMethod(), 2);
        //})
        return "nice";
    }
})
