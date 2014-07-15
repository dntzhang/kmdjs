/// <reference path="qunit.js" />
kmdjs.config({
    name: "HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Animal" },
        { name: "HelloKMD.Pig" },
        { name: "HelloKMD.PigSub" }
    ]

});
define("Main", {
    init: function () {
        var anm = new Animal(10);
        test("Object Create", function () {
            equal(anm.age, 10);
        });
        var pig = new Pig(11);
        test("Test _super Method", function () {
            equal(pig.age, 11);
        });
        test("Test Static Property", function () {
            equal(Animal.TestStaticsProperty, 1);
        });
        test("Test Static Method", function () {
            equal(Animal.TestStaticsMethod(), 2);
        });
        test("Sub Method ", function () {
            equal(pig.climbTree(), "猪不能上树");
        });
        pig.eat();
        test("Parent Method Inherit", function () {
            equal(pig.eat(), "nice");
        });
        test("Test Static Property Inherit", function () {
            equal(Pig.TestStaticsProperty, 1);
        });
        test("Test Static Method Inherit", function () {
            equal(Pig.TestStaticsMethod(), 2);
        });

        var ps = new PigSub();
        test("Test Static Method Inherit", function () {
            equal(PigSub.TestStaticsMethod(), 2);
        });
    }
})
