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
var bank = /** @class */ (function () {
    function bank(name, acc, bal) {
        this.name = name;
        this.acc = acc;
        this.bal = bal;
    }
    Object.defineProperty(bank.prototype, "getacc", {
        get: function () {
            return this.acc;
        },
        enumerable: false,
        configurable: true
    });
    return bank;
}());
var admin = /** @class */ (function (_super) {
    __extends(admin, _super);
    function admin(name, acc, bal) {
        return _super.call(this, name, acc, bal) || this;
    }
    admin.prototype.display = function () {
        console.log(this.bal);
    };
    return admin;
}(bank));
var ob1 = new bank("San", 1234, 10000);
var ob2 = new admin("Ram", 123445, 10243000);
console.log(ob1.name);
console.log(ob1.getacc);
console.log(ob2.display());
