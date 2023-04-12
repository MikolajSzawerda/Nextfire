import {FirebaseOptions, getApp, initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "@firebase/auth";
import {getFirestore} from "@firebase/firestore";
import {getStorage} from "@firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBLzlA1a2wcsgyN5qSrYnJYiLS9NHLHs8k",
    authDomain: "votingsystem-a4827.firebaseapp.com",
    databaseURL: "https://votingsystem-a4827-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "votingsystem-a4827",
    storageBucket: "votingsystem-a4827.appspot.com",
    messagingSenderId: "861447075536",
    appId: "1:861447075536:web:8f41be768c000630cfd0d5",
    measurementId: "G-1GEG9XNYD9"
};

function createFirebaseApp(config: FirebaseOptions) {
    try {
        return getApp();
    } catch {
        return initializeApp(config);
    }
}

export const app = createFirebaseApp(firebaseConfig);
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)


