import React, { useContext, useEffect } from "react";
import TextQueryForm from "./components/query/TextQueryForm";
import classes from "./App.module.css";
import Logo from "./components/query/Logo";
import ImageList from "./components/search/ImageList";
import { useState } from "react";
import VideoModal from "./components/search/VideoModal";
import "../node_modules/rsuite/dist/rsuite.min.css";
import SubmissionList from "./components/submissions/SubmissionList";
import SubmitButton from "./components/submissions/SubmitButton";
import NextPageContext from "./components/store/nextpageCtx";
import SubmissionContext from "./components/store/submissionContext";
import * as constant from "./components/constant"


function App() {
    const [dataList, setDataList] = useState({ data: [] });
    const [openModal, setOpenModal] = useState(false);
    const [openedVidID, setOpenedVidID] = useState("");
    const nextpageCtx = useContext(NextPageContext);
    const submitCtx = useContext(SubmissionContext)

    const  fetchSession = async () => {
        console.log(`${constant.host_ip}/get_sessionId`)
        const response = await fetch(`${constant.host_ip}/get_sessionId`)
        if(response.ok) {
            let data = await response.json()
            submitCtx.setSession(data.session_id)
            console.log(data.session_id)
        }
    }
    useEffect(() => {
        if (submitCtx.submittedFrame.session_id == "")
            fetchSession()
    })


    return (
        <div className={classes.container}>
            <div id='search' className={classes.search_space}>
                <TextQueryForm setDataList={setDataList} />
		<span id='note'>Press Tab to focus on the result</span>
            </div>
            <div id='submission'>
              <div className={classes.result_space}>
                  <ImageList
                      dataList={dataList}
                      setDataList={setDataList}
                      setOpen={setOpenModal}
                      setOpenedVidID={setOpenedVidID}
                  />
              </div>
            </div>
            <VideoModal
                open={openModal}
                setOpen={setOpenModal}
                video_id={openedVidID}
                setVidID={setOpenedVidID}
            />
        </div>
    );
}

export default App;
