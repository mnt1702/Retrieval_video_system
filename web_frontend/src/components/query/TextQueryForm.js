import React, { useContext, useState } from "react";
import NextPageContext from "../store/nextpageCtx";
import classes from "./TextQueryForm.module.css";
import * as constant from "../constant"
import CanvasDraw from "react-canvas-draw";

function TextQueryForm({ setDataList }) {
    const [query, setQuery] = useState("");
    const [topk, setTopk] = useState(100);
    const [ocrQuery, setOCRQuery] = useState("");
    const [ocrthresh, setOCRthresh] = useState(0.8);
    const [topk_o, setTopk_o] = useState("100");
    const nextpageCtx = useContext(NextPageContext);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false); 
    const [speakQuery, setSpeakQuery] = useState("");
    const [topk_s, setTopk_s] = useState("100");
    const [viQuery, setViQuery] = useState("");
    const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
    const [selectedImage, setSelectedImage] = useState();
    const [isLoadingSearchImg, setIsLoadingSearchImg] = useState(false);

    const fetch_image = async (url) => {
        setIsLoadingSearch(true);
        const response = await fetch(
            `${constant.host_ip}/${url}`
        );
        if (response.ok) {
            const data = await response.json();
            setDataList(data);
            nextpageCtx.setPage(1);
            nextpageCtx.setViQuery(viQuery);
            nextpageCtx.setQuery(query);
            nextpageCtx.setTopk(topk);
            nextpageCtx.setOCRQuery(ocrQuery);
            nextpageCtx.setOCRthresh(ocrthresh);
            nextpageCtx.setTopk_o(topk_o)
            nextpageCtx.setSpeakQuery(speakQuery);
            nextpageCtx.setTopk_s(topk_s);
        }
        setIsLoadingSearch(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!topk)
            setTopk(100);
        let url = `search?query=${query}&topk=${topk}`;
        if (ocrQuery) {
            if (!ocrthresh) setOCRthresh(0.8);
            if (!topk_o) setTopk_o(100);
            url += `&ocrquery=${ocrQuery}&ocrthresh=${ocrthresh}&topk_o=${topk_o}`;
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

    const submitTranslateHandler = async (e) => {
        setIsLoadingTranslation(true);
        e.preventDefault()
        const response = await fetch(
            `${constant.host_ip}/translations?vi_query=${viQuery}`
        );
        if (response.ok) {
            const data = await response.json();
            setQuery(data["trans_en"]);
        }
        setIsLoadingTranslation(false);
    }
    
    const changeHandler = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleSubmission = (event) => {
        event.preventDefault();
        const formData = new FormData();
        console.log(formData)
        formData.append("file", selectedImage);
        const fetch_search_image = async () => {
            setIsLoadingSearchImg(true);
            const response = await fetch(`${constant.host_ip}/search_images`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setDataList(data);
            }
            setIsLoadingSearchImg(false);
        };
        fetch_search_image();
    };

    return (
        <div className={classes.container}>
            <form onSubmit={submitTranslateHandler} className={classes.form}>
                <b> <label>Vietnamese Query</label> </b>
                <textarea
                    id='ta-trans'
                    className={classes.inputtrans}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập câu truy vấn ..."
                    onChange={(e) => setViQuery(e.target.value)}
                    value={viQuery}
                />

                <button id='trl-btn' className={classes.scoreBtn}>
                    {!isLoadingTranslation ? "Translate" : "Loading ..."}
                </button>
            </form>
            <form id='query-form' onSubmit={submitHandler} className={classes.form}>
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
                <b> <label> OCR </label> </b>
                <div>
                    <textarea
                        className={classes.inputocrquery}
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
                    <textarea
                        className={classes.inputnum}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setTopk_o(e.target.value)}
                        value={topk_o}
                    />
                </div>
                <button id='query-btn' className={classes.scoreBtn}> 
                    { !isLoadingSearch ? "Search" : "Loading ..."}
                </button>

            </form>
            <form className={classes.form}>
                <b> <label> Search Image </label> </b>
                <div className={classes.img_form_opt}>
                  <input
                      type="file"
                      name="file"
                      onChange={changeHandler}
                      accept="image/*"
                      className={classes.fileinput}
                  />
                </div>
                {console.log("ss")}
                {console.log(selectedImage)}
                {selectedImage && <img style={{ width: 300, height: 169, marginBottom: 15}} src={URL.createObjectURL(selectedImage)}/>}
                <button className={classes.scoreBtn} onClick={handleSubmission}>
                    Search
                </button>
            </form>    
        </div>
    );
}

export default TextQueryForm;
