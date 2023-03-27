import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Upadate from "../../../../Assets/images/update.svg";
import DownArrow from "../../../../Assets/images/UpButton.png";
import "./UpdateActtivity.css";
import ActivityPost from "../../ActivityPost";
import axios from "axios";
import * as Cookies from "js-cookie";
import { CookieConfig } from "../../../../Utils/CookieConfig";

function UpdateActtivity() {
  const [isListOpen, setisListOpen] = useState(false);
  const [listData, setListData] = useState([]);

  const toggleList = () => {
    setisListOpen(!isListOpen);
  };

  const getData = () => {
    axios
      .request({
        url: `http://dev.skopic.com:9090/skopicportal/jsonuser/getMoreActivityAnnouncements.html?breadCountLength=0`,
        method: "post",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Set-Cookie": Cookies.get("JSESSIONID"),
        },
        withCredentials: true,
      })

      .then((res) => {
        setListData(res.data.announcements);
      });
  };
  useEffect(() => getData(), []);

  const likeUnlike = (id) => {
    const newData = [...listData];
    const modifiedData = newData.find((x) => x.id === id);
    modifiedData.UserLikeStatus = "InActive";
    modifiedData.voteUp = modifiedData.voteUp - 1 + 2;
    setListData(newData);
  };

  const deleteTag = (id) => {
    const newList = [...listData];
    const index = newList.findIndex((x) => x.id === id);
    if (index > -1) {
      newList.splice(index, 1);
      setListData(newList);
    }
    let formdata = new FormData();
    formdata.append("messageID", id);
    axios
      .post(
        `http://dev.skopic.com:9090/skopicportal/jsonmessage/deleteMessageByUser.html`,
        formdata,
        CookieConfig
      )
      .then((res) => {})
      .catch((err) => {});
  };

  const updateMessage = (id, message) => {
    const newData = [...listData];
    const modifiedData = newData.find((x) => x.id === id);
    modifiedData.Message = message;
    setListData(newData);
    let formdata = new FormData();
    formdata.append("messageID", id);
    formdata.append("message", message);
    axios
      .post(
        `http://dev.skopic.com:9090/skopicportal/jsonmessage/update-message?userLoc=${""}&msgLoc=${""}&locName=${
          modifiedData.locName
        }`,
        formdata,
        CookieConfig
      )
      .then((res) => {})
      .catch((err) => {});
  };

  return (
    <>
      <div className="UpdateActtivity" onClick={toggleList}>
        <div>
          <img src={Upadate} alt="Ask-icon" className="askicon" />
          <Typography className="ask mt-3">UPDATE</Typography>
        </div>
        <div className="ActivityInfo">
          <span className="number">{listData.length}</span>
          <img src={DownArrow} alt="DownArrow" className="DownArrow" />
        </div>
      </div>
      {isListOpen && (
        <div role="list" className="posts">
          {listData && listData.length !== 0 ? (
            <ActivityPost
              listData={listData}
              updateMessage={updateMessage}
              delete={deleteTag}
              likeUnlike={likeUnlike}
            />
          ) : (
            <div></div>
          )}
        </div>
      )}
    </>
  );
}

export default UpdateActtivity;
