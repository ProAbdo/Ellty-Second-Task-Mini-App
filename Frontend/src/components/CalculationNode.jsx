import { useState } from 'react';
import { Card, Button, Space, Typography, Avatar, Divider } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import OperationModal from './OperationModal';
import './CalculationNode.css';

const { Text, Title } = Typography;

const CalculationNode = ({ calculation, level = 0, onOperationAdded }) => {
  const { isAuthenticated } = useAuth();
  const [operationModalVisible, setOperationModalVisible] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} в ${hours}:${minutes}`;
  };

  const getOperationSymbol = (operationType) => {
    switch (operationType) {
      case 'add':
        return '+';
      case 'subtract':
        return '-';
      case 'multiply':
        return '×';
      case 'divide':
        return '÷';
      default:
        return '';
    }
  };

  const displayValue = calculation.startingNumber !== null
    ? calculation.startingNumber
    : calculation.rightOperand;

  return (
    <>
      <div className={`calculation-node level-${level}`}>
        <Card
          className="calculation-card"
          size="small"
          style={{
            marginLeft: `${level * 40}px`,
            marginTop: '12px',
            borderLeft: level > 0 ? '3px solid #1890ff' : 'none',
          }}
        >
          <div className="calculation-header">
            <Space>
              <Avatar icon={<UserOutlined />} size="small" />
              <div>
                <Text strong>{calculation.username || 'Unknown'}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {formatDate(calculation.createdAt)}
                </Text>
              </div>
            </Space>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <div className="calculation-content">
            {calculation.startingNumber !== null ? (
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Starting Number: {calculation.startingNumber}
                </Title>
                <Text type="secondary">Result: {calculation.result}</Text>
              </div>
            ) : (
              <div>
                <Text>
                  {calculation.operationType && (
                    <>
                      <Text strong>{getOperationSymbol(calculation.operationType)}</Text>{' '}
                      {calculation.rightOperand}
                    </>
                  )}
                </Text>
                <br />
                <Text type="secondary" strong>
                  Result: {calculation.result}
                </Text>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className="calculation-actions" style={{ marginTop: '12px' }}>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={() => setOperationModalVisible(true)}
                size="small"
              >
                Reply
              </Button>
            </div>
          )}
        </Card>

        {calculation.children && calculation.children.length > 0 && (
          <div className="calculation-children">
            {calculation.children.map((child) => (
              <CalculationNode
                key={child.id}
                calculation={child}
                level={level + 1}
                onOperationAdded={onOperationAdded}
              />
            ))}
          </div>
        )}
      </div>

      <OperationModal
        visible={operationModalVisible}
        onClose={() => setOperationModalVisible(false)}
        parentId={calculation.id}
        onSuccess={() => {
          setOperationModalVisible(false);
          if (onOperationAdded) {
            onOperationAdded();
          }
        }}
      />
    </>
  );
};

export default CalculationNode;

