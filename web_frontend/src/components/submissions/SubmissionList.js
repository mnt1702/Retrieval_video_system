import React, { useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import SubmissionContext from "../store/submissionContext";
import Column from "./Column";
import classes from "./SubmissionList.module.css";

const SubmissionList = () => {
    const submissionCtx = useContext(SubmissionContext);

    // return (
    //   <div className={classes.container}>
    //     <div>
    //       <label>Video:</label>
    //       <input type="text" name='video' value= {submissionCtx.submittedFrame.video}></input>
    //     </div>
    //     <div>
    //       <label>Frame:</label>
    //       <input type="number" name="frameid" min="0" max='999999' value= {submissionCtx.submittedFrame.frame_id}></input>
    //     </div>
    //     <div>
    //       <label>Session:</label>
    //       <input type="text" name="sessionid" value= {submissionCtx.submittedFrame.session_id}></input>
    //     </div>
    //   </div>
    // );
};

export default SubmissionList;
