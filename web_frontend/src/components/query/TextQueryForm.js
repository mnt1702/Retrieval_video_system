import React, { useContext, useState } from "react";
import NextPageContext from "../store/nextpageCtx";
import classes from "./TextQueryForm.module.css";
import * as constant from "../constant"

function TextQueryForm({ setDataList }) {
    const [query, setQuery] = useState("");
    const [topk, setTopk] = useState(100);
    const [ocrQuery, setOCRQuery] = useState("");
    const [ocrthresh, setOCRthresh] = useState(0.8);
    const nextpageCtx = useContext(NextPageContext);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false); 
    const [speakQuery, setSpeakQuery] = useState("");
    const [topk_s, setTopk_s] = useState(100);

    const fetch_image = async (url) => {
        setIsLoadingSearch(true);
        const response = await fetch(
            `${constant.host_ip}/${url}`
        );
        if (response.ok) {
            const data = await response.json();
            // console.log("data")
            // console.log(data['data']);
            setDataList(data);
            nextpageCtx.setPage(1);
            nextpageCtx.setQuery(query);
            nextpageCtx.setTopk(topk);
            nextpageCtx.setOCRQuery(ocrQuery);
            nextpageCtx.setOCRthresh(ocrthresh);
            nextpageCtx.setSpeakQuery(speakQuery);
            nextpageCtx.setTopk_s(topk_s);
        }
        setIsLoadingSearch(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (topk)
            setTopk(100);
        let url = `search?query=${query}&topk=${topk}`;
        if (ocrQuery) {
            if (!ocrthresh) setOCRthresh(0.8);
            url += `&ocrquery=${ocrQuery}&ocrthresh=${ocrthresh}`;
        }
        if (speakQuery) {
            if (!topk_s) setTopk_s(100);
            url += `&speakquery=${speakQuery}&topk_s=${topk_s}`;
        }
        await fetch_image(url);
    };

    const handleKeyDown = (e) => {
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className={classes.container}>
            <form onSubmit={submitHandler} className={classes.form}>
                <b> <label> Search </label> </b>
                <div>
                    <textarea
                        className={classes.inputquery}
                        onKeyDown={handleKeyDown}
                        placeholder="Query"
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                    <textarea
                        className={classes.inputnum}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setTopk(e.target.value)}
                        value={topk}
                    />
                </div>
                <b> <label> OCR </label> </b>
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
                        onChange={(e) => setOCRthresh(e.target.value)}
                        value={ocrthresh}
                    />
                </div>
                <b> <label> Speak Query </label> </b>
                <div>
                    <textarea
                        className={classes.inputquery}
                        onKeyDown={handleKeyDown}
                        placeholder="Speak query"
                        onChange={(e) => setSpeakQuery(e.target.value)}
                        value={speakQuery}
                    />
                    <textarea
                        className={classes.inputnum}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setTopk_s(e.target.value)}
                        value={topk_s}
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
