import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "rsuite";
import FrameDetails from "./FrameDetails";
import * as constant from "../constant"
import SubmissionContext from "../store/submissionContext";

const VideoModal = ({open, setOpen, video_id, setVidID}) => {
    const submitCtx = useContext(SubmissionContext)
    const handleClose = () => setOpen(false)
    const [video, setVideo] = useState("");
    const [frameid, setFrame] = useState("");
    useEffect(() => {
        setVideo(video_id.slice(0, 8));
        setFrame(video_id.slice(9));
    }, [video_id]);

    const submitFrame = () => {
        const fetch_submission = async() => {
          const response = await fetch(`${constant.host_ip}/submission_final?video=${video}&frame_id=${frameid}&session_id=${submitCtx.submittedFrame.session_id}`)
          if(response.ok) {
              let data = await response.json()
              alert(data)
          }
        }
        fetch_submission()
      };

    return (
        <Modal open={open} onClose={handleClose} backdrop="true" size="full" >
            <Modal.Header>
                <Button name='submitBtn' appearance="primary" onClick={submitFrame}>
                    Submit
                </Button>

            </Modal.Header>
            <Modal.Body>
                
                <FrameDetails video={video} frameid={frameid} setVidID={setVidID} onClose={handleClose}/>
                
            </Modal.Body>
        </Modal>
    );
};

export default VideoModal;
