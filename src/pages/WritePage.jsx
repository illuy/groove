import { FileBox, Form, Input } from "../style/GrooveWriteStyle";
import { Body, EditingButtonWrap, Title } from "../style/GrooveDetailStyle";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import GrooveHeader from "../components/Groove/GrooveHeader";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import defaultImage from "../assets/defaultImage.jpg";

function WritePage({
  currentUser,
  isUserLogIn,
  setIsUserLogIn,
  isMyIconClicked,
  setIsMyIconClicked,
  setTotalUsersInformation,
  logInModal,
  setLogInModal,
  nickname,
  setNickname
}) {
  const focusRef = useRef();
  const navigate = useNavigate();
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [GrooveTop, setGrooveTop] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  console.log("writecurrentuser", currentUser);

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     return;
  //   } else {
  //     alert("로그인이 필요합니다");
  //     navigate("/");
  //   }
  // }, []);

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(currentUser);
  useEffect(() => {
    if (isLoggedIn) {
      return;
    } else {
      alert("로그인이 필요합니다");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    focusRef.current.focus();
  }, []);

  const onChangeTitle = (event) => {
    event.preventDefault();
    const {
      target: { name, value }
    } = event;
    if (name === "titleText") {
      setTitleText(value);
    }
  };

  const onChangeBody = (event) => {
    const {
      target: { name, value }
    } = event;
    if (name === "bodyText") {
      setBodyText(value);
    }
  };

  const addTodo = async (event) => {
    event.preventDefault();
    // Firestore에서 'grooveTop' 컬렉션에 대한 참조 생성하기
    const newGroove = {
      body: bodyText,
      title: titleText,
      Timestamp: new Date(),
      isLiked: false,
      likeCount: 0,
      imageUrl: selectedFile ? imageUrl : "",
      authorId: currentUser.uid,
      email: currentUser.email
    };
    if (titleText.trim().length === 0 || bodyText.trim().length === 0) {
      alert("제목과 내용은 필수 입력입니다");
      return;
    }
    // const newTodo = { text: text, isDone: false };
    const collectionRef = collection(db, "GrooveTop");
    // 여기서 id는  firebase database -> grooveTop컬렉션의 문서값
    const { id } = await addDoc(collectionRef, newGroove);
    setGrooveTop((prev) => {
      // 'GrooveTop' 컬렉션에 newTodo 문서를 추가합니다.
      return [...GrooveTop, { ...newGroove, id }];
    });
    alert("글 작성이 완료됐습니다.");
    navigate("/");
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(event.target.files[0]);
    // ref 함수를 이용해서 Storage 내부 저장할 위치를 지정하고, uploadBytes 함수를 이용해서 파일을 저장합니다.
    // const imageRef = ref(storage, `${auth.currentUser.uid}/${selectedFile.name}`);
    const imageRef = ref(storage, `${auth.uid}/${file.name}`);
    await uploadBytes(imageRef, file);
    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(imageRef);
    setImageUrl(downloadURL);
  };

  return (
    <>
      <GrooveHeader
        currentUser={currentUser}
        isUserLogIn={isUserLogIn}
        setIsUserLogIn={setIsUserLogIn}
        isMyIconClicked={isMyIconClicked}
        setIsMyIconClicked={setIsMyIconClicked}
        setTotalUsersInformation={setTotalUsersInformation}
        logInModal={logInModal}
        setLogInModal={setLogInModal}
        nickname={nickname}
        setNickname={setNickname}
      />
      <Form>
        {imageUrl ? (
          <img style={{ width: "400px", marginBottom: "12px" }} src={imageUrl} alt="Groove Image"></img>
        ) : (
          <img style={{ width: "400px", marginBottom: "12px" }} src={defaultImage} alt="기본 이미지"></img>
        )}
        {/* <label for="file">
          <div class="btn-upload">파일 업로드하기</div>
        </label> */}
        <FileBox>
          <label for="ex_file">이미지 업로드</label>
          <Input type="file" id="ex_file" onChange={handleFileSelect} />
        </FileBox>
        {/* <input type="file" display="none" name="file" id="file" onChange={handleFileSelect} /> */}
        <Title>
          제목:
          <input
            type="text"
            value={titleText}
            name="titleText"
            onChange={onChangeTitle}
            ref={focusRef}
            required
          ></input>
        </Title>
        <Body>
          내용:<input type="text" value={bodyText} name="bodyText" onChange={onChangeBody} required></input>
        </Body>
        <EditingButtonWrap>
          <button onClick={addTodo}>추가</button>
          <button onClick={() => navigate("/")}>취소</button>
        </EditingButtonWrap>
      </Form>
    </>
  );
}

export default WritePage;
