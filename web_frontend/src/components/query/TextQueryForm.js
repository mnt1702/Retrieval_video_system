import React, { useContext, useState } from "react";
import NextPageContext from "../store/nextpageCtx";
import classes from "./TextQueryForm.module.css";
import * as constant from "../constant"
import { FileUploader } from "react-drag-drop-files";

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
    const [img, setImg] = useState("");
    const [imgSearch, setImgSearch] = useState(false)

    const fetch_image = async (url, method='GET', post_body={}) => {
        setIsLoadingSearch(true);
        let response = {ok: false}
        if (method == 'GET') {
          response = await fetch(
              `${constant.host_ip}/${url}`
          );
        } else if (method == 'POST') {
          response = await fetch(`${constant.host_ip}/${url}`, {
            method: method,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(post_body)
          })
        }
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
        let url = ""
        let method = "GET"
        let body = {}
        if (imgSearch) {
          url += 'search_image'
          method = "POST"
          body = {
            topk: topk,
            base64_str: img
          }
        } else {
          if (!topk)
              setTopk(100);
          url += `search?query=${query}&topk=${topk}`;
          if (ocrQuery) {
              if (!ocrthresh) setOCRthresh(0.8);
              url += `&ocrquery=${ocrQuery}&ocrthresh=${ocrthresh}`;
          }
          if (speakQuery) {
              if (!topk) setTopk(100);
              url += `&speakquery=${speakQuery}`;
          }
        }
        console.log(url, method, body)
        // await fetch_image(url);
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

    const fileChange = e => {
      const reader = new FileReader()
      reader.onloadend = function() {
        setImg(this.result);
      }
      reader.readAsDataURL(e)
    }

    const fileTypes = ['PNG', 'JPG', 'JPEG']

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

                <button id='trl_btn' className={classes.scoreBtn}>
                    {!isLoadingTranslation ? "Translate" : "Loading ..."}
                </button>
            </form>
            <form id='query-form' onSubmit={submitHandler} className={classes.form}>
                <b> <label> Search </label> </b>
                <div className={classes.query_div}>
                    <textarea
                        className={classes.inputquery}
                        onKeyDown={handleKeyDown}
                        placeholder="Query"
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                </div>
                <b> <label> Youtube caption  </label> </b>
                <div className={classes.query_div}>
                    <textarea
                        className={classes.inputquery}
                        onKeyDown={handleKeyDown}
                        placeholder="Youtube caption"
                        onChange={(e) => setSpeakQuery(e.target.value)}
                        value={speakQuery}
                    />
                </div>
                <b> <label> OCR </label> </b>
                <div className={classes.query_div}>
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
                </div>
                <div className={classes.submit_div}>
                  <div>
                    <span>
                      Top K:
                    </span>
                    <textarea
                        className={classes.inputnum}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setTopk(e.target.value)}
                        value={topk}
                    />
                  </div>
                  <button id='query-btn' className={classes.scoreBtn}> 
                      { !isLoadingSearch ? "Search" : "Loading ..."}
                  </button>
                  <div>
                    <input type="checkbox" value={imgSearch} onChange={(e) => setImgSearch(e.target.checked)}></input>
                    <label><b> Use image </b></label>
                  </div>
                </div>
                <b> <label> Image Query </label> </b>  
            </form>    
	           <form id='image-form' className={classes.form}>
                  <FileUploader handleChange={fileChange} name="file" types={fileTypes} />
              </form>
        </div>
    );
}

export default TextQueryForm;
