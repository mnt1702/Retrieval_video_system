import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../node_modules/rsuite/dist/rsuite.min.css";

import classes from "./App.module.css";
import QueryForm from "./components/search/QueryForm"
import FramesList from "./components/results/FramesList";
import PageDetails from "./components/results/pageDetails";
import SubmitContext from "./components/context/submitStoredContext";

import * as constant from "./components/constant"


function App() {
    const [dataList, setDataList] = useState({ results: [] });
    const [openPage, setOpenPage] = useState(false);
    const [openedVidID, setOpenedVidID] = useState("");
    const submitCtx = useContext(SubmitContext)

    const  fetchSessionId = async () => {
        const response = await fetch(`${constant.host_ip}/sessionId`)
        if(response.ok) {
            let data = await response.json()
            submitCtx.setSessionId(data["sessionId"])
        }
    }

    useEffect(() => {
        if (submitCtx.sessionId == "")
            fetchSessionId()
    })


    return (
        <div className={classes.container}>
            <div id='search' className={classes.search_space}>
                <QueryForm setDataList={setDataList} />
            </div>
            <div id='submission'>
              <div className={classes.result_space}>
                  <FramesList
                      dataList={dataList}
                      setDataList={setDataList}
                      setOpen={setOpenPage}
                      setOpenedVidID={setOpenedVidID}
                  />
              </div>
            </div>
            <PageDetails
                open={openPage}
                setOpen={setOpenPage}
                info={openedVidID}
                setVidID={setOpenedVidID}
            />
        </div>
    );
}

export default App;
