import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Breadcrumb, { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { DownOutlined, BarcodeOutlined } from "@ant-design/icons";
import { Login } from "@/components";
import Menu, { MenuProps } from "antd/es/menu";
import { Layout, Image, Space, Dropdown, Card } from "antd";
import { useMemo, useState } from "react";
import logo from "@/assets/logo.png";
import "./Root.scss";
import useToken from "@/commons/hooks/useToken";
import { UserDataClass } from "@/commons/types";
import { fetchLogout } from "@/services/LoginAPI";
import { CrearFactura } from "@/components/Facturacion/CrearFactura";
import Title from "antd/es/typography/Title";
import { ListarFactura } from "@/components/Facturacion/ListarFactura";

const { Header, Content, Sider } = Layout;

export function Root() {
  const { token, setToken, removeToken } = useToken();
  const [user, setUser] = useState<UserDataClass>({
    email: sessionStorage.getItem("user_email"),
    name: sessionStorage.getItem("user_name"),
    id: parseInt(sessionStorage.getItem("user_id")),
  });
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState<Array<BreadcrumbItemType>>([
    { title: "Dashboard" },
  ]);

  let location = useLocation();

  useMemo(() => {
    setBreadcrumbs(
      location.pathname
        .slice(1)
        .split("/")
        .map((item) => {
          return {
            title: item,
          };
        })
    );
  }, [location]);

  const onMenuClick = ({ key }: { key: string }) => {
    navigate(`/${key}`);
  };

  const logout = () => {
    removeToken();
    navigate("/");
    fetchLogout();
    window.location.reload();
  };

  const menuItems: MenuProps["items"] = [
    {
      label: "Facturacion",
      key: "facturacion",
      icon: <BarcodeOutlined />,
      children: [
        {
          label: "Crear Factura",
          key: "facturacion/crear",
          onClick: onMenuClick,
        },
        {
          label: "Lista Facturas",
          key: "facturacion/lista",
          onClick: onMenuClick,
        },
      ],
    },
  ];

  const items: MenuProps["items"] = [
    {
      label: <a onClick={logout}>Logout</a>,
      key: "0",
    },
  ];

  return !token ? (
    <Login setToken={setToken} />
  ) : (
    <Layout className="_app-layout">
      <Sider theme="light" breakpoint="lg" collapsedWidth="0">
        <Space className="_app-layout-sider-logo">
          <Link
            to="/"
            onClick={() => {
              setBreadcrumbs([{ title: "Dashboard" }]);
            }}
          >
            <Image width={80} src={logo} preview={false} />
          </Link>
        </Space>
        <Menu mode="inline" items={menuItems} />
      </Sider>
      <Layout className="_app-layout">
        <Header
          style={{
            display: "flex",
            justifyContent: "end",
            paddingInlineEnd: 20,
          }}
        >
          <Dropdown menu={{ items }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()} style={{ color: "white" }}>
              <Space>
                {user?.name}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Header>
        <Content className="_app-layout-content">
          <Breadcrumb items={breadcrumbs}></Breadcrumb>
          <Routes>
            <Route path="/" Component={Welcome}></Route>
            <Route path="/facturacion/crear" Component={CrearFactura}></Route>
            <Route path="/facturacion/lista" Component={ListarFactura}></Route>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function Welcome() {
  return (
    <>
      <Space className="_welcome-container">
        <Title style={{ display: "flex", justifyContent: "center" }} level={1}>
          Bienvenido a la Intranet, {sessionStorage.getItem("user_name")}
        </Title>
      </Space>
    </>
  );
}
