import React, { useContext, useState } from "react";
import NextPageContext from "../store/nextpageCtx";
import classes from "./TextQueryForm.module.css";
import host_ip from "../constant"

function TextQueryForm({ setDataList }) {
    const [before, setBefore] = useState("");
    const [query, setQuery] = useState("");
    const [after, setAfter] = useState("");
    const [topk, setTopk] = useState("");
    const [ocrQuery, setOCRQuery] = useState("");
    const [ocrthresh, setOCRthresh] = useState("");
    const [object, setObject] = useState("");
    const [objthresh, setObjthresh] = useState("");
    const nextpageCtx = useContext(NextPageContext);


    const fetch_image = async (url) => {
        const response = await fetch(
            `${host_ip}/${url}`
        );
        if (response.ok) {
            const data = await response.json();
            setDataList(data);
            nextpageCtx.setPage(1);
            nextpageCtx.setQuery(query);
            nextpageCtx.setTopk(topk);
            nextpageCtx.setBefore(before);
            nextpageCtx.setAfter(after);
            nextpageCtx.setOCRQuery(ocrQuery);
            nextpageCtx.setOCRthresh(ocrthresh);
            nextpageCtx.setObject(object);
            nextpageCtx.setObjthresh(objthresh);
        }
    };
    // console.log(`search?query=${query}&topk=${topk}&before=${before}&after=${after}&ocrquery=${ocrQuery}`)

    const submitHandler = async (e) => {
        e.preventDefault();
        if(!ocrthresh) setOCRthresh(0.8);
        if(!objthresh) setObjthresh(0.5);
        await fetch_image(`search?query=${query}&topk=${topk}&before=${before}&after=${after}&ocrquery=${ocrQuery}&ocrthresh=${ocrthresh}&object=${object}&objectthresh=${objthresh}`);
    };

    const handleKeyDown = (e) => {
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className={classes.container}>
            <form onSubmit={submitHandler} className={classes.form}>
                {/* <b> <label>Frame Before</label> </b> */}
                <textarea
                    className={classes.input}
                    onKeyDown={handleKeyDown}
                    placeholder="Frame Before"
                    onChange={(e) => setBefore(e.target.value)}
                    value={before}
                />
                {/* <b> <label>Main Frame</label> </b> */}
                <textarea
                    className={classes.input}
                    onKeyDown={handleKeyDown}
                    placeholder="Main Frame"
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                />
                {/* <b> <label>Frame After</label> </b> */}
                <textarea
                    className={classes.input}
                    onKeyDown={handleKeyDown}
                    placeholder= "Frame After"
                    onChange={(e) => setAfter(e.target.value)}
                    value={after}
                />
                {/* <b> <label>Topk</label> </b> */}
                <bi><textarea
                    className={classes.input}
                    onKeyDown={handleKeyDown}
                    placeholder="Top K"
                    onChange={(e) => setTopk(e.target.value)}
                    value={topk}
                /></bi>
                <textarea
                    className={classes.input}
                    onKeyDown={handleKeyDown}
                    placeholder="OCR Query"
                    onChange={(e) => setOCRQuery(e.target.value)}
                    value={ocrQuery}
                />
                <bi><textarea
                    className={classes.input}
                    onKeyDown={handleKeyDown}
                    placeholder="OCR threshold"
                    onChange={(e) => setOCRthresh(e.target.value)}
                    value={ocrthresh}
                /></bi>
                <textarea
                    className={classes.input}
                    onKeyDown={handleKeyDown}
                    placeholder="Class Name"
                    onChange={(e) => setObject(e.target.value)}
                    value={object}
                />
                <bi><textarea
                    className={classes.input}
                    onKeyDown={handleKeyDown}
                    placeholder="Detection threshold"
                    onChange={(e) => setObjthresh(e.target.value)}
                    value={objthresh}
                /></bi>
                <button className={classes.scoreBtn}>Search</button>
            </form>
        </div>
    );
}

export default TextQueryForm;
