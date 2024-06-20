"use client";

import { useState, createContext, useContext } from "react";

export interface AuthContextProps {
  isPaid: boolean;
  currentID: string;
  setCurrentID: ({ currentID } : { currentID: string}) => void;
  setPaid: ({ paid }: { paid: boolean }) => void;
}

const StoreContext = createContext<AuthContextProps>(null);

const StoreProvider = ({children}) => {
    const [isPaid, setIsPaid] = useState(false);
    const [currentID, setId] = useState("");

    const setPaid = ({paid}: {paid: boolean}) => {
        setIsPaid(paid);
    }

    const setCurrentID = ({ currentID }: { currentID: string }) => {
        setId(currentID);
    }

    return (
        <StoreContext.Provider value={{ isPaid, setPaid, currentID, setCurrentID }}>
            {children}
        </StoreContext.Provider>
    )
}

const useStore = () => {
    const context = useContext(StoreContext);
    if(context === undefined) {
        throw new Error('useStore must be within a Store Provider');
    }
    return context;
}

export { StoreProvider, useStore };
