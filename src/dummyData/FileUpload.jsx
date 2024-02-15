import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { auth, storage } from "../firebase";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState();

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    // ref 함수를 이용해서 Storage 내부 저장할 위치를 지정하고, uploadBytes 함수를 이용해서 파일을 저장합니다.
    const imageRef = ref(storage, `${auth.currentUser.uid}/${selectedFile.name}`);
    await uploadBytes(imageRef, selectedFile);

    // 파일 URL 가져오기
    const downloadURL = await getDownloadURL(imageRef);

    setImageUrl(downloadURL);
  };

  return (
    <div>
      <h2>파일 업로드 컴포넌트</h2>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleUpload}>Upload</button>
      <img src={imageUrl} alt="기본이미지" style={{ width: "200px", height: "200px" }}></img>
    </div>
  );
};

export default FileUpload;
