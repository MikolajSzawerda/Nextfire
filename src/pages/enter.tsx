import {auth, googleAuthProvider} from "../../lib/firebase";
import {signInWithPopup, signOut} from "@firebase/auth";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {UserContext, UserProp} from "../../lib/context";
import {doc, getDoc, getFirestore, writeBatch} from "@firebase/firestore";
import debounce from 'lodash.debounce';

export default function EnterPage({}) {
    const {user, username} = useContext(UserContext)
    console.log(user)
    console.log(username)
    return <>
        <main>
            {user ?
                !username ? <UsernameForm/>: <SignOutButton/>
                :
                <SignInButton/>
            }

        </main>
    </>
}

function SignInButton() {
    const signInWithGoolge = async () => {
        await signInWithPopup(auth, googleAuthProvider)
    }

    return <button className="btn-google" onClick={signInWithGoolge}>
        <img src={'/google.png'} width="30px" alt=""/> Sign in with Google
    </button>
}

function SignOutButton() {
    return <button onClick={() => signOut(auth)}>Sign out</button>
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)
    const { user, username } = useContext(UserContext);
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const userDoc = doc(getFirestore(), 'users', user!.uid)
        const usernameDoc = doc(getFirestore(), 'usernames', formValue)

        const batch = writeBatch(getFirestore());
        batch.set(userDoc, { username: formValue, photoURL: user!.photoURL, displayName: user!.displayName });
        batch.set(usernameDoc, { uid: user!.uid });
        await batch.commit()
    }


    const checkUserName = useCallback(debounce(async (username: string) => {
        if (username.length >= 3) {
            const ref = doc(getFirestore(), 'usernames', username)
            const snap = await getDoc(ref)
            console.log("Fire store read executed", snap.exists())
            setIsValid(!snap.exists())
            setLoading(false)
        }
    }, 500), [])

    useEffect(() => {
        checkUserName(formValue)
    }, [formValue])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase()
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val)
            setLoading(false)
            setIsValid(false)
        }

        if (re.test(val)) {
            setFormValue(val)
            setLoading(true)
            setIsValid(false)
        }
    }

    return <>
        {!username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={onChange}/>
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading}/>
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br/>
                        Loading: {loading.toString()}
                        <br/>
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )}

    </>
}

interface FormProp {
    username: string | null
    isValid: boolean
    loading: boolean
}

function UsernameMessage({ username, isValid, loading }: FormProp) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
}