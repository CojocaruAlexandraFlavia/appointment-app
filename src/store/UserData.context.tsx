import React, { createContext, useContext, useState } from "react";
import {User} from "../utils/types";

interface UserData {
    user: User,
    setUser: Function
}

const UserDataContext = createContext<UserData>({
    user: {
        id: "0",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        profilePicture: "",
        city: "",
        username: ""
    },
    setUser: () => {},
});

export const useUserDataContext = () => {
    return useContext(UserDataContext);
};

export const UserDataProvider = ({children,}: {children: React.ReactNode;}) => {
    const [user, setUser] = useState({
        id: "0",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        profilePicture: "",
        city: "",
        username: ""
    });
  
    return (
        <UserDataContext.Provider value={{user, setUser}}>
            {children}
        </UserDataContext.Provider>
    );
};