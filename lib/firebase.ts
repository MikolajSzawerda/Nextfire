import {FirebaseOptions, getApp, initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "@firebase/auth";
import {
    collection, DocumentData, DocumentSnapshot,
    getDocs,
    getFirestore,
    limit,
    query, QueryDocumentSnapshot,
    where
} from "@firebase/firestore";
import {getStorage} from "@firebase/storage";
import {Post} from "../components/PostFeed";

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
export const googleAuthProvider = new GoogleAuthProvider()

export async function getUserWithUsername(username: string) {
    const q = query(
        collection(firestore, 'users'),
        where('username', '==', username),
        limit(1)
    )
    return (await getDocs(q)).docs[0]
}

export function postToJSON(doc: QueryDocumentSnapshot<DocumentData>|DocumentSnapshot<DocumentData>) {
    const data = doc.data()

    return {
        ...data,
        createdAt: data?.createdAt.toMillis(),
        updatedAt: data?.updatedAt.toMillis()
    }

}

