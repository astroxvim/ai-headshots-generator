"use client";

import { useState, createContext, useContext, useEffect } from "react";

export interface AuthContextProps {
  isPaid: boolean;
  currentID: string;
  trainedImages: [];
  setCurrentID: ({ currentID } : { currentID: string}) => void;
  setPaid: ({ paid }: { paid: boolean }) => void;
  setTrainedImages: ([]) => void;
}

const StoreContext = createContext<AuthContextProps>(null);

const StoreProvider = ({children}) => {
    const [isPaid, setIsPaid] = useState(false);
    const [currentID, setId] = useState("");
    const [trainedImages, setTrainImages] = useState<[]>([]);

    useEffect(() => {
        if(localStorage.getItem('currentID')) setId(localStorage.getItem('currentID'));
    }, [])

    const setPaid = ({paid}: {paid: boolean}) => {
        setIsPaid(paid);
    }

    const setCurrentID = ({ currentID }: { currentID: string }) => {
        setId(currentID);
        localStorage.setItem('currentID', currentID);
    }

    const setTrainedImages = (trainedImages: []) => {  // Change [] to any[] or a more specific type
        if (trainedImages.length > 0) {  // Check if the array has elements
            setTrainImages(prevImages => [...prevImages, ...trainedImages]);
        } else {
            setTrainImages([]);
        }
    };

    return (
        <StoreContext.Provider value={{ isPaid, setPaid, currentID, setCurrentID, trainedImages, setTrainedImages }}>
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
