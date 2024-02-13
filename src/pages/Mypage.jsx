import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, getFirestore, doc, updateDoc } from "firebase/firestore";
import GrooveHeader from "../components/Groove/GrooveHeader";
import GrooveFooter from "../components/Groove/GrooveFooter";
import styled from "styled-components";

function MyPage({
  currentUser,
  setCurrentUser,
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
  // const [currentUser, setCurrentUser] = useState(null);
  // const [userNickname, setUserNickname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userUid, setUserUid] = useState("");
  const [userDocId, setUserDocId] = useState(""); // 사용자 문서의 ID 추가
  const [userPosts, setUserPosts] = useState([]);
  const [newNickname, setNewNickname] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserEmail(user.email);
        setUserUid(user.uid);
        fetchData(user.email);
        fetchUserPosts(user.uid);
      } else {
        setCurrentUser(null);
        setNickname("");
        setUserEmail("");
        setUserUid("");
        setUserDocId("");
        setUserPosts([]);
        setProfileImage("");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const db = getFirestore();
  const fetchData = async (email) => {
    try {
      const q = query(collection(db, "logInData"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const nickname = userData.nickname;
<<<<<<< HEAD
        const profileImage = userData.profileImage; // 프로필 이미지 가져오기
        setUserNickname(nickname);
=======
        setNickname(nickname);
>>>>>>> a7e7ba0b6af6b98acf6d6cd7e6d94375f533e41a
        setUserDocId(doc.id); // 사용자 문서의 ID 저장
        setProfileImage(profileImage); // 프로필 이미지 설정
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchUserPosts = async (uid) => {
    try {
      const q = query(collection(db, "GrooveTop"), where("authorId", "==", uid));
      const querySnapshot = await getDocs(q);
      const userPostsData = [];
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        userPostsData.push({ ...postData, id: doc.id }); // 글의 id를 추가하여 저장
      });
      setUserPosts(userPostsData);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const handleNicknameChange = async () => {
    if (newNickname.trim() === "") {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const confirmUpdate = window.confirm("정말 변경 하시겠습니까?");
    if (!confirmUpdate) return; // 사용자가 취소를 누른 경우 함수 종료

    try {
      const userDocRef = doc(db, "logInData", userDocId); // 사용자 문서의 ID 사용
      await updateDoc(userDocRef, {
        nickname: newNickname.trim()
      });
      setNickname(newNickname.trim());
      setEditingNickname(false);
      setNewNickname("");
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  };

  return (
    <div>
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
      <StDiv>
        {currentUser ? (
          <StDiv>
            <div>
              <p>사용자 정보:</p>
              <div>
              <Avatar src={profileImage} alt="프로필 이미지" /> 
              {editingNickname ? (
                <div>
                  <input type="text" value={newNickname} onChange={(e) => setNewNickname(e.target.value)} />
                  <button onClick={handleNicknameChange}>변경</button>
                  <button onClick={() => setEditingNickname(false)}>취소</button>
                </div>
              ) : (
                <p>
                  Nickname: {nickname} <button onClick={() => setEditingNickname(true)}>닉네임 변경</button>
                </p>
              )}
              </div>
              <p>Email: {userEmail}</p>
              <p>작성한 글 목록:</p>
              {userPosts.length > 0 ? (
                <ul>
                  {userPosts.map((post, index) => (
                    <li key={index}>
                      {/* 각 글을 클릭하면 detail 페이지로 이동 */}
                      <Link
                        key={post.id}
                        to={{
                          pathname: `/detail/${post.id}`
                        }}
                        state={userPosts}
                        setUserPosts={setUserPosts}
                      >
                        <img src={post.imageUrl} alt="업로드된 이미지" />
                        <p>{post.title}</p>
                        <p>{post.body}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>작성한 글이 없습니다.</p>
              )}
            </div>
          </StDiv>
        ) : (
          <StyledMessage>
            <p>로그인이 필요합니다.</p>
          </StyledMessage>
        )}
      </StDiv>
      <GrooveFooter />
    </div>
  );
}

const StDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 25px;
  color: #ffff;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

export default MyPage;
