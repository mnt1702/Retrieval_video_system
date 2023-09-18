import React, { useContext, useEffect } from "react";
import Image from "./Image";
import { useState } from "react";
import classes from "./ImageList.module.css";
import NextPageContext from "../store/nextpageCtx";

function ImageList({
    dataList,
    setOpen,
    setOpenedVidID,
    setDataList,
}) {
    // console.log("dataList")
    // console.log(dataList)

    const [images, setImages] = useState([]);
    // const nextpageCtx = useContext(NextPageContext);
    useEffect(() => {
        let counter = 0;

        const im = dataList["data"].map((item) => (
            <Image
                video={item.slice(0, 8)}
                frameid={item.slice(9)}
                key={`${item}${++counter}`}
                setOpen={setOpen}
                setVidID={setOpenedVidID}
            />
        ));
        setImages(im);
    }, [dataList]);

    return (
        <div className={classes.container}>
            {images}
        </div>
    );
}

export default ImageList;
