import { useState } from 'react';
import { Modal, Form, InputNumber, Button, message } from 'antd';
import api from '../services/api';

const StartingNumberModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.createStartingNumber(values.startingNumber);
      message.success('Starting number created successfully!');
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error(error.message || 'Failed to create starting number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Starting Number"
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
          name="startingNumber"
          label="Starting Number"
          rules={[
            { required: true, message: 'Please enter a starting number' },
            { type: 'number', message: 'Must be a valid number' },
          ]}
        >
          <InputNumber
            placeholder="Enter starting number"
            style={{ width: '100%' }}
            step={0.1}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StartingNumberModal;

