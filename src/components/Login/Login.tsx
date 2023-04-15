import { fetchUserProfile, validLogin } from "@/services/LoginAPI";
import "./Login.scss";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  Space,
  Typography,
  message,
} from "antd";
import { UserData } from "@/commons/types";
const { Content } = Layout;
const { Title } = Typography;
export function Login({ setToken }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [login_form] = Form.useForm();

  const onFinish = () => {
    let data = {
      email: login_form.getFieldValue("email"),
      password: login_form.getFieldValue("password"),
    };

    validLogin(data, (response: string | any) => {
      if (response?.token) {
        setToken(response.token);
        fetchUserProfile((user: UserData) => {
          sessionStorage.setItem('user_name', user.userData.name)
          sessionStorage.setItem('user_email', user.userData.email)
          sessionStorage.setItem('user_id', String(user.userData.id))
        });
      } else {
        messageApi.open({
          type: "error",
          content: response.message,
        });
      }
    });
  };

  return (
    <>
      {contextHolder}
      <Layout>
        <Content>
          <Space className="_login-container">
            <Card
              bordered={false}
              title={
                <Title
                  level={2}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  Sign In
                </Title>
              }
            >
              <Form
                form={login_form}
                name="login_form"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                size={"large"}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please input your Email!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="_form-input-icon" />}
                    placeholder="Email"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your Password!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="_form-input-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Space>
        </Content>
      </Layout>
    </>
  );
}
