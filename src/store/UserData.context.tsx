import { createContext, useContext, useState } from "react";

type User = {
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
    role: string,
    password: string 
}

interface UserData {
    user: User,
    setUser: Function
}

const UserDataContext = createContext<UserData>({
    user: {
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        password: "" 
    },
    setUser: () => {},
});

export const useUserDataContext = () => {
    return useContext(UserDataContext);
};

export const UserDataProvider = ({children,}: {children: React.ReactNode;}) => {
    const [user, setUser] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        password: "" 
    });
  
    return (
        <UserDataContext.Provider value={{user, setUser}}>
            {children}
        </UserDataContext.Provider>
    );
};