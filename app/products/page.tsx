"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Form,
  message,
  Modal,
  Col,
  Row,
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Tooltip
} from "antd";
import {
  SearchOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { IProduct } from "./Product";
import { useProductStore } from "./ProductsStore";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';


const { Column } = Table;


const ProductsPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/products');
    }
  });

  const [dataSourceLoading, setDataSourceLoading] = useState(false);
  const [createProductFormVisible, setCreateProductFormVisible] = useState(
    false
  );
  const [editProductFormVisible, setEditProductFormVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<IProduct>();

  const [createForm] = useForm();
  const [editForm] = useForm();

  const allProducts = useProductStore((state) => state.productsData);
  const callGetApi = useProductStore((state) => state.getAll);
  const callPostApi = useProductStore((state) => state.createProduct);
  const callPutApi = useProductStore((state) => state.updateProduct);
  const callDeleteApi = useProductStore((state) => state.deleteProduct);

  useEffect(() => {
    if (allProducts.length === 0) {
      setDataSourceLoading(true);
      callGetApi();
      setDataSourceLoading(false);
    }
  }, []);

  const closeCreateModal = () => {
    setCreateProductFormVisible(false);
    createForm.resetFields();
  };
  const closeEditModal = () => {
    editForm.resetFields();
    setEditProductFormVisible(false);
  };

  const onFinishCreateProductForm = (product: IProduct) => {
    callPostApi(product, session?.jwtToken!)
      .then(() => {
        closeCreateModal();
        message.success("The product has been created successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const onFinishEditProductForm = (product: IProduct) => {
    callPutApi(product, currentRecord!._id, session?.jwtToken!)
      .then(() => {
        closeEditModal();
        message.success("The product has been updated successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const deleteProduct = (_id: string) => {
    callDeleteApi(_id, session?.jwtToken!)
      .then(() => {
        message.success("The product has been deleted successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  // **********Modal******* //

  const showCreateModal = () => {
    setCreateProductFormVisible(true);
  };

  const showEditModal = () => {
    setEditProductFormVisible(true);
  };

  // **********Modal******* //

  // **********Utils********* //

  const alphabeticalSort = (a: string, b: string) => {
    return a.localeCompare(b);
  };

  // **********Utils********* //

  return (
    <Fragment>
      <Modal
        okButtonProps={{ style: { backgroundColor: 'green' } }}
        width={"100vh"}
        open={createProductFormVisible}
        title="Create Product"
        onCancel={closeCreateModal}
        onOk={createForm.submit}
      >
        <Form
          form={createForm}
          layout={"vertical"}
          onFinish={onFinishCreateProductForm}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name={"commonName"}
                label={"Common Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Product Common Name"} />
              </Form.Item>
              <Form.Item
                name={"affectedVariety"}
                label={"Affected Variety"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Product Affected Variety"} />
              </Form.Item>
              <Form.Item
                name={"productDensityPerHectare"}
                label={"Density Per Hectare"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input
                  type="number"
                  placeholder={"Product Density Per Hectare"}
                />
              </Form.Item>
              <Form.Item
                name={"color"}
                label={"Color"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="color" placeholder={"Product color"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        okButtonProps={{ style: { backgroundColor: 'green' } }}
        width={"100vh"}
        open={editProductFormVisible}
        title="Edit Product"
        onCancel={closeEditModal}
        onOk={editForm.submit}
      >
        <Form
          form={editForm}
          layout={"vertical"}
          onFinish={onFinishEditProductForm}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name={"commonName"}
                label={"Common Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Product Common Name"} />
              </Form.Item>
              <Form.Item
                name={"affectedVariety"}
                label={"Affected Variety"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Product Affected Variety"} />
              </Form.Item>
              <Form.Item
                name={"productDensityPerHectare"}
                label={"Density Per Hectare"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input
                  type="number"
                  placeholder={"Product Density Per Hectare"}
                />
              </Form.Item>
              <Form.Item
                name={"color"}
                label={"Color"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="color" placeholder={"Product color"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Row>
        <h1 className='text-3xl font-bold'>PRODUCTS</h1>
      </Row>

      <Row>
        <Col span={23} />
        <Col span={1}>
          <Button
            type="primary" ghost
            shape="circle"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "3vh" }}>
        <Col span={24}>
          <Table
            size={"middle"}
            dataSource={allProducts}
            loading={dataSourceLoading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: [5, 10]
            }}
            bordered={true}
            scroll={{ x: 1300 }}
          >
            <Column
              align={"center"}
              title="Common Name"
              dataIndex="commonName"
              key="commonName"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IProduct, b: IProduct) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Affected Varitey"
              dataIndex="affectedVariety"
              key="affectedVariety"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IProduct, b: IProduct) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Product Density Per Hectare"
              dataIndex="productDensityPerHectare"
              key="productDensityPerHectare"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IProduct, b: IProduct) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Actions"
              fixed={"right"}
              render={(value: IProduct, record: IProduct) => {
                return (
                  <Fragment>
                    <Space size={"large"}>
                      <Tooltip title="Edit">
                        <Button
                          shape="circle"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setCurrentRecord(record);
                            showEditModal();
                            editForm.setFieldsValue(record);
                          }}
                        />
                      </Tooltip>
                      <Popconfirm
                        okButtonProps={{ style: { backgroundColor: 'red' } }}
                        title="Are you sure？"
                        onConfirm={() => {
                          deleteProduct(value._id);
                        }}
                        icon={
                          <QuestionCircleOutlined style={{ color: "red" }} />
                        }
                      >
                        <Button shape="circle" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  </Fragment>
                );
              }}
            />
          </Table>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ProductsPage;
