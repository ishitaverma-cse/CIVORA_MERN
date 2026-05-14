//this is API SERVICE LAYER, 
// we write all API calls here and
// reuse them everywhere.

//axios = used to make HTTP requests.
import axios from 'axios'
import { BASE_URL, REGISTER, LOGIN, ALLCITIZEN, BLOCKUSER, SENDOTP, RESETPASSWORD } from '../../endpoints';

function getToken() {
    let token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: token
        }
    }
}

export function register(data) {
    return axios.post(BASE_URL + REGISTER, data)      //final URL
}
export function login(data) {
    return axios.post(BASE_URL + LOGIN, data)
}
export function sendOtp(data) {

    console.log("Sinding req with data: ", data )
    console.log("Sinding req to: ", BASE_URL + SENDOTP )
    return axios.post(BASE_URL + SENDOTP, data)
}
export function resetPassword(data) {
    return axios.post(BASE_URL + RESETPASSWORD, data)
}
export function allCitizen(data) {
    return axios.post(BASE_URL + ALLCITIZEN, data, getToken())
}
export function blockUser(data) {
    return axios.post(BASE_URL + BLOCKUSER, data, getToken())
}