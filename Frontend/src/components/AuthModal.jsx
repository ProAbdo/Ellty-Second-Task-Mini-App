import { useState } from "react";
import { Modal, Tabs, Form, Input, Button, message } from "antd";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ open, onClose }) => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleLogin = async (values) => {
    setLoading(true);
    const result = await login(values.username, values.password);
    setLoading(false);

    if (result.success) {
      message.success("Login successful!");
      loginForm.resetFields();
      onClose();
    } else {
      message.error(result.error || "Login failed");
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    const result = await register(values.username, values.password);
    setLoading(false);

    if (result.success) {
      message.success("Registration successful!");
      registerForm.resetFields();
      onClose();
    } else {
      message.error(result.error || "Registration failed");
    }
  };

  return (
    <Modal
      title="Authentication"
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Tabs
        defaultActiveKey="login"
        items={[
          {
            key: "login",
            label: "Login",
            children: (
              <Form
                form={loginForm}
                onFinish={handleLogin}
                layout="vertical"
                autoComplete="off"
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: "Please enter your username" },
                  ]}
                >
                  <Input placeholder="Enter username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                  ]}
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: "register",
            label: "Register",
            children: (
              <Form
                form={registerForm}
                onFinish={handleRegister}
                layout="vertical"
                autoComplete="off"
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: "Please enter a username" },
                    {
                      min: 3,
                      message: "Username must be at least 3 characters",
                    },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Username can only contain letters, numbers, and underscores",
                    },
                  ]}
                >
                  <Input placeholder="Enter username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please enter a password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                  >
                    Register
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default AuthModal;
