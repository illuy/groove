import React, { useEffect, useState } from "react";
import {
  GrooveHeaderWrap,
  GrooveHeaderFixed,
  GrooveHeaderLogo,
  GrooveHeaderIconWrap,
  GrooveHeaderIconHome,
  GrooveHeaderIconWrite,
  GrooveHeaderIconMy,
  GrooveHeaderIconSelection,
  GrooveHeaderIcons,
  TopBtn
} from "../../style/GrooveHeaderStyle";

import GrooveAuth from "./GrooveAuth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { SocialLogInNickname } from "../../style/GrooveAuthStyle";

function GrooveHeader({
  isUserLogIn,
  currentUser,
  isMyIconClicked,
  setIsMyIconClicked,
  setIsUserLogIn,
  setTotalUsersInformation,
  logInModal,
  setLogInModal,
  nickname,
  setNickname,
  nicknameModal,
  setNicknameModal,
  onNicknameChange
}) {
  const navigate = useNavigate();

  const logOut = async (event) => {
    await signOut(auth);
    setIsMyIconClicked(false);
    setIsUserLogIn(false);
    setNicknameModal(false);
    setNickname("");
  };

  const myIconClick = () => {
    setIsMyIconClicked((prevState) => !prevState);
  };

  const goMyPage = () => {
    setIsMyIconClicked(false);
    navigate("/mypage");
  };

  const goHome = () => {
    setIsMyIconClicked(false);
    navigate("/");
  };

  const goWrite = () => {
    setIsMyIconClicked(false);
    navigate("/write");
  };

  const user = currentUser;
  const nicknameModalIn = () => {
    if (!nickname) {
      return alert("빈칸을 입력해 주세요!");
    }
    setNickname(nickname);
    const newUser = {
      email: user.email,
      nickname,
      profileImage:
        "https://firebasestorage.googleapis.com/v0/b/groove-a1c3e.appspot.com/o/avatars%2F6jGLxl6CBvcl4vO5vtUvbLO2FN23_chicken.png?alt=media&token=3228961e-73b4-47e3-b371-ba9e3bf7207f"
    };
    const collectionRef = collection(db, "logInData");
    addDoc(collectionRef, newUser);
    setNicknameModal(false);
    setNickname("");
  };
  useEffect(() => {
    const fetchData = async (userEmail) => {
      const q = query(collection(db, "logInData"));
      const querySnapshot = await getDocs(q);

      const totalUsersInformation = await querySnapshot.docs.map((doc) => ({
        email: doc.data().email,
        nickname: doc.data().nickname
      }));
      setTotalUsersInformation(totalUsersInformation);
      const nowLogIn = await totalUsersInformation.find((information) => information.email === userEmail);
      if (!nowLogIn) {
        return;
      }
      const nowLogInNickname = nowLogIn.nickname;
      setNickname(nowLogInNickname);
      if (!totalUsersInformation) return;
    };

    if (user) {
      const userEmail = user.email;
      setIsUserLogIn(true);
      setLogInModal(false);
      fetchData(userEmail);
    } else {
    }
  }, [user, nickname]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShowButton = window.scrollY > 100;
      setIsVisible(shouldShowButton);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // 부드러운 스크롤 효과
    });
  };

  return (
    <>
      <GrooveHeaderWrap>
        <GrooveHeaderFixed className={scrolled ? "scrolled-header" : "normal-header"}>
          <GrooveHeaderLogo onClick={goHome}>Groove</GrooveHeaderLogo>
          <GrooveHeaderIconWrap>
            {currentUser ? (
              <GrooveHeaderIcons>
                <div>{nickname}님 환영합니다!</div>
                <GrooveHeaderIconHome onClick={goHome}>
                  <i className="fa-solid fa-house" />
                </GrooveHeaderIconHome>
                <GrooveHeaderIconWrite onClick={goWrite}>
                  <i className="fa-solid fa-pen" />
                </GrooveHeaderIconWrite>
                <GrooveHeaderIconMy onClick={myIconClick}>
                  <i className="fa-solid fa-user" />
                </GrooveHeaderIconMy>
              </GrooveHeaderIcons>
            ) : (
              <GrooveAuth
                nickname={nickname}
                setNickname={setNickname}
                currentUser={currentUser}
                isUserLogIn={isUserLogIn}
                setIsUserLogIn={setIsUserLogIn}
                isMyIconClicked={isMyIconClicked}
                setIsMyIconClicked={setIsMyIconClicked}
                setTotalUsersInformation={setTotalUsersInformation}
                logInModal={logInModal}
                setLogInModal={setLogInModal}
                nicknameModal={nicknameModal}
                setNicknameModal={setNicknameModal}
                onNicknameChange={onNicknameChange}
              />
            )}
            {isMyIconClicked && (
              <div>
                <GrooveHeaderIconSelection>
                  <button type="button" onClick={logOut}>
                    Log-out
                  </button>
                  <button type="button" onClick={goMyPage}>
                    My-page
                  </button>
                </GrooveHeaderIconSelection>
              </div>
            )}
            {nicknameModal && (
              <SocialLogInNickname>
                <input placeholder="Nickname" type="text" required value={nickname} onChange={onNicknameChange} />
                <button onClick={nicknameModalIn}>확인</button>
              </SocialLogInNickname>
            )}
          </GrooveHeaderIconWrap>
        </GrooveHeaderFixed>
      </GrooveHeaderWrap>
      {isVisible && (
        <TopBtn className="scroll-to-top" onClick={scrollToTop}>
          <i className="fa-solid fa-angles-up"></i>
        </TopBtn>
      )}
    </>
  );
}

export default GrooveHeader;
