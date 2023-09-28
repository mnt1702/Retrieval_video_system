import React, { useState } from "react";

const NextPageContext = React.createContext({
    page: null,
    viQuery: "",
    query: "",
    topk: 100,
    ocrQuery: "",
    ocrthresh: 0.8,
    speakQuery: "",
    topk_s: 100,
    setPage:() => {},
    setQuery:() => {},
    setViQuery: () => {},
    setTopk:() => {},
    setOcrQuery:() => {},
    setOcrthresh:() => {},
    setSpeakQuery:() => {},
    setTopk_s:() => {}
})

export default NextPageContext;
export const NextPageContextProvider =  ({children}) => {
    const [page, setPage] = useState(null);
    const [query, setQuery] = useState("");
    const [viQuery, setViQuery] = useState("");
    const [topk, setTopk] = useState(100);
    const [ocrQuery, setOCRQuery] = useState("");
    const [ocrthresh, setOCRthresh] = useState("");
    const [speakQuery, setSpeakQuery] = useState("");
    const [topk_s, setTopk_s] = useState(100);

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
        ocrthresh: ocrthresh,
        setOCRthresh: setOCRthresh,
        speakQuery: speakQuery,
        setSpeakQuery: setSpeakQuery,
        topk_s: topk_s,
        setTopk_s: setTopk_s
    }

    return <NextPageContext.Provider value={contextData}>
        {children}
    </NextPageContext.Provider>
}