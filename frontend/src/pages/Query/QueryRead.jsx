import { useState, useEffect } from 'react';
import { Card, Button, Input, List, Typography, Space, Tag, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, RobotOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import request from '@/request';
import ReadItem from '@/components/ReadItem';
import useLanguage from '@/locale/useLanguage';

const { TextArea } = Input;
const { Text, Title } = Typography;

export default function QueryRead() {
  const translate = useLanguage();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    fetchQuery();
  }, [id]);

  const fetchQuery = async () => {
    setLoading(true);
    try {
      const response = await request.read({ entity: 'query', id });
      if (response.success) {
        setQuery(response.result);
      }
    } catch (error) {
      message.error('Failed to fetch query');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      message.error('Please enter a note');
      return;
    }

    setAddingNote(true);
    try {
      const response = await request.post({
        entity: 'query',
        id,
        subEntity: 'notes',
        jsonData: { content: newNote },
      });

      if (response.success) {
        message.success('Note added successfully');
        setNewNote('');
        fetchQuery();
      }
    } catch (error) {
      message.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await request.delete({
        entity: 'query',
        id,
        subEntity: `notes/${noteId}`,
      });

      if (response.success) {
        message.success('Note deleted successfully');
        fetchQuery();
      }
    } catch (error) {
      message.error('Failed to delete note');
    }
  };

  const handleGenerateAISummary = async () => {
    setGeneratingAI(true);
    try {
      const response = await request.post({
        entity: 'query',
        id,
        subEntity: 'ai-summary',
      });

      if (response.success) {
        message.success('AI summary generated successfully');
        fetchQuery();
      }
    } catch (error) {
      message.error('Failed to generate AI summary');
    } finally {
      setGeneratingAI(false);
    }
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

  const readColumns = [
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
  ];

  if (loading) {
    return <Spin size="large" style={{ width: '100%', margin: '50px 0' }} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <ReadItem
        config={{
          entity: 'query',
          ENTITY_NAME: translate('Query'),
          fields: readColumns,
        }}
        selectedItem={query}
      />

      {query && (
        <Card title="Notes Management" style={{ marginTop: '20px' }}>
          {/* AI Summary Section */}
          <Card
            type="inner"
            title="AI Summary"
            style={{ marginBottom: '20px' }}
            extra={
              <Button
                type="primary"
                icon={<RobotOutlined />}
                onClick={handleGenerateAISummary}
                loading={generatingAI}
                disabled={!query.notes || query.notes.length === 0}
              >
                Generate AI Summary
              </Button>
            }
          >
            <Text>{query.aiSummary || 'No AI summary generated yet'}</Text>
          </Card>

          {/* Add Note Section */}
          <Card type="inner" title="Add New Note" style={{ marginBottom: '20px' }}>
            <Space.Compact style={{ display: 'flex', width: '100%' }}>
              <TextArea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note here..."
                rows={3}
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddNote}
                loading={addingNote}
                style={{ height: 'auto' }}
              >
                Add Note
              </Button>
            </Space.Compact>
          </Card>

          {/* Notes List */}
          <Card type="inner" title={`Notes (${query.notes?.length || 0})`}>
            <List
              dataSource={query.notes || []}
              renderItem={(note) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>{note.createdBy?.name || 'Unknown'}</Text>
                        <Text type="secondary">{new Date(note.created).toLocaleString()}</Text>
                      </div>
                    }
                    description={note.content}
                  />
                </List.Item>
              )}
              locale={{ emptyText: 'No notes yet' }}
            />
          </Card>
        </Card>
      )}
    </div>
  );
}
