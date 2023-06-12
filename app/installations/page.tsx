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
import { IInstallation } from "./Installation";
import { useInstallationStore } from "./InstallationsStore";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

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

  const [createForm] = useForm();
  const [editForm] = useForm();

  const allInstallations = useInstallationStore(
    (state) => state.installationsData
  );
  const callGetApi = useInstallationStore((state) => state.getApi);
  const callPostApi = useInstallationStore(
    (state) => state.createInstallationApi
  );
  const callPutApi = useInstallationStore(
    (state) => state.updateInstallationApi
  );
  const callDeleteApi = useInstallationStore(
    (state) => state.deleteInstallationApi
  );

  useEffect(() => {
    if (allInstallations.length === 0) {
      setDataSourceLoading(true);
      callGetApi(session?.jwtToken!);
      setDataSourceLoading(false);
    }
  }, []);

  const closeCreateModal = () => {
    setCreateInstallationFormVisible(false);
    createForm.resetFields();
  };
  const closeEditModal = () => {
    editForm.resetFields();
    setEditInstallationFormVisible(false);
  };

  const onFinishCreateInstallationForm = (installation: IInstallation) => {
    callPostApi(installation, session?.jwtToken!)
      .then(() => {
        closeCreateModal();
        message.success("The installation has been created successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const onFinishEditInstallationForm = (installation: IInstallation) => {
    callPutApi(installation, currentRecord!._id, session?.jwtToken!)
      .then(() => {
        closeEditModal();
        message.success("The installation has been updated successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const deleteInstallation = (_id: string) => {
    callDeleteApi(_id, session?.jwtToken!)
      .then(() => {
        message.success("The installation has been deleted successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
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
                label={"Product Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Product Name"} />
              </Form.Item>
              <Form.Item
                name={"seasonYear"}
                label={"Season Year"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Season Year"} />
              </Form.Item>
              <Form.Item
                name={"clientName"}
                label={"Client Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Client Name"} />
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
                name={"characteristics"}
                label={"Characteristics"}
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
                label={"Season Year"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Season Year"} />
              </Form.Item>
              <Form.Item
                name={"clientName"}
                label={"Client Name"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="text" placeholder={"Client Name"} />
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
                name={"characteristics"}
                label={"Characteristics"}
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
