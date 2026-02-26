import { user } from "./O8export.js"

class usrimport extends user {
    constructor(role: string) {
        super(role);
    }
}

let ob = new usrimport("Admin");
ob.display();