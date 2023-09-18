import React, { useContext, useEffect, useState } from "react";
import CsvDownload from "react-csv-downloader";
import SubmissionContext from "../store/submissionContext";
import classes from "./SubmitButton.module.css";
import * as constant from "../constant";

const SubmitButton = () => {
    const submissionCtx = useContext(SubmissionContext);
    const [submissionCSV, setSubmissionCSV] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const frameIds = submissionCtx.columns["column-1"].frameIds;
        // console.log("frameIds")
        // console.log(frameIds)
        if (frameIds) {
            setSubmissionCSV(
                frameIds.map((frameId) => {
                    return {
                        video: frameId.slice(0, 8),
                        frameid: frameId.slice(9),
                    };
                }),
            );
        }
    }, [submissionCtx.columns["column-1"].frameIds]);

    console.log(submissionCSV);
    console.log('id')
    const spamSimilarityFrames = () => {
        const fetchKNN = async () => {

            setIsLoading(true)
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
                console.log(data["data"]);
                if(data) {
                    setSubmissionCSV(
                        data["data"].map((frameId) => {
                            return {
                                video: frameId.slice(0, 8),
                                frameid: frameId.slice(9),
                            };
                        }),
                    );
                }
            }
            setIsLoading(false)
        };
        fetchKNN();
    }
    // console.log("csv");
    // console.log(submissionCSV)
    const clearSubmissionsHandler = () => {
        submissionCtx.clearSubmissions();
    };
    
    const columns = [
        {id: "video", displayName: "video"},
        {id: "frameid", displayName: "frameid"},

    ]
    // console.log("submissioncsv")
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
                <button className={classes.addKNNBtn} onClick={spamSimilarityFrames}>
                    {!isLoading ? "Spam" : "Loading ..."} 
                </button>
                <CsvDownload
                    filename="submission_raw.csv"
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
