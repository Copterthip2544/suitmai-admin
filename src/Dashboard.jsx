import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Dashboard.css';
import { auth } from './firebase'; // นำเข้า auth จาก Firebase

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // ใช้ auth.signOut() แทน signOut(auth)
      navigate('/');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการออกจากระบบ:', error.message);
    }
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const user = auth.currentUser;

      if (!user) {
        navigate('/');
      }
    };

    checkAuthStatus();

    return () => {
      // เพิ่ม clean-up code ที่ต้องการ (ถ้ามี)
    };
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <Navbar handleSignOut={handleSignOut} />
      <h1>ยินดีต้อนรับ ADMIN</h1>
      {/* เพิ่มเนื้อหาหน้า dashboard ตามที่คุณต้องการ */}
    </div>
  );
};

export default Dashboard;
