import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome.tsx';
import NotFound from './pages/NotFound.tsx';
import Courses from './pages/Courses.tsx';
import ChatCourse from './pages/ChatCourse.tsx';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<ChatCourse />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
