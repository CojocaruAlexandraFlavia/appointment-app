import { createContext, useContext, useState } from "react";

interface LoginData {
  email: string;
  password: string;
  setLoginData: Function;
}

const LoginFormContext = createContext<LoginData>({
  email: "",
  password: "",
  setLoginData: () => {},
});

export const useLoginFormContext = () => {
  return useContext(LoginFormContext);
};

export const LoginFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [{ email, password }, setLoginData] = useState({
    email: "",
    password: "",
  });

  return (
    <LoginFormContext.Provider
      value={{
        email,
        password,
        setLoginData,
      }}
    >
      {children}
    </LoginFormContext.Provider>
  );
};
