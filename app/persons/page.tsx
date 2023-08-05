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
  Tooltip,
  Select
} from "antd";
import type {SelectProps} from "antd";
import {
  SearchOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { IPerson } from "./Person";
import { usePersonStore } from "./PersonsStore";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useClientStore } from "../clients/ClientsStore";

const { Column } = Table;


const PersonsPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/persons');
    }
  });

  const [dataSourceLoading, setDataSourceLoading] = useState(false);
  const [createPersonFormVisible, setCreatePersonFormVisible] = useState(false);
  const [editPersonFormVisible, setEditPersonFormVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<IPerson>();

  const [createForm] = useForm();
  const [editForm] = useForm();

  const allPersons = usePersonStore((state) => state.personsData);
  const getPersonsApi = usePersonStore((state) => state.getAll);
  const postPersonApi = usePersonStore((state) => state.createPerson);
  const putPersonApi = usePersonStore((state) => state.updatePerson);
  const deletePersonApi = usePersonStore((state) => state.deletePerson);

  const allClients = useClientStore((state) => state.clientsData);
  const getClientsApi = useClientStore((state) => state.getAll);

  const clients: SelectProps['options'] = 
    allClients.map((client) => {
      return {
        value: client.name,
        label: client.name
      }
    });

  useEffect(() => {
    if (allPersons.length === 0)
      getPersons();
    if (allClients.length === 0)
      getClients()
  }, []);

  const getClients = () => {
    setDataSourceLoading(true);
    getClientsApi()
    setDataSourceLoading(false);
  };

  const getPersons = () => {
    setDataSourceLoading(true);
    getPersonsApi();
    setDataSourceLoading(false);
  };


  const closeCreateModal = () => {
    setCreatePersonFormVisible(false);
    createForm.resetFields();
  };
  const closeEditModal = () => {
    editForm.resetFields();
    setEditPersonFormVisible(false);
  };

  const onFinishCreatePersonForm = (person: IPerson) => {
    postPersonApi(person, session?.jwtToken!)
      .then(() => {
        closeCreateModal();
        message.success("The person has been created successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const onFinishEditPersonForm = (person: IPerson) => {
    putPersonApi(person, currentRecord!._id, session?.jwtToken!)
      .then(() => {
        closeEditModal();
        message.success("The person has been updated successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const deletePerson = (_id: string) => {
    deletePersonApi(_id, session?.jwtToken!)
      .then(() => {
        message.success("The person has been deleted successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  // **********Modal******* //

  const showCreateModal = () => {
    setCreatePersonFormVisible(true);
  };

  const showEditModal = () => {
    setEditPersonFormVisible(true);
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
        open={createPersonFormVisible}
        title="Create Person"
        onCancel={closeCreateModal}
        onOk={createForm.submit}
      >
        <Form
          form={createForm}
          layout={"vertical"}
          onFinish={onFinishCreatePersonForm}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name={"name"}
                label={"Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Person Name"} />
              </Form.Item>
              <Form.Item
                name={"email"}
                label={"Email"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Person Email"} />
              </Form.Item>
              <Form.Item
                name={"phoneNumber"}
                label={"Phone number"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="number" placeholder={"Person Phone number"} />
              </Form.Item>
              <Form.Item
                name={"relatedClient"}
                label={"Client name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Select
                  style={{ width: '100%' }}
                  options={clients}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        okButtonProps={{ style: { backgroundColor: 'green' } }}
        width={"100vh"}
        open={editPersonFormVisible}
        title="Edit Person"
        onCancel={closeEditModal}
        onOk={editForm.submit}
      >
        <Form
          form={editForm}
          layout={"vertical"}
          onFinish={onFinishEditPersonForm}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name={"name"}
                label={"Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Person Name"} />
              </Form.Item>
              <Form.Item
                name={"email"}
                label={"Email"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Person Email"} />
              </Form.Item>
              <Form.Item
                name={"phoneNumber"}
                label={"Phone number"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="number" placeholder={"Person Phone number"} />
              </Form.Item>
              <Form.Item
                name={"relatedClient"}
                label={"Client name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Select
                  style={{ width: '100%' }}
                  options={clients}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Row>
        <h1 className='text-3xl font-bold'>PERSONS</h1>
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
            dataSource={allPersons}
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
                compare: (a: IPerson, b: IPerson) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Email"
              dataIndex="email"
              key="email"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IPerson, b: IPerson) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Phone Number"
              dataIndex="phoneNumber"
              key="phoneNumber"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IPerson, b: IPerson) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Related Client"
              dataIndex="relatedClient"
              key="relatedClient"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IPerson, b: IPerson) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Actions"
              fixed={"right"}
              render={(value: IPerson, record: IPerson) => {
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
                          deletePerson(value._id);
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

export default PersonsPage;
