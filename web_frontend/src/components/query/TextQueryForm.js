import React, { useContext, useState } from "react";
import NextPageContext from "../store/nextpageCtx";
import classes from "./TextQueryForm.module.css";
import * as constant from "../constant"

function TextQueryForm({ setDataList }) {
    const [before, setBefore] = useState("");
    const [query, setQuery] = useState("");
    const [after, setAfter] = useState("");
    const [topk, setTopk] = useState(100);
    const [ocrQuery, setOCRQuery] = useState("");
    const [ocrthresh, setOCRthresh] = useState(0.8);
    const [object, setObject] = useState("");
    const [objthresh, setObjthresh] = useState("");
    const nextpageCtx = useContext(NextPageContext);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false); 


    const fetch_image = async (url) => {
        setIsLoadingSearch(true);
        const response = await fetch(
            `${constant.host_ip}/${url}`
        );
        // console.log(`${constant.host_ip}/${url}`)
        if (response.ok) {
            const data = await response.json();
            // console.log(data);
            setDataList(data);
            nextpageCtx.setPage(1);
            nextpageCtx.setQuery(query);
            nextpageCtx.setTopk(topk);
            nextpageCtx.setOCRQuery(ocrQuery);
            nextpageCtx.setOCRthresh(ocrthresh);
        }
        setIsLoadingSearch(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        let url = `search?query=${query}&topk=${topk}&before=${before}&after=${after}`;
        if (ocrQuery)
            if (!ocrthresh) setOCRthresh(0.8);
            url += `&ocrquery=${ocrQuery}&ocrthresh=${ocrthresh}`;
        await fetch_image(url);
    };

    const handleKeyDown = (e) => {
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className={classes.container}>
            <form onSubmit={submitHandler} className={classes.form}>
                <div>
                    <textarea
                        className={classes.inputquery}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your query ..."
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                    <textarea
                        className={classes.inputnum}
                        onKeyDown={handleKeyDown}
                        placeholder="Top K"
                        onChange={(e) => setTopk(e.target.value)}
                        value={topk}
                    />
                </div>
                <div>
                    <textarea
                        className={classes.inputquery}
                        onKeyDown={handleKeyDown}
                        placeholder="OCR Query"
                        onChange={(e) => setOCRQuery(e.target.value)}
                        value={ocrQuery}
                    />
                    <textarea
                        className={classes.inputnum}
                        onKeyDown={handleKeyDown}
                        placeholder="OCR threshold"
                        onChange={(e) => setOCRthresh(e.target.value)}
                        value={ocrthresh}
                    />
                </div>
                <button className={classes.scoreBtn}> 
                    { !isLoadingSearch ? "Search" : "Loading ..."}
                </button>
            </form>
        </div>
    );
}

export default TextQueryForm;
