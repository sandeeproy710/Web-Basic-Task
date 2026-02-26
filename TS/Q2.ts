interface pay {
    name: string;
    amt: string | number;
}

let usr: pay= {
    name: "sam",
    amt: 100
}


let usr2: pay= {
    name: "sam",
    amt: "$100"
}

console.log(usr.name,usr.amt);
console.log(usr2.name,usr2.amt);
