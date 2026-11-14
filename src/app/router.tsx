import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Home } from '../pages/Home';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { AdminLayout, AdminDashboard } from '../pages/admin/Admin';

export function AppRouter() {
  return <BrowserRouter><Routes><Route element={<Layout />}><Route path="/" element={<Home />} /><Route path="/explore" element={<PlaceholderPage />} /><Route path="/explore/:id" element={<PlaceholderPage />} /><Route path="/discover" element={<PlaceholderPage />} /><Route path="/phrasebook" element={<PlaceholderPage />} /><Route path="/events" element={<PlaceholderPage />} /><Route path="/account" element={<PlaceholderPage />} /><Route path="/chatbot" element={<PlaceholderPage />} /></Route><Route path="/admin" element={<AdminLayout />}><Route index element={<AdminDashboard />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></BrowserRouter>;
}
