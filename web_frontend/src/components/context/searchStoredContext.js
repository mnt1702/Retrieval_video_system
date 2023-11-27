import React, { useState } from "react";

const SearchContext = React.createContext({
    viQuery: "",
    textquery: "",
    ocrQuery: "",
    asrQuery: "",
    topK: 100,
    setViQuery: () => {},
    setTextQuery:() => {},
    setOcrQuery:() => {},
    setAsrQuery:() => {},
    setTopK:() => {}
})

export default SearchContext;
export const SearchContextProvider =  ({children}) => {
    const [viQuery, setViQuery] = useState("");
    const [textQuery, setTextQuery] = useState("");
    const [ocrQuery, setOcrQuery] = useState("");
    const [asrQuery, setAsrQuery] = useState("");
    const [topK, setTopK] = useState(100);

    const dataStored = {
        viQuery: viQuery,
        textQuery: textQuery,
        ocrQuery: ocrQuery,
        asrQuery: asrQuery,
        topK: topK,
        setViQuery: setViQuery,
        setTextQuery: setTextQuery,
        setOcrQuery: setOcrQuery,
        setAsrQuery: setAsrQuery,        
        setTopK: setTopK
    }

    return <SearchContext.Provider value={dataStored}>
        {children}
    </SearchContext.Provider>
}