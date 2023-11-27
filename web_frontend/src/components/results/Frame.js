import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./Frame.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import SubmitContext from "../context/submitStoredContext";
import * as constant from "../constant"

const Frame = ({videoId, keyframeId,
                setOpen, setClose,
                setVidID, isChosen, }) => {

    const [isHovering, setIsHovering] = useState(false);
    const submitCtx = useContext(SubmitContext);

    const imageRef = useRef();
    useEffect(() => {
        if (isChosen) {
            const wait = async () => {
                const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
                await sleep(2000);
            };
            wait();
        }
    }, [isChosen]);

    const submitHandler = () => {
        submitCtx.submitFrame(videoId, keyframeId);
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
                    <button className={classes.btn} onClick={submitHandler}>
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                </div>
            )}
            <div className={classes.imageContainer}
                onMouseOver={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={isChosen ? { border: "solid 2px red" } : {}}
                ref={imageRef}
            >
            <img
                className={classes.image}
                src={`${constant.host_ip}/image/${videoId}/${keyframeId}`}
                alt="keyframeId"
                onClick={() => {
                    setOpen(true);
                    setVidID(`${videoId}/${keyframeId}`);
                }}
                />
            </div>
            {isHovering && <div className={classes.details}>
                {`${videoId}/${keyframeId}`}
            </div>}
        </div>
    );
};

export default Frame;
