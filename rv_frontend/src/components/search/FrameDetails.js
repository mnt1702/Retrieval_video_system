import React, { useEffect, useState } from "react";
import classes from "./FrameDetails.module.css";
import Image from "./Image";
import host_ip from "../constant"

const FrameDetails = ({video, frameid, setVidID, onClose }) => {

    const [allFrames, setAllFrames] = useState([]);
    let data = {};
    const [watch_url, setWatchUrl] = useState("");

    const fetch_url = async (video) => {
        const response = await fetch(
            `${host_ip}/${url}`
        );
        
        data = await fetch(`${host_ip}/get_metadata/${video}`);
        setWatchUrl(data["url"]);
    }
    fetch_url(video);

    console.log("url", video)
    console.log(data)
    const getFrames = async (video) => {
        const response = await fetch(
            `${host_ip}/get_video/${video}`
        );
        if (response.ok) {
            const data = await response.json();
            const data_list = data["data"];
            // console.log("data")
            // console.log(data)
            data_list.sort();
            setAllFrames(data_list);
        }
    };

    useEffect(() => { getFrames(video) }, [video]);
    return (
        <div className={classes.container}>
            {video && (
                <>
                    <div className={classes.imageSection}>
                        <img
                            src={`${host_ip}/get_image?video=${video}&frameid=${frameid}`}
                        />
                        <h3> {video} / {frameid} </h3>
                        <h3> {data && <a href={watch_url} target="_blank">Youtube Link</a>} </h3>                     
                    </div>
                    <div className={classes.frameList}>
                        {allFrames.map((item) => (
                            <Image
                                video={item.slice(0, 8)}
                                frameid={item.slice(9)}
                                setVidID={setVidID}
                                setOpen={() => {}}
                                setClose={onClose}
                                isChosen={
                                    item === `${video}-${frameid}` ? true : false
                                }
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FrameDetails;
