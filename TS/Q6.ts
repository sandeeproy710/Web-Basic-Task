abstract class vehicle {
    model: string;
    make:number;

    constructor(model:string,make:number){
        this.model=model;
        this.make=make;
    }

    abstract disp(): void;

}

class BMW extends vehicle {
    disp() {
        console.log(this.make,this.model);
    }

    constructor(model:string,make:number){
        super(model,make);
    }

}

let obj = new BMW("M5", 2018);
obj.disp();