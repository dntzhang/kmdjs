define("User:Util.ObservableObject", {

    ctor: function (name, age) {
        
        this.name = name;
        this.age = age;


        this._super();
    },
    change: function (fn) {

        this.propertyChangedHandler = fn;
      
    },
    onPropertyChanged: function (prop,value) {
        this.propertyChangedHandler&&this.propertyChangedHandler(prop, value);
    }


})