import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields, searchConfig, deleteModalLabels, dataTableColumns } from './config';
import { Tag } from 'antd';

import useLanguage from '@/locale/useLanguage';

export default function Query() {
  const translate = useLanguage();
  const entity = 'query';

  const Labels = {
    PANEL_TITLE: translate('query_management'),
    DATATABLE_TITLE: translate('query_list'),
    ADD_NEW_ENTITY: translate('add_new_query'),
    ENTITY_NAME: translate('query'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  const getStatusColor = (status) => {
    const colors = {
      Open: 'red',
      InProgress: 'blue',
      Closed: 'green',
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: 'green',
      Medium: 'orange',
      High: 'red',
      Critical: 'purple',
    };
    return colors[priority] || 'default';
  };

  const enhancedDataTableColumns = dataTableColumns.map((column) => {
    if (column.key === 'customer') {
      return {
        ...column,
        render: (customer) => customer?.name || 'N/A',
      };
    }
    if (column.key === 'description') {
      return {
        ...column,
        render: (description) =>
          description?.substring(0, 50) + (description?.length > 50 ? '...' : ''),
      };
    }
    if (column.key === 'status') {
      return {
        ...column,
        render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      };
    }
    if (column.key === 'priority') {
      return {
        ...column,
        render: (priority) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
      };
    }
    if (column.key === 'created') {
      return {
        ...column,
        render: (date) => new Date(date).toLocaleDateString(),
      };
    }
    if (column.key === 'notes') {
      return {
        ...column,
        render: (notes) => notes?.length || 0,
      };
    }
    return column;
  });

  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
    dataTableColumns: enhancedDataTableColumns,
    readColumns: [
      {
        title: 'Customer',
        dataIndex: ['customer', 'name'],
      },
      {
        title: 'Description',
        dataIndex: 'description',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        render: (priority) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
      },
      {
        title: 'Resolution',
        dataIndex: 'resolution',
      },
      {
        title: 'Assigned To',
        dataIndex: ['assignedTo', 'name'],
      },
      {
        title: 'Created',
        dataIndex: 'created',
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: 'Notes Count',
        dataIndex: 'notes',
        render: (notes) => notes?.length || 0,
      },
    ],
  };

  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}
