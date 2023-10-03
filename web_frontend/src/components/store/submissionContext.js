import React, { useEffect, useState } from "react";

const SubmissionContext = React.createContext({
    submittedFrames: {},
    columns: {},
    submittedFrame: {},
    columnsOrder: [],
    submitFrame: () => {},
    removeFrame: () => {},
    updateFramesId: () => {},
    clearSubmissions: () => {},
    setSession: () => {}
});

export default SubmissionContext;
export const SubmissionProvider = ({ children }) => {
    const [submittedFrames, setSubmittedFrames] = useState(() =>
        localStorage.getItem("submittedFrames")
            ? JSON.parse(localStorage.getItem("submittedFrames"))
            : {}
    );
    const [columns, setColumns] = useState(() =>
        localStorage.getItem("columns")
            ? JSON.parse(localStorage.getItem("columns"))
            : {
                  "column-1": {
                      id: "column-1",
                      title: "Submissions",
                      frameIds: [],
                  },
              }
    );
    const [columnsOrder, setColumnsOrder] = useState(["column-1"]);
    const [submittedFrame, setSubmittedFrame] = useState({
      video: "",
      frame_id: "",
      session_id: ""
    })

    const submitFrame = (video, frameid) => {
      setSubmittedFrame({
        video: video,
        frame_id: frameid,
        session_id: submittedFrame.session_id
      })
    };

    const setSession = session => {
      setSubmittedFrame({
        video: submittedFrame.video,
        frame_id: submittedFrame.frame_id,
        session_id: session
      })
    }

    const deleteFrame = (frameId) => {
        setSubmittedFrames((submittedFrames) => {
            let newSubmittedFrames = submittedFrames;
            delete newSubmittedFrames[frameId];
            localStorage.setItem(
                "submittedFrames",
                JSON.stringify(newSubmittedFrames)
            );
            // console.log("r")
            // console.log(newSubmittedFrames)
            return newSubmittedFrames;
        });

        setColumns((columns) => {
            const columnFrameIds = Array.from(columns["column-1"].frameIds);
            const index = columnFrameIds.indexOf(frameId);

            // console.log(index, "INDEX");
            if (index > -1) {
                columnFrameIds.splice(index, 1);
            }

            // console.log(columns);

            const newColumns = {
                ["column-1"]: {
                    ...columns["column-1"],
                    frameIds: columnFrameIds,
                },
            };
            localStorage.setItem("columns", JSON.stringify(newColumns));
            return newColumns;
        });
    };

    const clearSubmissions = () => {
        const frameIds = columns["column-1"].frameIds;

        frameIds.forEach((frameId) => {
            deleteFrame(frameId);
        });
    };

    const updateSubmittedFramesId = (newFrameIds) => {
        setColumns((columns) => {
            // console.log(newFrameIds);
            const newColumn = {
                ...columns["column-1"],
                frameIds: newFrameIds,
            };
            const newColumns = {
                ...columns,
                "column-1": newColumn,
            };
            // console.log(newColumns);
            localStorage.setItem("columns", JSON.stringify(newColumns));
            return newColumns;
        });
    };

    const contextData = {
        submittedFrames: submittedFrames,
        columns: columns,
        submittedFrame: submittedFrame,
        columnsOrder: columnsOrder,
        submitFrame: submitFrame,
        removeFrame: deleteFrame,
        updateFramesId: updateSubmittedFramesId,
        clearSubmissions: clearSubmissions,
        setSession: setSession
    };

    return (
        <SubmissionContext.Provider value={contextData}>
            {children}
        </SubmissionContext.Provider>
    );
};
