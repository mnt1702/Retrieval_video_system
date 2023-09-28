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
                `${constant.host_ip}/get_metadata?video=${video}&frameid=${frameid}`, {
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
    

    // console.log("url", video)
    // console.log("link", watch_url)

    const getFramesNear = async (video, frameid) => {
        const response = await fetch(
            `${constant.host_ip}/get_near?video=${video}&frameid=${frameid}`
        );
        console.log(response);
        console.log(`${constant.host_ip}/get_near?video=${video}&frameid=${frameid}`)
        if (response.ok) {
            const data = await response.json();
            const data_list = data["data"];
            console.log(data_list);
            setFramesNear(data_list);
        }
    };
    const getFramesSimilarity = async (video, frameid) => {
        const response = await fetch(
            `${constant.host_ip}/get_similarity?video=${video}&frameid=${frameid}&topk=35`
        );
        console.log(`${constant.host_ip}/get_similarity?video=${video}&frameid=${frameid}&topk=100`)
        console.log(response);
        
        if(response.ok) {
            const data = await response.json();
            const data_list = data['data'];
            console.log(data_list);
            setFramesSimilarity(data_list)
        }
    };

    useEffect( () => {
        if(video && frameid) {
            getUrl(video);
            getFramesNear(video, frameid);
            getFramesSimilarity(video, frameid);
        }
    }, [video, frameid]);

    return (
        <div id='main-container'>
        <h5> {video} / {frameid} </h5>
        <div className={classes.container}>
            {video && (
                <>
                    <div className={classes.imageSection}>
                        <img
                            src={`${constant.host_ip}/get_thumbnail?video=${video}&frameid=${frameid}&width=${700}&height=${394}`}
                        />
                        <div className={classes.videoSection}>
                            <iframe src= {watch_url}> </iframe>
                        </div>
                        {/* <h3> {data && <a href={watch_url} target="_blank">Youtube Link</a>} </h3>                      */}
                    </div>
                    <div className={classes.imageNearCont}>
                        <h4> Nearby frames </h4>
                        <div className={classes.imageNearList}>
                            {framesNear.map((item) => (
                                <Image 
                                    video={item.slice(0, 8)}
                                    frameid={item.slice(9)}
                                    setVidID={setVidID}
                                    setOpen={() => {}}
                                    setClose={onClose}
                                    isChosen={
                                        item === `${video}_${frameid}` ? true : false
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h4>Similar frames</h4>
                        <div className={classes.frameList}>
                            {frameSimilarity.map((item) => (
                                <Image
                                    video={item.slice(0, 8)}
                                    frameid={item.slice(9)}
                                    setVidID={setVidID}
                                    setOpen={() => {}}
                                    setClose={onClose}
                                    isChosen={
                                        item === `${video}_${frameid}` ? true : false
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div></div>
    );
};

export default FrameDetails;
