import axios from "axios";
import { BASE_URL, ADDCONTACT } from "../../endpoints";



export function addContact(data) {
    return axios.post(BASE_URL + ADDCONTACT, data)
}
