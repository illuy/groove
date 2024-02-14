import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { collection, query, where, getDocs, getFirestore, doc, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import GrooveHeader from "../components/Groove/GrooveHeader";
import GrooveFooter from "../components/Groove/GrooveFooter";
import styled from "styled-components";
import { format } from "date-fns";

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
  const [userEmail, setUserEmail] = useState("");
  const [userUid, setUserUid] = useState("");
  const [userDocId, setUserDocId] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [newNickname, setNewNickname] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [editingProfileImage, setEditingProfileImage] = useState(false); // 프로필 이미지 수정 모드 추가

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
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const db = getFirestore();
  const storageRef = ref(storage, "avatars");

  const fetchData = async (email) => {
    try {
      const q = query(collection(db, "logInData"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const nickname = userData.nickname;
        const profileImage = userData.profileImage;
        setNickname(nickname);
        setProfileImageUrl(profileImage);
        setUserDocId(doc.id);
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
        const timestampSeconds = postData.Timestamp.seconds;
        const date = new Date(timestampSeconds * 1000);
        const formattedTime = format(date, "yyyy-MM-dd HH:mm:ss");
        userPostsData.push({
          ...postData,
          id: doc.id,
          formattedTime: formattedTime,
          likesCount: Object.keys(postData.likes || {}).length
        });
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
    if (!confirmUpdate) return;

    try {
      const userDocRef = doc(db, "logInData", userDocId);
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  const confirmProfileImageChange = async () => {
    if (avatarFile) {
      const storageRefChild = ref(storageRef, `${currentUser.uid}_${avatarFile.name}`);
      try {
        await uploadBytes(storageRefChild, avatarFile);
        const url = await getDownloadURL(storageRefChild);
        await updateProfileImage(url);
        setEditingProfileImage(false);
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const updateProfileImage = async (url) => {
    try {
      const userDocRef = doc(db, "logInData", userDocId);
      await updateDoc(userDocRef, {
        profileImage: url
      });
      setProfileImageUrl(url);
    } catch (error) {
      console.error("Error updating profile image URL:", error);
    }
  };

  const cancelProfileImageChange = () => {
    setEditingProfileImage(false);
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

      <StDivWrap>
        {currentUser ? (
          <StDiv>
            <StUserContainer>
              <StInfo>사용자 정보:</StInfo>
              <section>
                {profileImageUrl && <img src={profileImageUrl} alt="프로필 사진" />}
                {/* 프로필 이미지 수정 버튼 및 업로드 input */}
                {!editingNickname && (
                  <EditProfileImage>
                    <button onClick={() => setEditingProfileImage(true)}>프로필 이미지 수정</button>
                  </EditProfileImage>
                )}
              </section>
              {editingProfileImage && (
                <EditProfileImageChange>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} />
                  <button onClick={confirmProfileImageChange}>확인</button>
                  <button onClick={cancelProfileImageChange}>취소</button>
                </EditProfileImageChange>
              )}

              {editingNickname ? (
                <div>
                  <StNicknameEdit>
                    닉네임 :
                    <StInput type="text" value={newNickname} onChange={(e) => setNewNickname(e.target.value)} />
                    <button onClick={handleNicknameChange}>변경</button>
                    <button onClick={() => setEditingNickname(false)}>취소</button>
                  </StNicknameEdit>
                </div>
              ) : (
                <StNickname>
                  닉네임: {nickname} <StEditbtn onClick={() => setEditingNickname(true)}>변경</StEditbtn>
                </StNickname>
              )}
              <p>이메일 주소: {userEmail}</p>
            </StUserContainer>
            <p>작성한 글 목록:</p>
            {userPosts.length > 0 ? (
              <StUl>
                {userPosts.map((post, index) => (
                  <li key={index}>
                    <StPostLink
                      to={{
                        pathname: `/detail/${post.id}`
                      }}
                      state={userPosts}
                    >
                      <StPostContainer>
                        <div>
                          <StTitle>{post.title}</StTitle>
                          <StContent>{post.body}</StContent>
                          <div>
                            <p>{post.formattedTime}</p>
                            <p>
                              <i className="fa-solid fa-heart" /> {Object.keys(post.likes || {}).length}개
                            </p>
                          </div>
                        </div>
                        <StImageWrapper>
                          <StImage src={post.imageUrl} alt="업로드된 이미지" />
                        </StImageWrapper>
                      </StPostContainer>
                    </StPostLink>
                  </li>
                ))}
              </StUl>
            ) : (
              <p>작성한 글이 없습니다.</p>
            )}
          </StDiv>
        ) : (
          <StyledMessage>
            <p>로그인이 필요합니다.</p>
          </StyledMessage>
        )}
      </StDivWrap>
      <StGrooveFooter />
    </div>
  );
}

const StDivWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem;
`;
const StDiv = styled.div`
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
`;

const StUserContainer = styled.div`
  width: 400px;
  margin: 1rem;
  line-height: 1.5;
  & > p {
    border-bottom: 1px solid #ffc41d;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  & > section {
    position: relative;
    text-align: center;
  }
  & > section > img {
    max-width: 400px;
  }
`;
const EditProfileImage = styled.div`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  & > button {
    font-size: 1rem;
    border: 1px solid #ffc41d;
    background-color: #ffc41daa;
    font-weight: 500;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #ffc41d;
      color: #212121;
    }
  }
`;
const EditProfileImageChange = styled.div`
  display: flex;
  margin-bottom: 1rem;

  & > input[type="file"] {
    margin-right: auto;
    &::file-selector-button {
      border-radius: 5px;
      border: none;
      padding: 5px 10px;
      margin-left: 0.5rem;
      font-size: 0.8rem;
      cursor: pointer;
      background-color: #eeeeee66;
    }
    &::file-selector-button:hover {
      background-color: #eeeeeeee;
    }
  }
  & > button {
    border-radius: 5px;
    border: none;
    padding: 5px 10px;
    margin-left: 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
  }
  & > button:nth-of-type(1) {
    background-color: rgba(65, 105, 225, 0.5);
    color: #eee;
  }
  & > button:nth-of-type(2) {
    background-color: rgba(255, 99, 71, 0.5);
    color: #eee;
  }
  & > button:hover:nth-of-type(1) {
    background-color: rgba(65, 105, 225, 1);
    color: #eee;
  }
  & > button:hover:nth-of-type(2) {
    background-color: rgba(255, 99, 71, 1);
    color: #eee;
  }
`;

const StInfo = styled.p`
  display: flex;
  text-align: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
`;

const StNickname = styled.p`
  justify-content: space-between;
  display: flex;
  align-items: center;
`;
const StNicknameEdit = styled.p`
  display: flex;
  margin: 1rem 0;
  & > button {
    border-radius: 5px;
    border: none;
    padding: 5px 10px;
    margin-left: 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
  }
  & > button:nth-of-type(1) {
    background-color: rgba(65, 105, 225, 0.5);
    color: #eee;
  }
  & > button:nth-of-type(2) {
    background-color: rgba(255, 99, 71, 0.5);
    color: #eee;
  }
  & > button:hover:nth-of-type(1) {
    background-color: rgba(65, 105, 225, 1);
    color: #eee;
  }
  & > button:hover:nth-of-type(2) {
    background-color: rgba(255, 99, 71, 1);
    color: #eee;
  }
`;

const StyledMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 25px;
  color: #ffff;
`;

const StUl = styled.ul`
  margin-top: 20px;
  width: 1280px;
`;

const StInput = styled.input`
  margin-left: 5px;
  border-color: #ffc41d;
  background-color: transparent;
  border-radius: 5px;
  margin-right: auto;
  color: #eee;
`;

const StEditbtn = styled.button`
  background-color: transparent;
  border: none;
  color: #ffc41d;
  cursor: pointer;
  &:hover {
    filter: brightness(70%);
  }
  margin-left: auto;
`;

const StPostLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ffff;
  border-bottom: 2px solid #ffc41d;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const StImage = styled.img`
  height: 100%;
  object-fit: cover;
`;

const StTitle = styled.p`
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: bold;
`;

const StImageWrapper = styled.article`
  width: 200px;
  height: 200px;
  overflow: hidden;
  margin-left: 20px;
  & > img {
    width: 100%;
  }
`;

const StPostContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  & > div {
    width: calc(100% - 220px);
    display: flex;
    flex-direction: column;
    height: 200px;
  }
  & > div > div {
    margin-top: auto;
  }
  & > div > div > p:nth-of-type(1) {
    margin-bottom: 0.5rem;
    font-size: 14px;
    font-weight: 200;
    color: #ccc;
  }
`;

const StContent = styled.p`
  font-size: 16px;
  margin-bottom: 1rem;
`;

const StGrooveFooter = styled(GrooveFooter)`
  margin-top: auto;
`;

export default MyPage;
