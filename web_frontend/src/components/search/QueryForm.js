import React, { useContext, useState } from "react";
import classes from "./QueryForm.module.css";
import SearchContext from "../context/searchStoredContext";
import * as constant from "../constant"
import { FileUploader } from "react-drag-drop-files";

function QueryForm({ setDataList }) {
    const [viQuery, setViQuery] = useState("");
    const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
    const [textQuery, setTextQuery] = useState("");
    const [ocrQuery, setOcrQuery] = useState("");
    const [asrQuery, setAsrQuery] = useState("");
    const [topK, setTopK] = useState(100);
    const [selectedImage, setSelectedImage] = useState();
    const [imgQuery, setImgQuery] = useState("");
    const [imgSearch, setImgSearch] = useState(false)
    const [isLoadingSearch, setIsLoadingSearch] = useState(false); 
    const searchCtx = useContext(SearchContext);

    const fetch_searchEngine = async (url, method='GET', post_body={}) => {
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
            const results = await response.json();
            setDataList(results);
            searchCtx.setViQuery(viQuery);
            searchCtx.setTextQuery(textQuery);
            searchCtx.setOcrQuery(ocrQuery);
            searchCtx.setAsrQuery(asrQuery);
            searchCtx.setTopK(topK);
        }
        setIsLoadingSearch(false);
    };

    const searchHandler = async (e) => {
        e.preventDefault();
        let url = ""
        let method = ""
        let body = {}
        if (imgSearch) {
            url += "searchImage"
            body = {
                'topk': topK,
                'file': imgQuery
            }
            method = "POST"
        } 
        else {
            if ( !topK ) setTopK(100);
            
            url += `search?query=${textQuery}&topk=${topK}`;
            
            if ( ocrQuery ) url += `&ocrquery=${ocrQuery}`;
            
            if ( asrQuery ) url += `&asrquery=${asrQuery}`;

            method = "GET"
        }
        await fetch_searchEngine(url, method, body);
    };

    const handleKeyDown = (e) => {
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const translateHandler = async (e) => {
        setIsLoadingTranslation(true);
        e.preventDefault()
        const response = await fetch(
            `${constant.host_ip}/translations?vi_query=${viQuery}`
        );
        if (response.ok) {
            const data = await response.json();
            setTextQuery(data["trans_en"]);
        }
        setIsLoadingTranslation(false);
    }
    
    const changeHandler = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleSubmission = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", selectedImage);
        const fetch_search_image = async () => {
            const response = await fetch(`${constant.host_ip}/search_image`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setDataList(data);
            }
        };
        fetch_search_image();
    };

    const fileChange = e => {
      const reader = new FileReader()
      reader.onloadend = function() {
        setImgQuery(this.result);
      }
      reader.readAsDataURL(e)
    }

    const fileTypes = ['PNG', 'JPG', 'JPEG']

    return (
        <div className={classes.container}>
            <form onSubmit={translateHandler} className={classes.form}>
                <b> <label>Vietnamese Query</label> </b>
                <textarea
                    id='ta-trans'
                    className={classes.inputtrans}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập câu truy vấn ..."
                    onChange={(e) => setViQuery(e.target.value)}
                    value={viQuery}
                />

                <button id='trl_btn' className={classes.translateBtn}>
                    {!isLoadingTranslation ? "Translate" : "Loading"}
                </button>
            </form>
            
            <form id='textQuery-form' onSubmit={searchHandler} className={classes.form}>
                <b> <label> Text </label> </b>
                <div className={classes.query_div}>
                    <textarea id='textQuery' 
                        className={classes.inputquery}
                        onKeyDown={handleKeyDown}
                        placeholder="Typing a text query ..."
                        onChange={(e) => setTextQuery(e.target.value)}
                        value={textQuery}
                    />
                </div>

                <b> <label> OCR </label> </b>
                <div className={classes.query_div}>
                    <textarea
                        className={classes.inputocrquery}
                        onKeyDown={handleKeyDown}
                        placeholder="OCR query"
                        onChange={(e) => setOcrQuery(e.target.value)}
                        value={ocrQuery}
                    />
                </div>

                <b> <label> ASR </label> </b>
                <div className={classes.query_div}>
                    <textarea
                        className={classes.inputocrquery}
                        onKeyDown={handleKeyDown}
                        placeholder="ASR query"
                        onChange={(e) => setAsrQuery(e.target.value)}
                        value={asrQuery}
                    />
                </div>
                
                <div className={classes.submit_div}>
                  <div>
                    <span> Top K: </span>
                    <textarea
                        className={classes.inputnum}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setTopK(e.target.value)}
                        value={topK}
                    />
                  </div>
                  
                  <button id='search-btn' className={classes.searchBtn}> 
                      { !isLoadingSearch ? "Search" : "Loading"}
                  </button>
                  
                  <div>
                    <input type="checkbox" value={imgSearch} name='imgSearchCbx' onChange={((e) => setImgSearch(e.target.checked))}></input>
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

export default QueryForm;
