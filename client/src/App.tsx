import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './components/Pages/TaskList';
import Nabvar from './components/Navbar';
import Tags from './components/Forms/TagForm';
import ProjectsPage from './components/Pages/ProjectsPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Nabvar/>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/tags" element={<Tags onTagAdded={() => {}} />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;