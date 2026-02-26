interface product{
    id: number;
    title: string;
    price: number;
    description:string;
    category:string;
    image: string;

}
async function getData():Promise<product[]> {
    let response: Response=await fetch("https://fakestoreapi.com/products/");
    let data: product[] = await response.json();
    // console.log(data);

    return data;
    
    
}
getData()
.then((res) => {
    console.log(res);
})
.catch((rej) => {
    console.log(rej);
    
})