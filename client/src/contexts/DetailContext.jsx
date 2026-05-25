import { createContext, useContext } from "react";

export const DetailContext = createContext({})

export const useDetail = () => {
    return useContext(DetailContext)
}