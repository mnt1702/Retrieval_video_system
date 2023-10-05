import React, { useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import SubmissionContext from "../store/submissionContext";
import Column from "./Column";
import classes from "./SubmissionList.module.css";

const SubmissionList = () => {
    const submissionCtx = useContext(SubmissionContext);

    // // console.log(submissionCtx.submittedFrames, "IN SUBMISSION LIST");
    // const onDragEnd = (result) => {
    //     const { destination, source, draggableId } = result;

    //     if (!destination) {
    //         return;
    //     }
    //     if (
    //         destination.droppableId === source.droppableId &&
    //         destination.index === source.index
    //     ) {
    //         return;
    //     }

    //     const column = submissionCtx.columns[source.droppableId];
    //     const newFrameIds = Array.from(column.frameIds);
    //     newFrameIds.splice(source.index, 1);
    //     newFrameIds.splice(destination.index, 0, draggableId);
    //     // console.log(newFrameIds);
    //     submissionCtx.updateFramesId(newFrameIds)
    // };

        // <DragDropContext onDragEnd={onDragEnd}>
        //     {submissionCtx.columnsOrder.map((columnId) => {
        //         const column = submissionCtx.columns[columnId];
        //         const frames = column.frameIds.map(
        //             (frameid) => submissionCtx.submittedFrames[frameid]
        //         );
        //         // console.log(frames);
        //         return (
        //             <Column
        //                 key={column.id}
        //                 column={column}
        //                 frames={frames}
        //             />
        //         );
        //     })}
        // </DragDropContext>
    return (
      <div className={classes.container}>
        <div>
          <label>Video:</label>
          <input type="text" name='video' value= {submissionCtx.submittedFrame.video}></input>
        </div>
        <div>
          <label>Frame:</label>
          <input type="number" name="frameid" min="0" max='999999' value= {submissionCtx.submittedFrame.frame_id}></input>
        </div>
        <div>
          <label>Session:</label>
          <input type="text" name="sessionid" value= {submissionCtx.submittedFrame.session_id}></input>
        </div>
      </div>
    );
};

export default SubmissionList;
