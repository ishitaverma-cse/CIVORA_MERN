import { initializeApp } from "firebase/app";

import {
    getAuth,
    GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCeHpHTfX1jL7BW_cKyu0gY6IFEg-OB_ww",
    authDomain: "civora-78e11.firebaseapp.com",
    projectId: "civora-78e11",
    storageBucket: "civora-78e11.firebasestorage.app",
    messagingSenderId: "281418376091",
    appId: "1:281418376091:web:806d7f172351403c4fb73e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();