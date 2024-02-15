const handleGoogleSignUp = async () => {
  try {
    const provider = await new GoogleAuthProvider();
    const popUpforLogin = await signInWithPopup(auth, provider);

    const alreadySignUpEmail = await fetchSignInMethodsForEmail(auth, googleLogInUserEmail);
    setIsUserLogIn(true);

    googleLogInUserEmail = popUpforLogin.user.email;

    setSignUpModal(false);
    openSocialLogInModal();
    const getSocialLogInNickName = await socialLogInNickname; //닉네임을 정하는 함수

    const newUser = { email: googleLogInUserEmail, nickname: socialLogInNickname };
    const collectionRef = collection(db, "logInData");
    await addDoc(collectionRef, newUser);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("errorCode", errorCode);
    console.log("errorMessage", errorMessage);
    const credential = GoogleAuthProvider.credentialFromError(error);
    alert("오류가 발생했습니다.");
  } finally {
    closeSocialLogInModal();
  }
};
