import { FC, ReactNode, createContext, useContext, useState } from "react";

type UserContextProps = {
  username: string;
  setUsername: (value: string) => void;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState("Zbyszek");

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext musi być używane wewnątrz UserProvider");
  }
  return context;
};
