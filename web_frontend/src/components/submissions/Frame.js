import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import classes from "./Column.module.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import SubmissionContext from "../store/submissionContext";
import * as constant from "../constant"

const Frame = (props) => {
    const [isHovering, setIsHovering] = useState(false);
    const submissionCtx = useContext(SubmissionContext);

    const handleRemove = () => {
        submissionCtx.removeFrame(props.frame.id);
        // console.log("new")
        // console.log(submissionCtx)
    };
    return (
        <Draggable draggableId={props.frame.id} index={props.index}>
            {(provided) => (
                <div>
                    
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className={classes.frameContainer}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <img
                            className={classes.image}
                            src={`${constant.host_ip}/get_thumbnail?video=${props.frame.video}&frameid=${props.frame.frameid}`}
                        />
                        {isHovering && (
                            <button className={classes.btn} onClick={handleRemove}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                        {isHovering && <div className={classes.details}>
                            {`${props.frame.video}/${props.frame.frameid}`}
                        </div>}
                    </div>
                </div>
                
            )}
        </Draggable>
    );
};

export default Frame;
