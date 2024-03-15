import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import './ManageEquip.css';

const ManageIngre = () => {
    const [todo, setTodo] = useState('');
    const [price, setPrice] = useState('');
    const [todos, setTodos] = useState([]);
    const [file, setFile] = useState(null);
    const [editingTodo, setEditingTodo] = useState(null);
    const [itemType, setItemType] = useState('วัตถุดิบ');
    const [isEditing, setIsEditing] = useState(false); // เพิ่ม state สำหรับตรวจสอบการแก้ไข
  
    const addTodo = async (e) => {
      e.preventDefault();
  
      try {
        const docRef = await addDoc(collection(db, 'rawMaterials'), {
          todo: todo,
          price: price,
          itemType: itemType,
        });
        console.log('เอกสารถูกเขียนโดย ID: ', docRef.id);
  
        await handleImageUpload(docRef.id);
  
        await fetchPost();
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเพิ่มเอกสาร: ', error);
      }
    };
  
    const deleteTodo = async (id) => {
      try {
        await deleteDoc(doc(db, 'rawMaterials', id));
        const updatedTodos = todos.filter((data) => data.id !== id);
        setTodos(updatedTodos);
        await fetchPost();
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบเอกสาร: ', error);
      }
    };
  
    const fetchPost = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rawMaterials'));
        const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setTodos(data);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร: ', error);
      }
    };
  
    const handleImageUpload = async (docId) => {
      if (file) {
        const storageRef = ref(storage, `images/${file.name}`);
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(snapshot.ref);
  
          await setDoc(doc(db, 'rawMaterials', docId), { imageUrl }, { merge: true });
        } catch (error) {
          console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ', error);
        }
      }
    };
  
    const handleFileInputChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        setFile(file);
      } else {
        console.error('กรุณาเลือกไฟล์รูปภาพ');
      }
    };
  
    const editTodo = async (id, newTodo, newPrice) => {
      try {
        await setDoc(doc(db, 'rawMaterials', id), { todo: newTodo, price: newPrice }, { merge: true });
        setEditingTodo(null);
        setIsEditing(false); // ยกเลิกโหมดการแก้ไข
        await fetchPost();
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดตเอกสาร: ', error);
      }
    };
  
    const editImage = async (id) => {
      try {
        const storageRef = ref(storage, `rawMaterialImages/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);
  
        await setDoc(doc(db, 'rawMaterials', id), { imageUrl }, { merge: true });
        await fetchPost();
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดตรูปภาพ: ', error);
      }
    };
  
    const cancelEdit = () => {
      setEditingTodo(null);
      setIsEditing(false); // ยกเลิกโหมดการแก้ไข
    };
  
    useEffect(() => {
      fetchPost();
    }, []);
  
    return (
      <div className="sutmai-container">
        <div className="form-container">
          <h1>{isEditing ? 'แก้ไขวัตถุดิบ' : 'จัดการวัตถุดิบ'}</h1>
          <input
            type="text"
            placeholder="ชื่อวัตถุดิบ"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <input
            type="text"
            placeholder="ราคา"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
            <option value="วัตถุดิบ">วัตถุดิบ</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
          />
          <br />
          {isEditing ? (
            <div>
              <button type="submit" onClick={() => editTodo(editingTodo, todo, price)}>
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
                <th>ราคา</th>
                <th>ประเภท</th>
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
                        value={data.todo}
                        onChange={(e) => {
                          const newData = [...todos];
                          newData[i].todo = e.target.value;
                          setTodos(newData);
                        }}
                      />
                    ) : (
                      data.todo
                    )}
                  </td>
                  <td>
                    {editingTodo === data.id ? (
                      <input
                        type="text"
                        value={data.price}
                        onChange={(e) => {
                          const newData = [...todos];
                          newData[i].price = e.target.value;
                          setTodos(newData);
                        }}
                      />
                    ) : (
                      data.price
                    )}
                  </td>
                  <td>{data.itemType}</td>
                  <td>
                    {editingTodo === data.id ? (
                      <div>
                        <button onClick={() => editTodo(data.id, data.todo, data.price)}>บันทึก</button>
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
  
  export default ManageIngre;
  
