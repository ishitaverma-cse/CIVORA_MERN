import axios from "axios";
import {
    BASE_URL, ADMIN_ALLISSUE, ADMIN_SINGLEISSUE, ADMIN_DELETEISSUE, ADMIN_PUBLICISSUE, ADMIN_UNASSIGNEDISSUES, ADMIN_ASSIGNISSUE, ADMIN_LATESTISSUES,
    CITIZEN_ADDISSUE, CITIZEN_ALLISSUE, CITIZEN_SINGLEISSUE, CITIZEN_UPDATEISSUE, CITIZEN_DELETEISSUE, CITIZEN_MYISSUE, CITIZEN_PUBLICISSUE,
    EMP_ALLISSUE, EMP_UPDATEISSUE
} from "../../endpoints";


function getToken() {
    let token = localStorage.getItem('token');

    return {
        headers: {
            Authorization: token
        }
    }
}

//CITIZEN ISSUE SERVICE
export function addIssue(data) {
    return axios.post(BASE_URL + CITIZEN_ADDISSUE, data, getToken())
}
export function allIssue(data) {
    return axios.post(BASE_URL + CITIZEN_ALLISSUE, data, getToken())
}
export function singleIssue(data) {
    return axios.post(BASE_URL + CITIZEN_SINGLEISSUE, data, getToken())
}
export function updateIssue(data) {
    return axios.post(BASE_URL + CITIZEN_UPDATEISSUE, data, getToken())
}
export function deleteIssue(data) {
    return axios.post(BASE_URL + CITIZEN_DELETEISSUE, data, getToken())
}
export function myIssues(data) {
    return axios.post(BASE_URL + CITIZEN_MYISSUE, data, getToken());
}
export function publicIssue(data) {
    return axios.post(BASE_URL + CITIZEN_PUBLICISSUE, data, getToken());
}

//ADMIN ISSUE SERVICE
export function admin_allIssue(data) {
    return axios.post(BASE_URL + ADMIN_ALLISSUE, data, getToken());
}
export function admin_singleIssue(data) {
    return axios.post(BASE_URL + ADMIN_SINGLEISSUE, data, getToken());
}
export function admin_deleteIssue(data) {
    return axios.post(BASE_URL + ADMIN_DELETEISSUE, data, getToken());
}
export function admin_publicIssue(data) {
    return axios.post(BASE_URL + ADMIN_PUBLICISSUE, data, getToken());
}
export function admin_unassignedIssues(data) {
    return axios.post(BASE_URL + ADMIN_UNASSIGNEDISSUES, data, getToken());
}
export function admin_assignIssue(data) {
    return axios.post(BASE_URL + ADMIN_ASSIGNISSUE, data, getToken());
}
export function admin_latestIssues(data) {
    return axios.post(BASE_URL + ADMIN_LATESTISSUES, data, getToken());
}

//EMPLOYEE ISSUE SERVICE
export function emp_allIssue(data) {
    return axios.post(BASE_URL + EMP_ALLISSUE, data, getToken());
}
export function emp_updateIssue(data) {
    return axios.post(BASE_URL + EMP_UPDATEISSUE, data, getToken());
}