export class user{
    role: string;
    constructor(role:string){
        this.role=role;
    }
    display(){
        console.log(this.role);
    }
}