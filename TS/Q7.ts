abstract class shape{
    len:number;
    bre:number;

    constructor(len:number,bre:number){
        this.len=len;
        this.bre=bre;
    }

    abstract area():number;
}

class rectangle extends shape{
    area(){
        return this.len*this.bre;
    }
    constructor(len:number, bre:number){
        super(len,bre);
    }
    
}


let ob1 = new rectangle(23,34);
console.log(ob1.area());
