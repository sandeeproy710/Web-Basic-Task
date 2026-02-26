class bank {
    name: string;
    private acc: number;
    protected bal: number;

    constructor(name: string, acc: number, bal: number) {
        this.name = name;
        this.acc = acc;
        this.bal = bal;
    }

    get getacc() {
        return this.acc;
    }

}

class admin extends bank {
    constructor(name: string, acc: number, bal: number) {
        super(name, acc, bal);
    }
    display() {
        console.log(this.bal);

    }
}

let ob1 = new bank("San",1234,10000);
let ob2 = new admin("Ram",123445,10243000);

console.log(ob1.name);
console.log(ob1.getacc);
console.log(ob2.display());

