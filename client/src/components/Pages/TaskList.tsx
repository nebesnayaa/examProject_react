import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../../services/api';
import TaskForm from '../Forms/TaskForm';
import { Modal, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import moment from 'moment';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<string>('Всі справи');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await getTasks();
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleSave = () => {
    setEditingTask(null);
    setShowModal(false);
    const fetchTasks = async () => {
      const response = await getTasks();
      setTasks(response.data);
    };
    fetchTasks();
  };

  const formatDate = (date: string) => {
    return moment(date).format('DD.MM.YYYY HH:mm');
  };

  const handleFilterChange = (selectedFilter: string | null) => {
    if (selectedFilter) {
      setFilter(selectedFilter);
    }
  };

  const filterTasks = (tasks: any[]) => {
    const now = moment();
    let filteredTasks = tasks;

    if (filter === 'На сьогодні') {
      filteredTasks = filteredTasks.filter(task => moment(task.date).isSame(now, 'day'));
    } 
    else if (filter === 'На тиждень') {
      filteredTasks = filteredTasks.filter(task => moment(task.date).isSame(now, 'week'));
    } 
    else if (filter === 'На місяць') {
      filteredTasks = filteredTasks.filter(task => moment(task.date).isSame(now, 'month'));
    }

    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        task.priority.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filteredTasks;
  };

  const sortTasksByDate = (tasks: any[]) => {
    return tasks.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  };

  const filteredTasks = sortTasksByDate(filterTasks(tasks));

  return (
    <div className='mx-4 my-3'>
      
      <div className="my-4 d-flex justify-content-between gap-2">
        <Button onClick={handleAdd} className="btn-success">Нова справа</Button>
        <Form>
          <Form.Group controlId="searchQuery" className="search">
            <Form.Control
              type="text"
              placeholder="Пошук за назвою, описом, тегами або пріоритетом"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
        </Form>
      </div>
      <div className="mt-4 d-flex justify-content-center align-items-center gap-2">
        <h2>Список справ</h2>
          <DropdownButton id="dropdown-basic-button" title={`${filter}`} onSelect={handleFilterChange}>
            <Dropdown.Item eventKey="Всі справи">Всі справи</Dropdown.Item>
            <Dropdown.Item eventKey="На сьогодні">На сьогодні</Dropdown.Item>
            <Dropdown.Item eventKey="На тиждень">На тиждень</Dropdown.Item>
            <Dropdown.Item eventKey="На місяць">На місяць</Dropdown.Item>
          </DropdownButton>
        </div>
      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">Назва</th>
            <th scope="col">Дата</th>
            <th scope="col">Теги</th>
            <th scope="col">Пріоритет</th>
            <th scope="col">Дії</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={task.id}>
              <th scope="row">{index + 1}</th>
              <td>{task.title}</td>
              <td>{formatDate(task.date)}</td>
              <td>{task.tags.join(', ')}</td>
              <td>{task.priority}</td>
              <td>
                <Button onClick={() => handleEdit(task)} className="me-2 btn-sm btn-warning">Редагувати</Button>
                <Button onClick={() => handleDelete(task.id)} className="btn-sm btn-danger">Видалити</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTask ? 'Редагувати справу' : 'Додати справу'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm task={editingTask} onSave={handleSave} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskList;