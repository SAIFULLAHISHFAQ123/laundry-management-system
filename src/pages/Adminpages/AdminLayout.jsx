import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import AdminRoute from '../../routes/AdminRoute';
import '../../styles/main.css';

export default function AdminLayout() {
  return (
    <AdminRoute>
      <div className="app-wrapper" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AdminHeader />
        <main className="main-content" style={{ flexGrow: 1, padding: '2rem 1rem' }}>
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </AdminRoute>
  );
}
