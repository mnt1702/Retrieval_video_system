import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "rsuite";
import SubmitContext from "../context/submitStoredContext";
import Infos from "./Infos"

const PageDetails = ({open, setOpen, info, setVidID}) => {
    const submitCtx = useContext(SubmitContext)
    const [videoId, setVideoId] = useState("");
    const [keyframeId, setFrame] = useState("");
    const handleClose = () => setOpen(false)

    useEffect(() => {
        setVideoId(info.split('/')[0]);
        setFrame(info.split('/')[1]);
    }, [info]);
    
    const submitHandler = () => {
        submitCtx.submitFrame(videoId, keyframeId);
    };

    return (
        <Modal open={open} onClose={handleClose} backdrop="true" size="full" >
            <Modal.Header>
                <Button name='submitBtn' appearance="primary" onClick={submitHandler}>
                    Submit
                </Button>

            </Modal.Header>
            <Modal.Body>
                
                <Infos videoId={videoId} keyframeId={keyframeId} setVidID={setVidID} onClose={handleClose}/>
                
            </Modal.Body>
        </Modal>
    );
};

export default PageDetails;
