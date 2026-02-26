fetch("https://api.escuelajs.co/api/v1/products").
    then((res) => {
        console.log(res);
    }).catch(
        (rej) => {
            console.log(rej);
        }
    ).finally(
        ()=>{
            console.log("success");
            
        }
    )