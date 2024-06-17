import React, { useEffect, useState } from 'react';
import { getTags, addTask, updateTask } from '../../services/api';
import { Button } from 'react-bootstrap';

interface TaskFormProps {
  task?: any;
  onSave: () => void;
}

interface Tag {
  id: number;
  name: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [date, setDate] = useState(task ? task.date : '');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState(task ? task.tags[0] : '');
  const [priority, setPriority] = useState(task ? task.priority : 'Високий');

  useEffect(() => {
    const fetchTags = async () => {
      const response = await getTags();
      setTags(response.data);
    };
    fetchTags();
  }, []);
  
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTag(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = { title, description, date, tags: [selectedTag], priority };
    if (task) {
      await updateTask(task.id, newTask);
    } else {
      await addTask(newTask);
    }
    onSave();
  };

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit} className="add-task-form">
          <div className="mb-3">
            <label htmlFor="inputName" className="form-label">Назва справи</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} id="inputName" className="form-control"/>
          </div>
          <div className="mb-3">
            <label htmlFor="inputDate" className="form-label">Дата/час виконання</label>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} id="inputDate" className="form-control"/>
          </div>
          <div className="mb-3">
            <label htmlFor="inputDescription" className="form-label">Опис справи</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} id="inputDescription" className="form-control"/>
          </div>
          <div className="mb-3 d-flex">
            <label className="form-label">Теги: </label>
            <div>
              {tags.map(tag => (
                <div key={tag.id} className="form-check mx-2">
                  <input
                    type="radio"
                    id={`tag-${tag.id}`}
                    value={tag.name}
                    checked={selectedTag === tag.name}
                    onChange={handleTagChange}
                    className="form-check-input"
                  />
                  <label htmlFor={`tag-${tag.id}`} className="form-check-label">
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label me-2">Пріоритет</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Високий">Високий</option>
              <option value="Середній">Середній</option>
              <option value="Низький">Низький</option>
            </select>
          </div>
          <Button type="submit">Зберегти</Button>
        </form>
      </div>
    </>
  );
};

export default TaskForm;
