import React, { useEffect, useState } from "react";
import classes from "./FrameDetails.module.css";
import Image from "./Image";
import * as constant from "../constant"

const FrameDetails = ({video, frameid, setVidID, onClose }) => {

    const [framesNear, setFramesNear] = useState([]);
    const [frameSimilarity, setFramesSimilarity] = useState([]);

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

    const getFramesNear = async (video, frameid) => {
        const response = await fetch(
            `${constant.host_ip}/get_near?video=${video}&frameid=${frameid}`
        );
        if (response.ok) {
            const data = await response.json();
            const data_list = data["data"];
            // console.log("data")
            // console.log(data)
            data_list.sort();
            setFramesNear(data_list);
        }
    };
    const getFramesSimilarity = async (video, frameid) => {
        const response = await fetch(
            `${constant.host_ip}/get_similarity?video=${video}&frameid=${frameid}&topk=30`
        );
        if(response.ok) {
            const data = await response.json();
            const data_list = data['data'];
            setFramesSimilarity(data_list)
        }
    };

    useEffect(() => { getFramesNear(video, frameid) }, [video, frameid]);
    useEffect(() => { getFramesSimilarity(video, frameid) }, [video, frameid]);

    return (
        <div className={classes.container}>
            <h5> {video} / {frameid} </h5>
            {video && (
                <>
                    <div className={classes.imageSection}>
                        <img
                            src={`${constant.host_ip}/get_image?video=${video}&frameid=${frameid}`}
                        />
                        {/* <h3> {data && <a href={watch_url} target="_blank">Youtube Link</a>} </h3>                      */}
                    </div>
                    <div className={classes.videoSection}>
                        <iframe src= {watch_url}> </iframe>
                    </div>
                    <div className={classes.imageNearList}>
                        {framesNear.map((item) => (
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
                    <div className={classes.frameList}>
                        {frameSimilarity.map((item) => (
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
