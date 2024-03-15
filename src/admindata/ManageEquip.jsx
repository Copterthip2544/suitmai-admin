import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import './ManageEquip.css';

const ManageEquip = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [file, setFile] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [itemType, setItemType] = useState('อุปกรณ์');
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoData, setEditTodoData] = useState(null);
  const [updateTodoData, setUpdateTodoData] = useState(null);

  const addTodo = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'equipment'), {
        todo: todo,
      });
      console.log('เอกสารถูกเขียนโดย ID: ', docRef.id);

      await handleImageUpload(docRef.id);

      await fetchPost();

      setUpdateTodoData(null);
      setTodo(''); // เพิ่มบรรทัดนี้เพื่อล้างค่าใน input
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มเอกสาร: ', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'equipment', id));
      const updatedTodos = todos.filter((data) => data.id !== id);
      setTodos(updatedTodos);
      await fetchPost();
      setUpdateTodoData(null);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบเอกสาร: ', error);
    }
  };

  const fetchPost = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'equipment'));
      const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setTodos(data);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร: ', error);
    }
  };

  const handleImageUpload = async (docId) => {
    if (file && file.type.startsWith('image/')) {
      const storageRef = ref(storage, `images/${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);

        await setDoc(doc(db, 'equipment', docId), { imageUrl }, { merge: true });
        setUpdateTodoData(null);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ', error);
      }
    } else {
      console.error('กรุณาเลือกไฟล์รูปภาพ');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFile(file);
      setUpdateTodoData(null);
      setEditingTodo(null);
    } else {
      console.error('กรุณาเลือกไฟล์รูปภาพ');
    }
  };

  const editTodo = async (id, newTodo) => {
    try {
      await updateDoc(doc(db, 'equipment', id), { todo: newTodo });
      setEditingTodo(null);
      setIsEditing(false);
      await fetchPost();
      setUpdateTodoData(null);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตเอกสาร: ', error);
    }
  };

  const editImage = async (id) => {
    if (file) {
      try {
        const storageRef = ref(storage, `equipmentImages/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);

        await setDoc(doc(db, 'equipment', id), { imageUrl }, { merge: true });
        await fetchPost();
        setUpdateTodoData(null);
        setEditingTodo(null);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดตรูปภาพ: ', error);
      }
    } else {
      console.error('กรุณาเลือกไฟล์รูปภาพ');
    }
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setIsEditing(false);
    setUpdateTodoData(null);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="sutmai-container">
      <div className="form-container">
        <h1>{isEditing ? 'แก้ไขอุปกรณ์' : 'จัดการอุปกรณ์'}</h1>
        <input
          type="text"
          placeholder="ชื่ออุปกรณ์"
          value={isEditing ? updateTodoData?.todo : todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
          <option value="อุปกรณ์">อุปกรณ์</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
        />
        <br />
        {isEditing ? (
          <div>
            <button type="submit" onClick={() => editTodo(editingTodo, todo)}>
              บันทึก
            </button>
            <button onClick={cancelEdit}>
              ยกเลิก
            </button>
          </div>
        ) : (
          <button type="submit" onClick={addTodo}>
            ยืนยัน
          </button>
        )}
        <br />
      </div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>รูปภาพ</th>
              <th>ชื่อ</th>
              <th>การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {todos?.map((data, i) => (
              <tr key={i}>
                <td>
                  {editingTodo === data.id ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        editImage(data.id);
                      }}
                    />
                  ) : (
                    <img src={data.imageUrl} alt="Uploaded" style={{ maxWidth: '100px', height: 'auto' }} />
                  )}
                </td>
                <td>
                  {editingTodo === data.id ? (
                    <input
                      type="text"
                      value={isEditing ? updateTodoData?.todo : todo}
                      onChange={(e) => setTodo(e.target.value)}
                    />
                  ) : (
                    data.todo
                  )}
                </td>
                <td>
                  {editingTodo === data.id ? (
                    <div>
                      <button onClick={() => editTodo(data.id, todo)}>บันทึก</button>
                      <button onClick={cancelEdit}>ยกเลิก</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => setEditingTodo(data.id)}>แก้ไข</button>
                      <button onClick={() => deleteTodo(data.id)}>ลบ</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEquip;
