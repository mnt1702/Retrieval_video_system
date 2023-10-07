import React, { useState } from "react";

const NextPageContext = React.createContext({
    page: null,
    viQuery: "",
    query: "",
    topk: 100,
    ocrQuery: "",
    asrQuery: "",
    setPage:() => {},
    setQuery:() => {},
    setViQuery: () => {},
    setTopk:() => {},
    setOcrQuery:() => {},
    setasrQuery:() => {},
})

export default NextPageContext;
export const NextPageContextProvider =  ({children}) => {
    const [page, setPage] = useState(null);
    const [query, setQuery] = useState("");
    const [viQuery, setViQuery] = useState("");
    const [topk, setTopk] = useState(100);
    const [ocrQuery, setOCRQuery] = useState("");
    const [asrQuery, setasrQuery] = useState("");

    const contextData = {
        page: page,
        setPage: setPage,
        viQuery: viQuery,
        setViQuery: setViQuery,
        query: query,
        setQuery: setQuery,
        topk: topk,
        setTopk: setTopk,
        ocrQuery: ocrQuery,
        setOCRQuery: setOCRQuery,
        asrQuery: asrQuery,
        setasrQuery: setasrQuery,
    }

    return <NextPageContext.Provider value={contextData}>
        {children}
    </NextPageContext.Provider>
}