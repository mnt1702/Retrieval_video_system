import React, { useEffect, useState } from "react";
import classes from "./FrameDetails.module.css";
import Image from "./Image";
import * as constant from "../constant"

const FrameDetails = ({video, frameid, setVidID, onClose }) => {

    const [allFrames, setAllFrames] = useState([]);
    let data = {};
    const [watch_url, setWatchUrl] = useState("");

    const getUrl = async (video) => {
        try {
            const response =  await fetch( 
                `${constant.host_ip}/get_metadata?video=${video}`, {
                    method: 'GET',
                    headers: {
                    accept: 'application/json',
                    },
                }
            );
            if(response.ok) {
                const url = await response.json();
                setWatchUrl(url["url"])
            }
        } 
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => { getUrl(video) }, [video]);

    // console.log("url", video)
    // console.log("link", watch_url)

    const getFrames = async (video) => {
        const response = await fetch(
            `${constant.host_ip}/get_video/${video}`
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
                            src={`${constant.host_ip}/get_image?video=${video}&frameid=${frameid}`}
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
