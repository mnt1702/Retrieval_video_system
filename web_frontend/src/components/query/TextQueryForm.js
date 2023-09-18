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
    const [ocrthresh, setOCRthresh] = useState("");
    const [object, setObject] = useState("");
    const [objthresh, setObjthresh] = useState("");
    const nextpageCtx = useContext(NextPageContext);


    const fetch_image = async (url) => {
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
            nextpageCtx.setBefore(before);
            nextpageCtx.setAfter(after);
            nextpageCtx.setOCRQuery(ocrQuery);
            nextpageCtx.setOCRthresh(ocrthresh);
            nextpageCtx.setObject(object);
            nextpageCtx.setObjthresh(objthresh);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        let url = `search?query=${query}&topk=${topk}&before=${before}&after=${after}`
        if (ocrQuery)
            url += `&ocrquery=${ocrQuery}&ocrthresh=${ocrthresh}`
        if (object) 
            url += `&object=${object}&objectthresh=${objthresh}`
        await fetch_image(url);
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
