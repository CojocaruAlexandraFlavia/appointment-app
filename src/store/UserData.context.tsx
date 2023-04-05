import React, { createContext, useContext, useState } from "react";
import {User} from "../utils/Types";

interface UserData {
    user: User,
    setUser: Function
}

const UserDataContext = createContext<UserData>({
    user: {
        id: 0,
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        password: "" ,
        profilePicture: "",
        city: ""
    },
    setUser: () => {},
});

export const useUserDataContext = () => {
    return useContext(UserDataContext);
};

export const UserDataProvider = ({children,}: {children: React.ReactNode;}) => {
    const [user, setUser] = useState({
        id: 0,
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        password: "" ,
        profilePicture: "",
        city: ""
    });
  
    return (
        <UserDataContext.Provider value={{user, setUser}}>
            {children}
        </UserDataContext.Provider>
    );
};