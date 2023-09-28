import React, { useState, useEffect } from "react";
import { Modal, Button } from "rsuite";
import FrameDetails from "./FrameDetails";

const VideoModal = ({open, setOpen, video_id, setVidID}) => {

    const handleClose = () => setOpen(false)
    const [video, setVideo] = useState("");
    const [frameid, setFrame] = useState("");
    useEffect(() => {
        setVideo(video_id.slice(0, 8));
        setFrame(video_id.slice(9));
    }, [video_id]);
    return (
        <Modal open={open} onClose={handleClose} backdrop="true" size="full" >
            <Modal.Body>
                
                <FrameDetails video={video} frameid={frameid} setVidID={setVidID} onClose={handleClose}/>
                
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} appearance="primary">
                    Ok
                </Button>

            </Modal.Footer>
        </Modal>
    );
};

export default VideoModal;
