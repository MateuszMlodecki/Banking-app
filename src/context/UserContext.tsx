import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserDetails } from "../types/types";

interface UserDetailsContextType {
	userDetails: UserDetails;
	setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
}

const UserDetailsContext = createContext<UserDetailsContextType | undefined>(
	undefined
);

export const useUserDetails = () => {
	const context = useContext(UserDetailsContext);
	if (!context) {
		throw new Error("useUserDetails must be used within a UserProvider");
	}
	return context;
};

export const UserDetailsProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [userDetails, setUserDetails] = useState<UserDetails>({
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		streetName: "",
		streetNumber: "",
		flatNumber: "",
		city: "",
		bankName: "",
		accountNumber: "",
	});

	return (
		<UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
			{children}
		</UserDetailsContext.Provider>
	);
};
