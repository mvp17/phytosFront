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
import { ISeason } from "./Season";
import { useSeasonStore } from "./SeasonsStore";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';


const { Column } = Table;


const SeasonsPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/seasons');
    }
  });

  const [dataSourceLoading, setDataSourceLoading] = useState(false);
  const [createSeasonFormVisible, setCreateSeasonFormVisible] = useState(false);
  const [editSeasonFormVisible, setEditSeasonFormVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ISeason>();

  const [createForm] = useForm();
  const [editForm] = useForm();

  const allSeasons = useSeasonStore((state) => state.seasonsData);
  const callGetApi = useSeasonStore((state) => state.getAll);
  const callPostApi = useSeasonStore((state) => state.createSeason);
  const callPutApi = useSeasonStore((state) => state.updateSeason);
  const callDeleteApi = useSeasonStore((state) => state.deleteSeason);

  useEffect(() => {
    if (allSeasons.length === 0) {
      setDataSourceLoading(true);
      callGetApi();
      setDataSourceLoading(false);
    }
  }, []);

  const closeCreateModal = () => {
    setCreateSeasonFormVisible(false);
    createForm.resetFields();
  };
  const closeEditModal = () => {
    editForm.resetFields();
    setEditSeasonFormVisible(false);
  };

  const onFinishCreateSeasonForm = (season: ISeason) => {
    callPostApi(season, session?.jwtToken!)
      .then(() => {
        closeCreateModal();
        message.success("The season has been created successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const onFinishEditSeasonForm = (season: ISeason) => {
    callPutApi(season, currentRecord!._id, session?.jwtToken!)
      .then(() => {
        closeEditModal();
        message.success("The season has been updated successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  const deleteSeason = (_id: string) => {
    callDeleteApi(_id, session?.jwtToken!)
      .then(() => {
        message.success("The season has been deleted successfully.");
      })
      .catch((err) => {
        message.error(err.toString());
      });
  };

  // **********Modal******* //

  const showCreateModal = () => {
    setCreateSeasonFormVisible(true);
  };

  const showEditModal = () => {
    setEditSeasonFormVisible(true);
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
        open={createSeasonFormVisible}
        title="Create Season"
        onCancel={closeCreateModal}
        onOk={createForm.submit}
      >
        <Form
          form={createForm}
          layout={"vertical"}
          onFinish={onFinishCreateSeasonForm}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name={"year"}
                label={"Year"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="number" placeholder={"Season Year number"} />
              </Form.Item>
              <Form.Item
                name={"color"}
                label={"Color"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="color" placeholder={"Season color"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        okButtonProps={{ style: { backgroundColor: 'green' } }}
        width={"100vh"}
        open={editSeasonFormVisible}
        title="Edit Season"
        onCancel={closeEditModal}
        onOk={editForm.submit}
      >
        <Form
          form={editForm}
          layout={"vertical"}
          onFinish={onFinishEditSeasonForm}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name={"year"}
                label={"Year"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="number" placeholder={"Season Year number"} />
              </Form.Item>
              <Form.Item
                name={"color"}
                label={"Color"}
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input type="color" placeholder={"Season color"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Row>
        <h1 className='text-3xl font-bold'>SEASONS</h1>
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
            dataSource={allSeasons}
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
              title="Year"
              dataIndex="year"
              key="year"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: ISeason, b: ISeason) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
            />
            <Column
              align={"center"}
              title="Color"
              dataIndex="color"
              key="color"
              sortDirections={["descend", "ascend"]}
              sorter={{
                compare: (a: ISeason, b: ISeason) =>
                  alphabeticalSort(a._id, b._id),
                multiple: 3
              }}
              filterIcon={() => <SearchOutlined />}
              render={(value) => <Input type="color" value={value} disabled />}
            />
            <Column
              align={"center"}
              title="Actions"
              fixed={"right"}
              render={(value: ISeason, record: ISeason) => {
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
                          deleteSeason(value._id);
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

export default SeasonsPage;
