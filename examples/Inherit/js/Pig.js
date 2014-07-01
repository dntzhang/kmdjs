define("Pig:Animal", {
    init: function (age,name) {
        this._super(age);
        this.name = name;
    },
    climbTree: function () {
        return "猪不能上树";
    }
})
