import { Detalle, Formulas } from "@/commons/types";
import { deleteFormula, fetchFormulas } from "@/services/FacturacionAPI";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  List,
  Modal,
  Popconfirm,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";

interface DataType {
  key: React.Key;
  factura_id: number;
  cliente: string;
  fecha: Date;
  usuario: string;
  valor_total: number;
}

export function ListarFactura() {
  const [modalProductos, contextHolder] = Modal.useModal();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [dataFormulas, setDataFormulas] = useState<Array<Formulas>>();

  const getInfo = () => {
    fetchFormulas((data: Array<Formulas>) => {
      setDataFormulas(data);
      const dataTable = data.map((formula) => {
        const total_inicial = 0;
        const total = formula.detalle.reduce(
          (accumulator, currentValue) => accumulator + currentValue.precio,
          total_inicial
        );
        return {
          key: formula.id,
          factura_id: formula.id,
          cliente: formula.cliente.nombre,
          fecha: formula.created_at,
          usuario: formula.usuario.name,
          valor_total: parseFloat(total.toString()),
        };
      });
      setDataSource(dataTable);
    });
  };

  useEffect(() => {
    getInfo();
  }, []);

  const mostrarProductos = (key: React.Key) => {
    let formula = dataFormulas.find((formula) => {
      return formula.id === key;
    });
    let productos = formula.detalle;
    let modalConfig = {
      title: `Productos: Factura Nro ${formula.id}`,
      content: (
        <>
          <List
            dataSource={productos}
            renderItem={(item: Detalle) => (
              <>
                <Descriptions
                  title={item.producto.nombre}
                  bordered
                  column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                >
                  <Descriptions.Item label="Lote">
                    {item.producto.lote}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vencimiento">
                    {item.producto.vencimiento.toString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cantidad Facturada">
                    {item.cantidad}
                  </Descriptions.Item>
                  <Descriptions.Item label="Precio Unitario">
                    {item.producto.precio}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Facturado">
                    {item.precio}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          />
        </>
      ),
      okText: "Continuar",
      width: 1000,
    };
    modalProductos.info(modalConfig);
  };

  const handleDelete = (key: React.Key) => {
    deleteFormula(key);
    getInfo();
  };

  const columns = [
    {
      title: "Factura Nro",
      dataIndex: "factura_id",
      key: "factura_id",
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
    },
    {
      title: "Valor Factura",
      dataIndex: "valor_total",
      key: "valor_total",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",

      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <>
            <Tooltip title="Ver productos">
              <Button
                type="primary"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => mostrarProductos(record.key)}
              />
            </Tooltip>
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
          </>
        ) : null,
    },
  ];
  return (
    <>
      {contextHolder}
      <Card>
        <Table dataSource={dataSource} columns={columns}></Table>
      </Card>
    </>
  );
}
