import React, { useEffect, useState } from "react";
import classes from "./Infos.module.css";
import Frame from "./Frame"
import * as constant from "../constant"

const Infos = ({videoId, keyframeId, setVidID, onClose }) => {

    const [nearbyFrames, setNearbyFrames] = useState([]);
    const [similarFrames, setSimilarFrames] = useState([]);

    const [url, setUrl] = useState("");

    const getUrl = async (videoId) => {
        const response =  await fetch( 
            `${constant.host_ip}/metadata/${videoId}/${keyframeId}`
        );

        if(response.ok) {
            const mapping = await response.json();
            setUrl(mapping["url"])
        }
    }
    
    const getNearbyFrames = async (videoId, keyframeId) => {
        const response = await fetch(
            `${constant.host_ip}/nearbyFrames/${videoId}/${keyframeId}`
        );
        if (response.ok) {
            const data = await response.json();
            setNearbyFrames(data["results"]);
        }
    };
    const getSimilarFrames = async (videoId, keyframeId) => {
        const response = await fetch(
            `${constant.host_ip}/similarFrames/${videoId}/${keyframeId}?topk=49`
        );

        if(response.ok) {
            const data = await response.json();
            setSimilarFrames(data["results"])
        }
    };

    useEffect( () => {
        if(videoId && keyframeId) {
            getUrl(videoId);
            getNearbyFrames(videoId, keyframeId);
            getSimilarFrames(videoId, keyframeId);
        }
    }, [videoId, keyframeId]);
    return (
        <div id='main-container'>
        <h5> {videoId} / {keyframeId} </h5>
        <div className={classes.container}>
            {videoId && (
                <>
                    <div className={classes.imageSection}>
                        <img
                            src={`${constant.host_ip}/image/${videoId}/${keyframeId}`}
                            alt= 'Keyframe'
                        />

                        <div className={classes.videoSection}>
                            <iframe src= {url} title="Video"> </iframe>
                        </div>
                    </div>

                    <div className={classes.imageNearCont}>
                        <h4> Nearby frames </h4>
                        <div id='img_near' className={classes.nearbyFramesList}>
                            {nearbyFrames.map((item) => (
                                <Frame
                                    videoId={item.split('/')[0]}
                                    keyframeId={item.split('/')[1]}
                                    setOpen={() => {}}
                                    setClose={onClose}
                                    setVidID={setVidID}
                                    isChosen={
                                        item === `${videoId}/${keyframeId}` ? true : false
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{textAlign: "center"}}>
                        <h4>Similar frames</h4>
                        <div className={classes.similarFrames}>
                            {similarFrames.map((item) => (
                                <Frame
                                    videoId={item.split('/')[0]}
                                    keyframeId={item.split('/')[1]}
                                    setOpen={() => {}}
                                    setClose={onClose}
                                    setVidID={setVidID}
                                    isChosen={
                                        item === `${videoId}/${keyframeId}` ? true : false
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

export default Infos;
