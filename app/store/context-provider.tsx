import { useState, useEffect, createContext, useContext } from "react";

export interface AuthContextProps {
  isPaid: boolean;
  setPaid: ({ paid }: { paid: boolean }) => void;
}

const StoreContext = createContext<AuthContextProps>(null);

const StoreProvider = ({children}) => {
    const [isPaid, setIsPaid] = useState(false);

    const setPaid = ({paid}: {paid: boolean}) => {
        setIsPaid(paid);
    }
    return (
        <StoreContext.Provider value={{ isPaid, setPaid}}>
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
