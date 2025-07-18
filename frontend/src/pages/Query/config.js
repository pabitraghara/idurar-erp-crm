export const fields = {
  customer: {
    type: 'async',
    label: 'Customer',
    displayLabels: ['name'],
    dataIndex: ['customer', 'name'],
    entity: 'client',
    required: true,
  },
  description: {
    type: 'textarea',
    label: 'Description',
    required: true,
    maxLength: 1000,
  },
  status: {
    type: 'select',
    label: 'Status',
    options: [
      { value: 'Open', label: 'Open' },
      { value: 'InProgress', label: 'In Progress' },
      { value: 'Closed', label: 'Closed' },
    ],
    required: true,
  },
  priority: {
    type: 'select',
    label: 'Priority',
    options: [
      { value: 'Low', label: 'Low' },
      { value: 'Medium', label: 'Medium' },
      { value: 'High', label: 'High' },
      { value: 'Critical', label: 'Critical' },
    ],
    required: true,
  },
  resolution: {
    type: 'textarea',
    label: 'Resolution',
    maxLength: 2000,
  },
  assignedTo: {
    type: 'async',
    label: 'Assigned To',
    displayLabels: ['name'],
    dataIndex: ['assignedTo', 'name'],
    entity: 'admin',
    required: false,
  },
};

export const searchConfig = {
  displayLabels: ['description', 'customer.name'],
  searchFields: 'description,customer.name',
  outputValue: '_id',
};

export const deleteModalLabels = ['description', 'customer.name'];

export const dataTableColumns = [
  {
    title: 'Customer',
    dataIndex: ['customer', 'name'],
    key: 'customer',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
  },
  {
    title: 'Created',
    dataIndex: 'created',
    key: 'created',
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
  },
];
