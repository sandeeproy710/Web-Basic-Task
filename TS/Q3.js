var student = /** @class */ (function () {
    function student(name, roll) {
        this.name = name;
        this.roll = roll;
    }
    student.prototype.display = function () {
        console.log(this.name, this.roll);
    };
    return student;
}());
var obj = new student("Sam", 100);
obj.display();
