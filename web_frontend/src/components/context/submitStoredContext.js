import React, { useState } from "react";
import * as constant from "../constant"

const SubmitContext = React.createContext({
    sessionId: "",
    setSessionId: () => {},
    submitFrame: () => {},
});

export default SubmitContext;
export const SubmitContextProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState("")

    const submitFrame = (videoId, keyframeId) => {
      const fetchSubmitResult = async() => {
        const response = await fetch(`${constant.host_ip}/submitFrame/${videoId}/${keyframeId}?sessionId=${sessionId}`)
        if(response.ok) {
            let data = await response.json()
            alert(data)
        }
      }
      fetchSubmitResult()
    };

    const dataStored = {
        sessionId: sessionId,
        setSessionId: setSessionId,
        submitFrame: submitFrame,
    };

    return (
        <SubmitContext.Provider value={dataStored}>
            {children}
        </SubmitContext.Provider>
    );
};
