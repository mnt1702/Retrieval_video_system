import React, { useState } from "react";

const NextPageContext = React.createContext({
    page: null,
    before: "",
    query: "",
    after: "",
    topk: 100,
    ocrQuery: "",
    ocrthresh: 0.8,
    object: "",
    objthresh: 0.5,
    setPage:() => {},
    setBefore:() => {},
    setQuery:() => {},
    setAfter:() => {},
    setTopk:() => {},
    setOcrQuery:() => {},
    setOcrthresh:() => {},
    setObject: () => {},
    setObjthresh: () => {}
})

export default NextPageContext;
export const NextPageContextProvider =  ({children}) => {
    const [page, setPage] = useState(null);
    const [before, setBefore] = useState("");
    const [query, setQuery] = useState("");
    const [after, setAfter] = useState("");
    const [topk, setTopk] = useState(100);
    const [ocrQuery, setOCRQuery] = useState("");
    const [ocrthresh, setOCRthresh] = useState("");
    const [object, setObject] = useState("");
    const [objthresh, setObjthresh] = useState("");

    const contextData = {
        page: page,
        setPage: setPage,
        before: before,
        setBefore: setBefore,
        query: query,
        setQuery: setQuery,
        after: after,
        setAfter: setAfter,
        topk: topk,
        setTopk: setTopk,
        ocrQuery: ocrQuery,
        setOCRQuery: setOCRQuery,
        ocrthresh: ocrthresh,
        setOCRthresh: setOCRthresh,
        object: object, 
        setObject: setObject,
        objthresh: objthresh,
        setObjthresh: setObjthresh
    }

    return <NextPageContext.Provider value={contextData}>
        {children}
    </NextPageContext.Provider>
}