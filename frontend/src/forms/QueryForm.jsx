import { Form, Input, Select, Button, Row, Col, Card } from 'antd';
import { useEffect } from 'react';
import SelectAsync from '@/components/SelectAsync';
import useLanguage from '@/locale/useLanguage';

const { TextArea } = Input;
const { Option } = Select;

export default function QueryForm({ current = null, onSubmit, loading = false }) {
  const translate = useLanguage();
  const [form] = Form.useForm();

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        customer: current.customer?._id,
        description: current.description,
        status: current.status,
        priority: current.priority,
        resolution: current.resolution,
        assignedTo: current.assignedTo?._id,
      });
    }
  }, [current, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Card title={current ? 'Edit Query' : 'Create New Query'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'Open',
          priority: 'Medium',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="customer"
              label="Customer"
              rules={[
                {
                  required: true,
                  message: 'Please select a customer',
                },
              ]}
            >
              <SelectAsync
                entity="client"
                displayLabels={['name']}
                placeholder="Select a customer"
                withRedirect={false}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="assignedTo" label="Assigned To">
              <SelectAsync
                entity="admin"
                displayLabels={['name']}
                placeholder="Select an admin"
                withRedirect={false}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: 'Please enter a description',
            },
            {
              max: 1000,
              message: 'Description cannot exceed 1000 characters',
            },
          ]}
        >
          <TextArea rows={4} placeholder="Enter query description..." maxLength={1000} showCount />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[
                {
                  required: true,
                  message: 'Please select a status',
                },
              ]}
            >
              <Select placeholder="Select status">
                <Option value="Open">Open</Option>
                <Option value="InProgress">In Progress</Option>
                <Option value="Closed">Closed</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="priority"
              label="Priority"
              rules={[
                {
                  required: true,
                  message: 'Please select a priority',
                },
              ]}
            >
              <Select placeholder="Select priority">
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
                <Option value="Critical">Critical</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="resolution" label="Resolution">
          <TextArea
            rows={3}
            placeholder="Enter resolution (optional)..."
            maxLength={2000}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {current ? 'Update Query' : 'Create Query'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
