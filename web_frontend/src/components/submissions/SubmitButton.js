import React, { useContext, useEffect, useState } from "react";
import CsvDownload from "react-csv-downloader";
import SubmissionContext from "../store/submissionContext";
import classes from "./SubmitButton.module.css";
import * as constant from "../constant";

const SubmitButton = () => {
    const submissionCtx = useContext(SubmissionContext);
    const [submissionCSV, setSubmissionCSV] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingmap, setIsLoadingmap] = useState(false);

    useEffect(() => {
        const frameIds = submissionCtx.columns["column-1"].frameIds;
        if (frameIds) {
            setSubmissionCSV(frameIds);
        }
    }, [submissionCtx.columns["column-1"].frameIds]);

    console.log(submissionCSV);
    
    const Mapping_idx = () => {
        const mapping = async () => {
            setIsLoadingmap(true);
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
            console.log(response);
            if (response.ok) {
                const data = await response.json()
                console.log(data['data'])
                if(data) {
                    const res_ids = data["data"];
                    setSubmissionCSV(
                        res_ids
                    );
                }
            }
            setIsLoadingmap(false);

        };
        mapping();
    }

    const exportSubmission = () => {
        const similarity = async () => {
            setIsLoading(true);
            const response = await fetch(
                `${constant.host_ip}/submissions`,
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

                if(data) {
                    const res_ids = data["data"];
                    setSubmissionCSV(
                        res_ids.map((id) => {
                            return {
                                video: id.slice(0, 8),
                                frameid: id.slice(9),
                            };
                        }),
                    );
                }
            }
            setIsLoading(false);
        };
        similarity();
    }

    const clearSubmissionsHandler = () => {
        submissionCtx.clearSubmissions();
    };
    
    const columns = [
        {id: "video", displayName: "video"},
        {id: "frameid", displayName: "frameid"},

    ]
    console.log("submissioncsv1")
    console.log(submissionCSV)
    return (
        
        submissionCSV && (
            <div className={classes.container}>
                <button
                    className={classes.clearBtn}
                    onClick={clearSubmissionsHandler}
                >
                    Clear
                </button>
                <button className={classes.addMappingBtn} onClick={Mapping_idx}>
                    { !isLoadingmap ? "Map" : "Loading" }
                </button>

                <button className={classes.addMappingBtn} onClick={exportSubmission}>
                    { !isLoading ? "Spam" : "Loading" }
                </button>
                
                <CsvDownload
                    filename="query-p3-.csv"
                    separator=","
                    columns={columns}
                    datas={submissionCSV}
                    noHeader={true}
                >
                    <button className={classes.submitBtn} >Export Submission</button>
                </CsvDownload>

            </div>
        )
    );
};

export default SubmitButton;
