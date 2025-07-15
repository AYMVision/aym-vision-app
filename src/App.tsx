import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome.tsx';
import NotFound from './pages/NotFound.tsx';
import Stories from './pages/Stories.tsx';
import Story from './pages/Story.tsx';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:courseId" element={<Story />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </QueryClientProvider>
);

export default App;
