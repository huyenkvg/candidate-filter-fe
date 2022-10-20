import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from './views/home/Home';
import './App.css';
import Login from './views/login/Login';
import AntTable from './components/table/AntTable';
import TuyenSinh from './views/tuyen-sinh/TuyenSinh';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<TuyenSinh/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AppLayout>
    </Router> 

  );
}

export default App;
