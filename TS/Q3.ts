class student {
    name: string;
    roll: number;

    constructor(name: string, roll: number) {
        this.name = name;
        this.roll = roll;
    }

    display() {
        console.log(this.name, this.roll);
    }
}

let obj = new student("Sam", 100);
obj.display();