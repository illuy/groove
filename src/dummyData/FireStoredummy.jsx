import { useState } from "react";
import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/firestore";
import { auth, storage } from "../firebase";
import React from "react";

function FireStoredummy() {
  const todo = [{ id: 1, isDone: false }];
  const [todos, setTodos] = useState();
  const [selectedfile, setSelectedfile] = useState();

  const updateTodo = async (event) => {
    const todoRef = doc(db, todos, todo.id); // 데이터베이스, 컬렉션, 해당 id
    await updateDoc(todoRef, { ...todo, isDone: !todo.Done });

    setTodos((prev) => {
      return prev.map((element) => {
        if (element.id === todos.id) {
          return { ...element, isDone: !element.isDone };
        } else {
          return element;
        }
      });
    });
    const deleteTodo = async (event) => {
      const todoRef = doc(db, todos, todo.id);
      await deleteDoc(todoRef);
    };

    const handleFileSelect = (event) => {
      setSelectedfile(event.target.files[0]);
    };

    const hadleUpload = async () => {
      const imageRef = ref(storage, `${auth.currentUser.uid}/${selectedfile.name}`);
      await uploadBytes(imageRef, selectedfile);

      const downloadURL = await getDownloadURL(imageRef);
    };
  };
  return (
    <>
      <h2>파일 업로드 컴포넌트</h2>
      <input type="file" onChange={handlefileSelector} />
      <button onClick={handleUpload}>Upload</button>
    </>
  );
}

export default FireStoredummy;
