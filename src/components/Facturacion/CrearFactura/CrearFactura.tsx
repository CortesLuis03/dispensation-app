import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Table,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  fetchClientes,
  fetchProductos,
  fetchTipoFacturacion,
} from "@/services/CatalogosAPI";
import {
  Clientes,
  Productos,
  TipoFacturacion,
  UserDataClass,
} from "@/commons/types";
import Select, { SelectProps } from "antd/es/select";
import TextArea from "antd/es/input/TextArea";
import { NumericInput } from "@/commons/components";
import { Link, useNavigate } from "react-router-dom";
import { guardarFormula } from "@/services/FacturacionAPI";

interface DataType {
  key: React.Key;
  producto_id: number;
  nombre: string;
  lote: string;
  cantidad: number;
  precio: number;
  precio_unitario: number;
}

export function CrearFactura() {
  const [formDisabled, setFormDisabled] = useState<boolean>(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useState<UserDataClass>({
    email: sessionStorage.getItem("user_email"),
    name: sessionStorage.getItem("user_name"),
    id: parseInt(sessionStorage.getItem("user_id")),
  });

  const [value, setValue] = useState("");
  const [producto, setProducto] = useState<Productos>();
  const [count, setCount] = useState(0);
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const [arrayClientes, setArrayClientes] = useState<Array<Clientes>>();
  const [arrayProductos, setArrayProductos] = useState<Array<Productos>>();
  const [arrayTipoFacturacion, setArrayTipoFacturacion] =
    useState<Array<TipoFacturacion>>();
  const [listClientes, setListClientes] = useState<SelectProps["options"]>();
  const [listProductos, setListProductos] = useState<SelectProps["options"]>();
  const [listTipoFacturacion, setListTipoFacturacion] =
    useState<SelectProps["options"]>();

  const [crearFormula] = Form.useForm();

  useEffect(() => {
    fetchClientes((clientes: Array<Clientes>) => {
      setArrayClientes(clientes);
      let list = clientes.map((cliente: Clientes) => {
        return {
          label: `${cliente.cedula} - ${cliente.nombre}`,
          value: cliente.id,
        };
      });
      setListClientes(list);
    });
    fetchProductos((productos: Array<Productos>) => {
      setArrayProductos(productos);
      let list = productos.map((producto: Productos) => {
        return {
          label: `${producto.nombre} - $${producto.precio}`,
          value: producto.id,
        };
      });
      setListProductos(list);
    });
    fetchTipoFacturacion((tipos: Array<TipoFacturacion>) => {
      setArrayTipoFacturacion(tipos);
      let list = tipos.map((tipo: TipoFacturacion) => {
        return {
          label: `${tipo.descripcion}`,
          value: tipo.id,
        };
      });
      setListTipoFacturacion(list);
    });
    crearFormula.setFieldValue("usuario_nombre", user.name);
    crearFormula.setFieldValue("usuario_email", user.email);
  }, []);

  const onChangueCliente = (value: string | number) => {
    const selectClient = arrayClientes.find((cliente: Clientes) => {
      return cliente.id == value;
    });
    crearFormula.setFieldValue("nombre_cliente", selectClient.nombre);
    crearFormula.setFieldValue("eps_cliente", selectClient.eps);
  };

  const onChangueProducto = (value: string | number) => {
    const selectProducto = arrayProductos.find((producto: Productos) => {
      return producto.id == value;
    });
    setProducto(selectProducto);
    let cantidad = 1;
    if (crearFormula.getFieldValue("producto_cantidad")) {
      cantidad = crearFormula.getFieldValue("producto_cantidad");
    } else {
      crearFormula.setFieldValue("producto_cantidad", cantidad);
    }
    crearFormula.setFieldValue(
      "producto_precio",
      selectProducto.precio * cantidad
    );
  };

  const onChangueCantidad = (value: string | any) => {
    crearFormula.setFieldValue("producto_precio", producto.precio * value);
  };

  const agregarProducto = () => {
    if (crearFormula.getFieldValue("producto_id")) {
      const validarProducto = dataSource.find(
        (prod) => prod.producto_id == crearFormula.getFieldValue("producto_id")
      );
      if (!validarProducto) {
        let nuevoDetalle = {
          key: count + 1,
          producto_id: producto.id,
          cantidad: crearFormula.getFieldValue("producto_cantidad"),
          precio: crearFormula.getFieldValue("producto_precio"),
          precio_unitario: producto.precio,
          nombre: producto.nombre,
          lote: producto.lote,
        };
        setDataSource([...dataSource, nuevoDetalle]);
        setCount(count + 1);
        crearFormula.setFieldValue("producto_id", null);
        crearFormula.setFieldValue("producto_cantidad", null);
        crearFormula.setFieldValue("producto_precio", null);
        messageApi.open({
          type: "success",
          content: "Producto agregado",
        });
      } else {
        messageApi.open({
          type: "info",
          content: "Este producto ya fue agregado, por favor selecciona otro",
        });
      }
    } else {
      messageApi.open({
        type: "error",
        content: "Por favor selecciona un producto",
      });
    }
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns = [
    {
      title: "Producto",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Precio Unitario",
      dataIndex: "precio_unitario",
      key: "precio_unitario",
    },
    {
      title: "Total",
      dataIndex: "precio",
      key: "precio",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",

      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="¿Seguro?"
            okText="Si"
            cancelText="No"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        ) : null,
    },
  ];

  const onFinish = () => {
    if (dataSource.length > 0) {
      const dataSend = {
        cliente_id: crearFormula.getFieldValue("cliente_id"),
        tipo_facturacion_id: crearFormula.getFieldValue("tipofacturacion_id"),
        usuario_id: sessionStorage.getItem("user_id"),
        observacion: crearFormula.getFieldValue("observaciones"),
        detalle: dataSource,
      };

      guardarFormula(dataSend, (response: boolean) => {
        if (response) {
          messageApi.open({
            type: "success",
            content: "Registro de facturacion exitoso",
          });
          setFormDisabled(true);
          setTimeout(() => {
            navigate("/facturacion/lista");
          }, 2000);
        } else {
          setFormDisabled(false);
          messageApi.open({
            type: "error",
            content:
              "Hubo un error en el envio de los datos, por favor validar con el administrador",
          });
        }
      });
    } else {
      messageApi.open({
        type: "error",
        content: "Por favor agrega al menos un producto",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Card className="_card-bill-form">
        <Form form={crearFormula} onFinish={onFinish} disabled={formDisabled}>
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item
                name="cliente_id"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona un cliente!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Cliente"
                  onChange={onChangueCliente}
                  filterOption={(input, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={listClientes}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="nombre_cliente">
                <Input placeholder="Nombre cliente" disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="eps_cliente">
                <Input placeholder="EPS Cliente" disabled />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="fecha_formula"
                rules={[
                  {
                    type: "object" as const,
                    required: true,
                    message: "Por favor selecciona la fecha!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placement="bottomRight"
                  placeholder="Fecha Formula"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                name="tipofacturacion_id"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona el tipo de facturacion!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Tipo Facturacion"
                  filterOption={(input, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={listTipoFacturacion}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="usuario_nombre">
                <Input placeholder="Usuario Nombre" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="usuario_email">
                <Input placeholder="Usuario Email" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name="observaciones"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa una observacion!",
                  },
                ]}
              >
                <TextArea
                  showCount
                  maxLength={500}
                  style={{ height: 120, resize: "none" }}
                  placeholder="Observaciones"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="producto_id">
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Producto"
                  onChange={onChangueProducto}
                  filterOption={(input, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={listProductos}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="producto_cantidad">
                <NumericInput
                  value={value}
                  onChange={(value) => {
                    setValue(value);
                    onChangueCantidad(value);
                  }}
                  placeholder="Cantidad"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="producto_precio">
                <Input placeholder="Precio" disabled />
              </Form.Item>
            </Col>
            <Col span={2} style={{ display: "flex", justifyContent: "center" }}>
              <Tooltip title="Añadir">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  onClick={agregarProducto}
                />
              </Tooltip>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <Table columns={columns} dataSource={dataSource} />
            </Col>
          </Row>
          <Row justify="end" gutter={12} style={{ marginTop: 10 }}>
            <Col>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </Col>
            <Col>
              <Form.Item>
                <Link to="/facturacion/lista">
                  <Button danger>Cancelar</Button>
                </Link>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
