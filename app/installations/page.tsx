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
  Select,
  Tag
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
import { IInstallation } from "./Installation";
import { useInstallationStore } from "./InstallationsStore";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useSeasonStore } from "../seasons/SeasonsStore";
import { useClientStore } from "../clients/ClientsStore";
import { usePersonStore } from "../persons/PersonsStore";
import { useProductStore } from "../products/ProductsStore";
import { IPerson } from "../persons/Person";

const { Column } = Table;

const InstallationsPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/installations');
    }
  });

  const [dataSourceLoading, setDataSourceLoading] = useState(false);
  const [
    createInstallationFormVisible,
    setCreateInstallationFormVisible
  ] = useState(false);
  const [
    editInstallationFormVisible,
    setEditInstallationFormVisible
  ] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<IInstallation>();
  const [contacts, setContacts] = useState<IPerson[]>([])

  const [createForm] = useForm();
  const [editForm] = useForm();

  const allInstallations = useInstallationStore(
    (state) => state.installationsData
  );
  const getInstallationsApi = useInstallationStore((state) => state.getApi);
  const postInstallationApi = useInstallationStore(
    (state) => state.createInstallationApi
  );
  const putInstallationApi = useInstallationStore(
    (state) => state.updateInstallationApi
  );
  const deleteInstallationApi = useInstallationStore(
    (state) => state.deleteInstallationApi
  );

  const allSeasons = useSeasonStore((state) => state.seasonsData);
  const getSeasonsApi = useSeasonStore((state) => state.getApi);

  const allClients = useClientStore((state) => state.clientsData);
  const getClientsApi = useClientStore((state) => state.getApi);

  const allPersons = usePersonStore((state) => state.personsData);
  const getPersonsApi = usePersonStore((state) => state.getApi);

  const allProducts = useProductStore((state) => state.productsData);
  const getProductsApi = useProductStore((state) => state.getApi);

  const seasons: SelectProps['options'] = 
    allSeasons.map((season) => {
      return {
        value: season.year,
        label: season.year
      }
    });
  
  const clients: SelectProps['options'] = 
    allClients.map((client) => {
      return {
        value: client.name,
        label: client.name
      }
    });
  
  const products: SelectProps['options'] = 
    allProducts.map((product) => {
      return {
        value: product.commonName,
        label: product.commonName
      }
    });  

  useEffect(() => {
    if (allInstallations.length === 0) 
      getInstallations();

    if (allSeasons.length === 0)
      getSeasons();

    if (allClients.length === 0)
      getClients()
    
    if (allProducts.length === 0)
      getProducts()
    
    if (allPersons.length === 0)
      getPersons()
      // You should have the useEffect() subscribe to the props so that it runs whenever there is a change to either, 
      // instead of running a single-time after the first mount.
  }, [contacts]);

  const getInstallations = () => {
    setDataSourceLoading(true);
    getInstallationsApi(session?.jwtToken!);
    setDataSourceLoading(false);
  };

  const getSeasons = () => {
    setDataSourceLoading(true);
    getSeasonsApi(session?.jwtToken!);
    setDataSourceLoading(false);
  };

  const getPersons = () => {
    setDataSourceLoading(true);
    getPersonsApi(session?.jwtToken!);
    setDataSourceLoading(false);
  };

  const getClients = () => {
    setDataSourceLoading(true);
    getClientsApi(session?.jwtToken!)
    setDataSourceLoading(false);
  };

  const getProducts = () => {
    setDataSourceLoading(true);
    getProductsApi(session?.jwtToken!)
    setDataSourceLoading(false);
  };

  const closeCreateModal = () => {
    setCreateInstallationFormVisible(false);
    createForm.resetFields();
  };

  const getContacts = (contacts: string[]) => {
    return contacts.map((item) =>{
      <Tag key={item} color="blue">
        {item}
      </Tag>
    })
  }

  const closeEditModal = () => {
    editForm.resetFields();
    setEditInstallationFormVisible(false);
  };

  const onFinishCreateInstallationForm = (installation: IInstallation) => {
    postInstallationApi(installation, session?.jwtToken!)
      .then(() => {
        closeCreateModal();
        message.success("The installation has been created successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const onFinishEditInstallationForm = (installation: IInstallation) => {
    putInstallationApi(installation, currentRecord!._id, session?.jwtToken!)
      .then(() => {
        closeEditModal();
        message.success("The installation has been updated successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const deleteInstallation = (_id: string) => {
    deleteInstallationApi(_id, session?.jwtToken!)
      .then(() => {
        message.success("The installation has been deleted successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const handleClientChange = (client: string) => {
    setContacts(allPersons.filter((person: IPerson) => person.relatedClient === client));
  };

  // **********Modal******* //

  const showCreateModal = () => {
    setCreateInstallationFormVisible(true);
  };

  const showEditModal = () => {
    setEditInstallationFormVisible(true);
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
        width={"100vh"}
        open={createInstallationFormVisible}
        title="Create Installation"
        onCancel={closeCreateModal}
        onOk={createForm.submit}
      >
        <Form
          form={createForm}
          layout={"vertical"}
          onFinish={onFinishCreateInstallationForm}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name={"name"}
                label={"Installation Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Installation Name"} />
              </Form.Item>
              <Form.Item
                name={"productName"}
                label={"Product name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Select
                  style={{ width: '100%' }}
                  options={products}
                />
              </Form.Item>
              <Form.Item
                name={"seasonYear"}
                label={"Season year"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Select
                  style={{ width: '100%' }}
                  options={seasons}
                />
              </Form.Item>
              <Form.Item
                name={"clientName"}
                label={"Client name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Select
                  style={{ width: '100%' }}
                  onChange={handleClientChange}
                  options={clients}
                />
              </Form.Item>
              <Form.Item
                name={"contacts"}
                label={"Contact list"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Select
                  style={{ width: '100%' }}
                  mode="multiple"
                  options={contacts.map((contact) => ({label: contact.name, value: contact.name}))}
                />
              </Form.Item>
              <Form.Item
                name={"plantationName"}
                label={"Plantation Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Plantation Name"} />
              </Form.Item>
              <Form.Item
                name={"plotName"}
                label={"Plot Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Plot Name"} />
              </Form.Item>
              <Form.Item
                name={"installationDate"}
                label={"Installation Date"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="date" placeholder={"Installation Date"} />
              </Form.Item>
            </Col>
            <Col style={{ marginLeft: 10 }} span={10}>
              <Form.Item
                name={"activationDate"}
                label={"Activation Date"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="date" placeholder={"Activation Date"} />
              </Form.Item>
              <Form.Item
                name={"province"}
                label={"Province"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Province"} />
              </Form.Item>
              <Form.Item
                name={"municipality"}
                label={"Municipality"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Municipality"} />
              </Form.Item>
              <Form.Item
                name={"features"}
                label={"Features"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Features"} />
              </Form.Item>
              <Form.Item
                name={"projectionObservations"}
                label={"Projection Observations"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Projection Observations"} />
              </Form.Item>
              <Form.Item
                name={"installationObservations"}
                label={"Installation Observations"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Installation Observations"} />
              </Form.Item>
              <Form.Item
                name={"revisionObservations"}
                label={"Revision Observations"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Revision Observations"} />
              </Form.Item>
              <Form.Item
                name={"retreatObservations"}
                label={"Retreat Observations"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Retreat Observations"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        width={"100vh"}
        open={editInstallationFormVisible}
        title="Edit Client"
        onCancel={closeEditModal}
        onOk={editForm.submit}
      >
        <Form
          form={editForm}
          layout={"vertical"}
          onFinish={onFinishEditInstallationForm}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name={"name"}
                label={"Installation Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Installation Name"} />
              </Form.Item>
              <Form.Item
                name={"productName"}
                label={"Product Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Product Name"} />
              </Form.Item>
              <Form.Item
                name={"seasonYear"}
                label={"Season year"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Select
                  style={{ width: '100%' }}
                  options={seasons}
                />
              </Form.Item>
              <Form.Item
                name={"clientName"}
                label={"Client name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Select
                  style={{ width: '100%' }}
                  onChange={handleClientChange}
                  options={clients}
                />
              </Form.Item>
              <Form.Item
                name={"contacts"}
                label={"Contact list"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Select
                  style={{ width: '100%' }}
                  mode="multiple"
                  options={contacts.map((contact) => ({label: contact.name, value: contact.name}))}
                />
              </Form.Item>
              <Form.Item
                name={"plantationName"}
                label={"Plantation Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Plantation Name"} />
              </Form.Item>
              <Form.Item
                name={"plotName"}
                label={"Plot Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Plot Name"} />
              </Form.Item>
              <Form.Item
                name={"installationDate"}
                label={"Installation Date"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="date" placeholder={"Installation Date"} />
              </Form.Item>
              <Form.Item
                name={"activationDate"}
                label={"Activation Date"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="date" placeholder={"Activation Date"} />
              </Form.Item>
              <Form.Item
                name={"province"}
                label={"Province"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Province"} />
              </Form.Item>
              <Form.Item
                name={"municipality"}
                label={"Municipality"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Municipality"} />
              </Form.Item>
              <Form.Item
                name={"features"}
                label={"Features"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Characteristics"} />
              </Form.Item>
              <Form.Item
                name={"projectionObservations"}
                label={"Projection Observations"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Projection Observations"} />
              </Form.Item>
              <Form.Item
                name={"installationObservations"}
                label={"Installation Observations"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Installation Observations"} />
              </Form.Item>
              <Form.Item
                name={"revisionObservations"}
                label={"Revision Observations"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Revision Observations"} />
              </Form.Item>
              <Form.Item
                name={"retreatObservations"}
                label={"Retreat Observations"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Retreat Observations"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Row>
        <h1 className='text-3xl font-bold'>INSTALLATIONS</h1>
      </Row>

      <Row>
        <Col span={23} />
        <Col span={1}>
          <Button
            type={"primary"}
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
            dataSource={allInstallations}
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
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Season Year"
              dataIndex="seasonYear"
              key="year"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Client Name"
              dataIndex="clientName"
              key="client"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Contacts List"
              dataIndex="contacts"
              key="contacts"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
              render={(_, record) => record.contacts.map((item:string) => (<Tag key={item} color="blue">{item}</Tag>))}/>
            <Column
              align={"center"}
              title="Plantation Name"
              dataIndex="plantationName"
              key="plantation"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Plot Name"
              dataIndex="plotName"
              key="plot"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Installation Date"
              dataIndex="installationDate"
              key="installationDate"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Activation Date"
              dataIndex="activationDate"
              key="activationDate"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Province"
              dataIndex="province"
              key="province"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Municipality"
              dataIndex="municipality"
              key="municipality"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Features"
              dataIndex="features"
              key="features"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Projection Observations"
              dataIndex="projectionObservations"
              key="projectionObservations"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Installation Observations"
              dataIndex="installationObservations"
              key="installationObservations"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Revision Observations"
              dataIndex="revisionObservations"
              key="revisionObservations"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Retreat Observations"
              dataIndex="retreatObservations"
              key="retreatObservations"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: IInstallation, b: IInstallation) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Actions"
              fixed={"right"}
              render={(value: IInstallation, record: IInstallation) => {
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
                        title="Are you sure？"
                        onConfirm={() => {
                          deleteInstallation(value._id);
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

export default InstallationsPage;
