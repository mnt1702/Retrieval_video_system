import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./Image.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import SubmissionContext from "../store/submissionContext";
import NextPageContext from "../store/nextpageCtx";
import * as constant from "../constant"

const Image = ({
    video,
    frameid,
    setOpen,
    setVidID,
    setClose,
    isChosen,
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const submissionCtx = useContext(SubmissionContext);
    const nextpageCtx = useContext(NextPageContext);

    const imageRef = useRef();
    useEffect(() => {
        if (isChosen) {
            const wait = async () => {
                const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
                await sleep(2000);
                imageRef.current.scrollIntoView({ behavior: "smooth" });
            };
            wait();
        }
    }, [isChosen]);

    const handleSubmission = () => {
        submissionCtx.submitFrame(video, frameid);
    };

    return (
        <div
            className={classes.container}
            onMouseOver={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={isChosen ? { border: "solid 5px green" } : {}}
            ref={imageRef}
        >
            {isHovering && (
                <div className={classes.btns}>
                    <button
                        className={classes.btn}
                        onClick={() => {
                            setOpen(true);
                            setVidID(`${video}-${frameid}`);
                        }}
                        onMouseOver={() => setIsHovering(true)}
                    >
                        Details
                    </button>
                    <button className={classes.btn} onClick={handleSubmission}>
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                </div>
            )}
            <div className={classes.imageContainer}>
            <img
                className={classes.image}
                src={`${constant.host_ip}/get_image?video=${video}&frameid=${frameid}`}
                alt="frameid"
                />
            </div>
            {isHovering && <div className={classes.details}>
                {`${video}\\${frameid}`}
            </div>}
        </div>
    );
};

export default Image;
