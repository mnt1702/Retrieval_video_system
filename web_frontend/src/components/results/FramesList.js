import React, { useEffect } from "react";
import { useState } from "react";
import Frame from "./Frame";
import classes from "./FramesList.module.css";

function FramesList({dataList, setDataList,
                    setOpen, setOpenedVidID,}) {

    const [frames, setFrames] = useState([]);
    useEffect(() => {
        let counter = 0;
        const im = dataList["results"].map((item) => (
            <Frame
                videoId={item.split('/')[0]}
                keyframeId={item.split('/')[1]}
                key={`${item}${++counter}`}
                setOpen={setOpen}
                setVidID={setOpenedVidID}
            />
        ));
        setFrames(im);
    }, [dataList]);

    return (
        <div className={classes.container}>
            {frames}
        </div>
    );
}

export default FramesList;
