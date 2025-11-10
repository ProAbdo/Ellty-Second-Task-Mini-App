import { useState } from 'react';
import { Modal, Form, InputNumber, Select, Button, message } from 'antd';
import api from '../services/api';

const OperationModal = ({ visible, onClose, parentId, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.addOperation(
        parentId,
        values.operationType,
        values.rightOperand
      );
      message.success('Operation added successfully!');
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error(error.message || 'Failed to add operation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Operation"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="operationType"
          label="Operation"
          rules={[{ required: true, message: 'Please select an operation' }]}
        >
          <Select placeholder="Select operation">
            <Select.Option value="add">Addition (+)</Select.Option>
            <Select.Option value="subtract">Subtraction (-)</Select.Option>
            <Select.Option value="multiply">Multiplication (×)</Select.Option>
            <Select.Option value="divide">Division (÷)</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="rightOperand"
          label="Right Operand"
          rules={[
            { required: true, message: 'Please enter a number' },
            { type: 'number', message: 'Must be a valid number' },
          ]}
        >
          <InputNumber
            placeholder="Enter number"
            style={{ width: '100%' }}
            step={0.1}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Add Operation
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OperationModal;

