import axios from "axios";
import { BASE_URL, CHATBOT } from "../../endpoints";

export function sendChat(message) {
    return axios.post(BASE_URL + CHATBOT, { message });
}