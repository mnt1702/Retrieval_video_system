import React, { useContext, useEffect, useState } from "react";
import CsvDownload from "react-csv-downloader";
import SubmissionContext from "../store/submissionContext";
import classes from "./SubmitButton.module.css";
import * as constant from "../constant";

const SubmitButton = () => {
    const submissionCtx = useContext(SubmissionContext);
    const [submissionCSV, setSubmissionCSV] = useState(null);
    const [isLoadingSpam, setIsLoadingSpam] = useState(false);
    const [isLoadingMapping, setIsLoadingMapping] = useState(false);


    useEffect(() => {
        const frameIds = submissionCtx.columns["column-1"].frameIds;
        if (frameIds) {
            setSubmissionCSV(frameIds);
        }
    }, [submissionCtx.columns["column-1"].frameIds]);


    useEffect(() => {
        const frameIds = submissionCtx.columns["column-1"].frameIds;
        // console.log("frameIds")
        // console.log(frameIds)
        if (frameIds) {
            setSubmissionCSV( frameIds );
        }
    }, [submissionCtx.columns["column-1"].frameIds]);
    // console.log("submissionCSV");
    // console.log(submissionCSV);
    // console.log('id')
    const spamSimilarityFrames = () => {
        const similarity = async () => {
            setIsLoadingSpam(true)
            const response = await fetch(
                `${constant.host_ip}/submissions`,
                {
                    method: "POST",
                    "headers": {"Content-Type": "application/json"},

                    body: JSON.stringify({
                        "data": submissionCtx.columns["column-1"].frameIds
                    })
                }
            );
            if (response.ok) {
                const data = await response.json()
                // console.log("submissions spam")
                // console.log(data["data"]);
                if(data) {
                    setSubmissionCSV( data["data"]);
                }
            }
            setIsLoadingSpam(false)
        };
        similarity();
    }
    const Mapping_index = () => {
        const mapping = async () => {
            setIsLoadingMapping(true)
            const response = await fetch(
                `${constant.host_ip}/mapping`,
                {
                    method: "POST",
                    "headers": {"Content-Type": "application/json"},

                    body: JSON.stringify({
                        "data": submissionCSV
                    })
                }
            );
            if (response.ok) {
                const data = await response.json()
                // console.log("submissions spam")
                // console.log(data["data"]);
                if(data) {
                    setSubmissionCSV( data["data"]);
                }
            }
            setIsLoadingMapping(false)
        };
        mapping();
    }
    useEffect(() => {
        const frameIds = submissionCSV;
        if (frameIds) {
            setSubmissionCSV(
                frameIds.map((frameId) => {
                    return {
                        video: frameId.slice(0, 8),
                        frame: frameId.slice(9),
                    };
                }),
            );
        }
    }, [submissionCSV]);


    // console.log("submissionCSV");
    // console.log(submissionCSV);
    // console.log("csv");
    // console.log(submissionCSV)
    const clearSubmissionsHandler = () => {
        submissionCtx.clearSubmissions();
    };
    
    const columns = [
        {id: "video", displayName: "video"},
        {id: "frameid", displayName: "frameid"},

    ]
    // console.log("submissioncsv1")
    // console.log(submissionCSV)
    return (
        
        submissionCSV && (
            <div className={classes.container}>
                <button
                    className={classes.clearBtn}
                    onClick={clearSubmissionsHandler}
                >
                    Clear
                </button>
                <button className={classes.addSpamBtn} onClick={spamSimilarityFrames}>
                    {!isLoadingSpam ? "Spam" : "Loading ..."} 
                </button>
                
                <button className={classes.addMappingBtn} onClick={Mapping_index}> 
                    {isLoadingMapping ? "Mapping" : "Loading ..."}
                </button>

                <CsvDownload
                    filename="query-p3-.csv"
                    separator=","
                    columns={columns}
                    datas={submissionCSV}
                    // wrapColumnChar = ""
                    noHeader={true}
                >
                    <button className={classes.submitBtn}>Export Submission</button>
                </CsvDownload>

            </div>
        )
    );
};

export default SubmitButton;
