import {createContext} from "react";
import {User} from "@firebase/auth";

export interface UserProp {
    user?: User | null,
    username: string | null
}

export const UserContext = createContext<UserProp>({user: null, username: null})
