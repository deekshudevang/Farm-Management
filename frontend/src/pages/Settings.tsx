import { useState, useEffect } from 'react';
import { User, Lock, Bell, Palette, Trash2, Save, Check, X, Shield, Mail, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

type Tab = 'profile' | 'security' | 'notifications' | 'appearance';

interface Toast { message: string; type: 'success' | 'error'; }

export const Settings = () => {
  const { user, login, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [toast, setToast] = useState<Toast | null>(null);
  const [loading, setLoading] = useState(false);

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileStats, setProfileStats] = useState({ fields: 0, tasks: 0, inventory: 0 });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification preferences (local only)
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [notifTaskReminders, setNotifTaskReminders] = useState(true);
  const [notifWeeklyReport, setNotifWeeklyReport] = useState(true);

  // Appearance (local only)
  const [compactMode, setCompactMode] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/settings/profile');
      setName(res.data.name);
      setEmail(res.data.email);
      setProfileStats({
        fields: res.data._count?.fields || 0,
        tasks: res.data._count?.tasks || 0,
        inventory: res.data._count?.inventory || 0,
      });
    } catch {
      // use local data
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await api.put('/settings/profile', { name, email });
      login(token!, res.data);
      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.put('/settings/password', { currentPassword, newPassword });
      showToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/settings/account');
      showToast('Account deleted', 'success');
      setTimeout(() => logout(), 1000);
    } catch {
      showToast('Failed to delete account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'security', label: 'Security', icon: Lock },
    { key: 'notifications', label: 'Alerts', icon: Bell },
    { key: 'appearance', label: 'Display', icon: Palette },
  ];

  return (
    <div className="page-enter" style={{ maxWidth: 780, margin: '0 auto' }}>
      {/* Header */}
      <div className="stagger-1" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="settings-tabs stagger-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`settings-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon style={{ width: 16, height: 16 }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="settings-section">
            <div className="settings-section-header">
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Profile Information</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Update your personal details</p>
            </div>
            <div className="settings-section-body">
              {/* Avatar + Role */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div className="settings-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{user?.name}</div>
                  <span className={`badge ${user?.role === 'ADMIN' ? 'badge-purple' : 'badge-teal'}`} style={{ marginTop: 6 }}>
                    <Shield style={{ width: 12, height: 12, marginRight: 4 }} />
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Fields', value: profileStats.fields },
                  { label: 'Tasks', value: profileStats.tasks },
                  { label: 'Inventory', value: profileStats.inventory },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '14px 12px', background: '#f8fafc', borderRadius: 12 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#0f766e' }}>{s.value}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label">Full Name</label>
                  <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
              </div>

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleSaveProfile} disabled={loading}>
                  <Save style={{ width: 16, height: 16 }} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="settings-section">
            <div className="settings-section-header">
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Change Password</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Keep your account secure</p>
            </div>
            <div className="settings-section-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label">Current Password</label>
                  <input className="input-field" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input className="input-field" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input className="input-field" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleChangePassword} disabled={loading || !currentPassword || !newPassword}>
                  <Lock style={{ width: 16, height: 16 }} />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="danger-zone">
            <div style={{ padding: '24px 28px 0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#dc2626', margin: 0 }}>Danger Zone</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Irreversible actions on your account</p>
            </div>
            <div style={{ padding: '20px 28px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Delete Account</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Permanently remove your account and all data</div>
                </div>
                {!showDeleteConfirm ? (
                  <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 style={{ width: 14, height: 14 }} />
                    Delete
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-danger btn-sm" onClick={handleDeleteAccount} disabled={loading}>
                      <Check style={{ width: 14, height: 14 }} />
                      Confirm
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowDeleteConfirm(false)}>
                      <X style={{ width: 14, height: 14 }} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="settings-section">
            <div className="settings-section-header">
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Notification Preferences</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Choose how you want to be notified</p>
            </div>
            <div className="settings-section-body">
              {[
                { label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail, value: notifEmail, setter: setNotifEmail },
                { label: 'Push Notifications', desc: 'Browser push alerts', icon: Bell, value: notifPush, setter: setNotifPush },
                { label: 'Task Reminders', desc: 'Get reminded about upcoming tasks', icon: Smartphone, value: notifTaskReminders, setter: setNotifTaskReminders },
                { label: 'Weekly Report', desc: 'Receive a weekly farm summary', icon: Bell, value: notifWeeklyReport, setter: setNotifWeeklyReport },
              ].map((item) => (
                <div className="settings-row" key={item.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className="icon-float icon-float-teal" style={{ width: 38, height: 38, borderRadius: 10 }}>
                      <item.icon style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{item.desc}</div>
                    </div>
                  </div>
                  <button
                    className={`toggle-switch ${item.value ? 'active' : ''}`}
                    onClick={() => item.setter(!item.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="settings-section">
            <div className="settings-section-header">
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Display Preferences</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Customize how AgriSmart looks</p>
            </div>
            <div className="settings-section-body">
              <div className="settings-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="icon-float icon-float-purple" style={{ width: 38, height: 38, borderRadius: 10 }}>
                    <Palette style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Compact Mode</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>Reduce spacing for denser layouts</div>
                  </div>
                </div>
                <button
                  className={`toggle-switch ${compactMode ? 'active' : ''}`}
                  onClick={() => setCompactMode(!compactMode)}
                />
              </div>

              {/* Theme preview */}
              <div style={{ marginTop: 20 }}>
                <label className="label" style={{ marginBottom: 12 }}>Theme</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{
                    padding: 20, borderRadius: 14, border: '2px solid #14b8a6', background: '#f8fafc',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 200ms'
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f1f5f9', margin: '0 auto 8px', border: '1px solid #e2e8f0' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Light</div>
                    <div style={{ fontSize: 11, color: '#14b8a6', fontWeight: 600, marginTop: 2 }}>Active</div>
                  </div>
                  <div style={{
                    padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff',
                    cursor: 'not-allowed', textAlign: 'center', opacity: 0.5
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#1e293b', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Dark</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>Coming Soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.type === 'success' ? <Check style={{ width: 18, height: 18 }} /> : <X style={{ width: 18, height: 18 }} />}
          {toast.message}
        </div>
      )}
    </div>
  );
};
