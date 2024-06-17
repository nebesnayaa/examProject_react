import React, { useState, useEffect } from 'react';
import { getTags, addTag, deleteTag } from '../../services/api';
import { Form, Button, ListGroup } from 'react-bootstrap';

interface TagFormProps {
  onTagAdded: () => void;
}

const TagForm: React.FC<TagFormProps> = ({ onTagAdded }) => {
  const [tagName, setTagName] = useState('');
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await getTags();
      setTags(response.data);
    };
    fetchTags();
  }, []);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTag({ name: tagName });
    setTagName('');
    onTagAdded();
    const response = await getTags();
    setTags(response.data);
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTag(id);
      onTagAdded();
      const response = await getTags();
      setTags(response.data);
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  return (
    <div className="m-3 d-flex flex-column align-items-center">
      <Form onSubmit={handleAddTag} className='d-flex justify-content-center align-items-center gap-2'>
        <Form.Group controlId="formTagName">
          <Form.Control
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Введіть новий тег"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Додати тег
        </Button>
      </Form>
      <h2 className="mt-4">Теги</h2>
      <ListGroup className="mt-3 tags-container">
        {tags.map(tag => (
          <ListGroup.Item key={tag.id} className="d-flex justify-content-between align-items-center">
            {tag.name}
            <Button className="btn-sm btn-danger" onClick={() => handleDeleteTag(tag.id)}>
              Видалити
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TagForm;