var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var emp = /** @class */ (function () {
    function emp(name, acc) {
        this.name = name;
        this.acc = acc;
    }
    return emp;
}());
var manager = /** @class */ (function (_super) {
    __extends(manager, _super);
    function manager(name, acc) {
        return _super.call(this, name, acc) || this;
    }
    manager.prototype.display = function () {
        console.log(this.name, this.acc);
    };
    return manager;
}(emp));
var ob1 = new manager("San", 1234);
ob1.display();
