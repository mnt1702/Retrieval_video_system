import React, { useContext } from "react";
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


function App() {
    const [dataList, setDataList] = useState({ data: [] });
    const [openModal, setOpenModal] = useState(false);
    const [openedVidID, setOpenedVidID] = useState("");
    const nextpageCtx = useContext(NextPageContext);


    return (
        <div className={classes.container}>
            <div id='search' className={classes.search_space}>
                <TextQueryForm setDataList={setDataList} />
		<span id='note'>Press Tab to focus on the result</span>
            </div><div className={classes.result_space}>
                <ImageList
                    dataList={dataList}
                    setDataList={setDataList}
                    setOpen={setOpenModal}
                    setOpenedVidID={setOpenedVidID}
                />
            </div><div id='submission' className={classes.submission_space}>
                <SubmissionList />
                <SubmitButton />
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
