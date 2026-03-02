import { hostelService } from "./service/hostelService.js";
import { UI } from "./UI/ui.js";

const data = new hostelService();
new UI(data);
