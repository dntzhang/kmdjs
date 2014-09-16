define("User:Util.Observable", {

    ctor: function (name, age) {
        
        this.name = name;
        this.age = age;

        this.contact = { email: "mhtml5@qq.com", qq: "644213943" };

        this.hobby = ["eating", "drinking" ,"gambling"];
        this._super();
    }
})