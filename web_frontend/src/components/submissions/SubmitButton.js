import React, { useContext, useEffect, useRef, useState } from "react";
import CsvDownload from "react-csv-downloader";
import SubmissionContext from "../store/submissionContext";
import classes from "./SubmitButton.module.css";
import * as constant from "../constant";
import { CSVLink } from 'react-csv';

function SubmitButton() {
    const submissionCtx = useContext(SubmissionContext);
    const [submissionCSV, setSubmissionCSV] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    window.submissionCtx = submissionCtx

    useEffect(() => {
        const frameIds = submissionCtx.columns["column-1"].frameIds;
        if (frameIds) {
            setSubmissionCSV(frameIds);
        }
    }, [submissionCtx.columns["column-1"].frameIds]);

    const exportSubmission = () => {
        console.log(`${constant.host_ip}/submissions_b1`)
        const similarity = async () => {
            setIsLoading(true);
            const response = await fetch(
                `${constant.host_ip}/submissions_b1`,
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

    const submission = () => {
        const fetch_submit = async () => {
            setIsLoading(true);
            let video = submissionCtx.submittedFrame.video
            let frame_id = submissionCtx.submittedFrame.frame_id
            let session_id = submissionCtx.submittedFrame.session_id

            const response = await fetch(`${constant.host_ip}/submission_final?video=${video}&frameid=${frame_id}&session_id=${session_id}`);
            if (response.ok) {
                const data = await response.json()
                window.alert(data)
                console.log(data)
            }
            setIsLoading(false);
        };
        fetch_submit();
    }

    const clearSubmissionsHandler = () => {
        submissionCtx.clearSubmissions();
        setSubmissionCSV(submissionCtx.columns["column-1"].frameIds)
    };
    
    const columns = [
        {id: "video", displayName: "video"},
        {id: "frameid", displayName: "frameid"},

    ]

    return (
        (
            <div className={classes.container}>
                <button className={classes.submitBtn} >Submit</button>
            </div>
        )
    );
};

export default SubmitButton;
