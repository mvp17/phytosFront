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
import { IClient } from "./Client";
import { useClientStore } from "./ClientsStore";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const { Column } = Table;


const ClientsPage = () => {
  const [dataSourceLoading, setDataSourceLoading] = useState(false);
  const [createClientFormVisible, setCreateClientFormVisible] = useState(false);
  const [editClientFormVisible, setEditClientFormVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<IClient>();

  const [createForm] = useForm();
  const [editForm] = useForm();

  const allClients = useClientStore((state) => state.clientsData);
  const callGetApi = useClientStore((state) => state.getAll);
  const callPostApi = useClientStore((state) => state.createClient);
  const callPutApi = useClientStore((state) => state.updateClient);
  const callDeleteApi = useClientStore((state) => state.deleteClientApi);

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/clients');
    }
  });

  useEffect(() => {
    if (allClients.length === 0) {
      getClients();
    }
  }, []);

  const getClients = () => {
    setDataSourceLoading(true);
    callGetApi();
    setDataSourceLoading(false);
  };
  
  const closeCreateModal = () => {
    setCreateClientFormVisible(false);
    createForm.resetFields();
  };
  const closeEditModal = () => {
    editForm.resetFields();
    setEditClientFormVisible(false);
  };

  const onFinishCreateClientForm = (client: IClient) => {
    callPostApi(client, session?.jwtToken!)
      .then(() => {
        closeCreateModal();
        message.success("The client has been created successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const onFinishEditClientForm = (client: IClient) => {
    callPutApi(client, currentRecord!._id, session?.jwtToken!)
      .then(() => {
        closeEditModal();
        message.success("The client has been updated successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const deleteClient = (_id: string) => {
    callDeleteApi(_id, session?.jwtToken!)
      .then(() => {
        message.success("The client has been deleted successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  // **********Modal******* //

  const showCreateModal = () => {
    setCreateClientFormVisible(true);
  };

  const showEditModal = () => {
    setEditClientFormVisible(true);
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
        open={createClientFormVisible}
        title="Create Client"
        onCancel={closeCreateModal}
        onOk={createForm.submit}
      >
        <Form
          form={createForm}
          layout={"vertical"}
          onFinish={onFinishCreateClientForm}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name={"name"}
                label={"Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Client Name"} />
              </Form.Item>
              <Form.Item
                name={"address"}
                label={"Address"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Client Address"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        okButtonProps={{ style: { backgroundColor: 'green' } }}
        width={"100vh"}
        open={editClientFormVisible}
        title="Edit Client"
        onCancel={closeEditModal}
        onOk={editForm.submit}
      >
        <Form
          form={editForm}
          layout={"vertical"}
          onFinish={onFinishEditClientForm}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name={"name"}
                label={"Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Client Name"} />
              </Form.Item>
              <Form.Item
                name={"address"}
                label={"Address"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Client Address"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Row>
        <h1 className='text-3xl font-bold'>
          Clients
        </h1>
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
            dataSource={allClients}
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
              title="Name"
              dataIndex="name"
              key="name"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IClient, b: IClient) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Address"
              dataIndex="address"
              key="address"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IClient, b: IClient) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Actions"
              fixed={"right"}
              render={(value: IClient, record: IClient) => {
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
                          deleteClient(value._id);
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
}

export default ClientsPage;
