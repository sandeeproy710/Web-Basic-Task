class emp {
    name: string;
    acc: number;


    constructor(name: string, acc: number) {
        this.name = name;
        this.acc = acc;
    }

}

class manager extends emp {
    constructor(name: string, acc: number) {
        super(name, acc);
    }
    display() {
        console.log(this.name, this.acc);

    }
}

let ob1 = new manager("San", 1234);
ob1.display();