// groove-3e149.firebaseapp.com
import React, { useEffect, useState } from "react";
import {
  OverlayForm,
  LogInForm,
  LogSigninButton,
  TopText,
  IDPWBoxWrap,
  IDPWBox,
  LogInButtonsBox,
  LogInSmallButton,
  PromptLogIn,
  GoogleGitLogIn,
  SocialLogInNickname,
  BackgroundLogInButton
} from "../../style/GrooveAuthStyle";

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, addDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";

function GrooveAuth({
  currentUser,
  isUserLogIn,
  setIsUserLogIn,
  setLogInModal,
  logInModal,
  setTotalUsersInformation,
  nickname,
  setNickname
}) {
  const [signUpModal, setSignUpModal] = useState(false);
  const [socialLogInModal, setSocialLogInModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const onNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const openLogInModal = () => {
    setLogInModal(true);
  };

  const closeLogInModal = () => {
    setLogInModal(false);
  };

  const openSignUpModal = () => {
    setSignUpModal(true);
  };
  const closeSignUpModal = () => {
    setSignUpModal(false);
  };

  const openSocialLogInModal = () => {
    setSocialLogInModal(true);
  };
  const closeSocialLogInModal = () => {
    setSocialLogInModal(false);
  };

  const closeLogInSignUpModal = () => {
    setSignUpModal(false);
    setLogInModal(false);
  };

  const Login = async (event) => {
    try {
      if (!email || !password) {
        return alert("빈칸을 입력하세요");
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      closeLogInModal();
      setIsUserLogIn(true);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errorCode", errorCode);
      console.log("errorMessage", errorMessage);

      alert("오류가 발생했습니다.");
    } finally {
      setEmail("");
      setNickname("");
      setPassword("");
    }
  };

  const logOut = async (event) => {
    setIsUserLogIn(false);
    await signOut(auth);
  };

  const signUp = async (event) => {
    event.preventDefault();
    try {
      if (!email || !password || !nickname) {
        return alert("빈칸을 입력하세요");
      }

      if (password.length < 7) {
        return alert("비밀번호는 여섯글자 이상이어야 합니다.");
      }

      const nowUserData = onAuthStateChanged(auth, (user) => {
        if (user) return;
      });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = {
        email: email,
        nickname: nickname,
        profileImage:
          "https://firebasestorage.googleapis.com/v0/b/groove-a1c3e.appspot.com/o/avatars%2F6jGLxl6CBvcl4vO5vtUvbLO2FN23_chicken.png?alt=media&token=3228961e-73b4-47e3-b371-ba9e3bf7207f"
      }; // 기본 프로필 이미지 URL 추가
      const collectionRef = collection(db, "logInData");
      await addDoc(collectionRef, newUser);
      closeSignUpModal();
      setIsUserLogIn(true);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode, errorMessage);
      setIsUserLogIn(false);
    } finally {
      setEmail("");
      setNickname("");
      setPassword("");
    }
  };

  const user = currentUser;
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
      if (!totalUsersInformation) return;
    };

    if (user) {
      const userEmail = user.email;
      setIsUserLogIn(true);
      setLogInModal(false);
      fetchData(userEmail);
    }
  }, [user]);

  const socialLogInNickname = () => {
    if (!nickname) {
      return alert("빈칸을 입력해 주세요!");
    }
    setNickname(nickname);
    const newUser = { email: user.email, nickname };
    const collectionRef = collection(db, "logInData");
    addDoc(collectionRef, newUser);
    closeSocialLogInModal();
    setNickname("");
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = await new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const newUser = {
        email: user.email,
        nickname: user.displayName, 
        profileImage: user.photoURL || "https://firebasestorage.googleapis.com/v0/b/groove-a1c3e.appspot.com/o/avatars%2F6jGLxl6CBvcl4vO5vtUvbLO2FN23_chicken.png?alt=media&token=3228961e-73b4-47e3-b371-ba9e3bf7207f"
      };
      setIsUserLogIn(true);
      setSignUpModal(false);
      setSocialLogInModal(true);
      const collectionRef = collection(db, "logInData");
      await addDoc(collectionRef, newUser);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errorCode", errorCode);
      console.log("errorMessage", errorMessage);
      const credential = GoogleAuthProvider.credentialFromError(error);
      alert("오류가 발생했습니다.");
    }
  };
  
  const handleGitLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const popUpforLogin = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(popUpforLogin);

      setIsUserLogIn(true);
      setSignUpModal(false);
      setSocialLogInModal(true);
      const openModal = openSocialLogInModal;
      const getSocialLogInNickName = await socialLogInNickname;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = GithubAuthProvider.credentialFromError(error);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div>
      {!isUserLogIn && (
        <BackgroundLogInButton type="button" onClick={openLogInModal}>
          <i className="fa-solid fa-arrow-right-to-bracket" />
        </BackgroundLogInButton>
      )}
      {(logInModal || signUpModal || socialLogInModal) && (
        <div>
          <OverlayForm onClick={closeLogInSignUpModal} />
        </div>
      )}
      <div>
        {logInModal && !signUpModal && !socialLogInModal && (
          <div>
            <LogInForm>
              <div>
                <LogSigninButton type="button" name="ignore-click">
                  Log in
                </LogSigninButton>
                <LogSigninButton
                  type="button"
                  onClick={() => {
                    closeLogInModal();
                    openSignUpModal();
                  }}
                >
                  Sign up
                </LogSigninButton>
              </div>
              <TopText>
                <h3>Welcome back!</h3>
                <h4>Please sign in to your account</h4>
              </TopText>
              <IDPWBoxWrap>
                <IDPWBox>
                  <input placeholder="E-mail" type="text" name="email" value={email} onChange={onEmailChange} />
                </IDPWBox>
                <IDPWBox>
                  <input
                    placeholder="PASSWORD"
                    type="password"
                    name="password"
                    value={password}
                    onChange={onPasswordChange}
                  />
                </IDPWBox>
                <LogInButtonsBox>
                  <LogInSmallButton type="button" onClick={Login}>
                    Log in
                  </LogInSmallButton>
                </LogInButtonsBox>
              </IDPWBoxWrap>
            </LogInForm>
          </div>
        )}
      </div>

      <div>
        {signUpModal && !socialLogInModal && (
          <div>
            <LogInForm>
              <div>
                <LogSigninButton
                  type="button"
                  name="activeName"
                  onClick={() => {
                    closeSignUpModal();
                    openLogInModal();
                  }}
                >
                  Log in
                </LogSigninButton>
                <LogSigninButton type="button" name="ignore-click">
                  Sign up
                </LogSigninButton>
              </div>
              <IDPWBoxWrap>
                <IDPWBox>
                  <input placeholder="E-mail" type="text" name="email" value={email} onChange={onEmailChange} />
                </IDPWBox>
                <IDPWBox>
                  <input placeholder="Nickname" type="text" name="text" value={nickname} onChange={onNicknameChange} />
                </IDPWBox>
                <IDPWBox>
                  <input
                    placeholder="PASSWORD"
                    type="password"
                    name="password"
                    value={password}
                    onChange={onPasswordChange}
                  />
                </IDPWBox>
                <LogInButtonsBox>
                  <LogInSmallButton type="button" onClick={signUp}>
                    Sign up
                  </LogInSmallButton>
                </LogInButtonsBox>
              </IDPWBoxWrap>

              <div>or sign up with</div>

              <GoogleGitLogIn>
                <PromptLogIn type="button" onClick={handleGoogleSignUp}>
                  <i className="fa-brands fa-google" /> Google
                </PromptLogIn>
                <PromptLogIn type="button" onClick={handleGitLogin}>
                  <i className="fa-brands fa-github" /> Github
                </PromptLogIn>
              </GoogleGitLogIn>
            </LogInForm>
          </div>
        )}
      </div>

      <div>
        {socialLogInModal && (
          <SocialLogInNickname>
            <input placeholder="Nickname" type="text" required value={nickname} onChange={onNicknameChange} />
            <button onClick={socialLogInNickname}>확인</button>
          </SocialLogInNickname>
        )}
      </div>
    </div>
  );
}

export default GrooveAuth;