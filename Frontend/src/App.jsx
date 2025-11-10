import { useState } from 'react';
import { Layout, Button, Space, Typography, message, Spin } from 'antd';
import { UserOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import CalculationTree from './components/CalculationTree';
import StartingNumberModal from './components/StartingNumberModal';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const AppContent = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [startingNumberModalVisible, setStartingNumberModalVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogout = () => {
    logout();
    message.success('Logged out successfully');
  };

  const handleStartingNumberSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          Calculation Tree
        </Title>
        <Space>
          {loading ? (
            <Spin size="small" />
          ) : isAuthenticated ? (
            <>
              <Space>
                <UserOutlined />
                <span>{user?.username}</span>
              </Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setStartingNumberModalVisible(true)}
              >
                New Calculation
              </Button>
              <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => setAuthModalVisible(true)}>
              Login / Register
            </Button>
          )}
        </Space>
      </Header>
      <Content
        style={{
          padding: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <CalculationTree refreshTrigger={refreshTrigger} />
      </Content>

      <AuthModal
        open={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
      <StartingNumberModal
        visible={startingNumberModalVisible}
        onClose={() => setStartingNumberModalVisible(false)}
        onSuccess={handleStartingNumberSuccess}
      />
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
