import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';

function App() {
  console.log('🎨 App component rendering');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* More routes will be added here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
