import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from "../../components/Navbar";
import {Toaster} from "react-hot-toast";
import {UserContext} from "../../lib/context";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "../../lib/firebase";
import {useEffect, useState} from "react";
import {doc, getFirestore, onSnapshot} from "@firebase/firestore";
import {useUserData} from "../../lib/hooks";

export default function App({ Component, pageProps }: AppProps) {
  const userData = useUserData()

  return <>
    <UserContext.Provider value={userData}>
      <Navbar/>
      <Component {...pageProps} />
      <Toaster/>
    </UserContext.Provider>

  </>

}
