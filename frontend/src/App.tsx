import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CustomerLanding from './views/CustomerLanding';
import CustomerView from './views/CustomerView';
import TrackView from './views/TrackView';
import FeedbackView from './views/FeedbackView';
import DashboardView from './views/DashboardView';

function App() {
  return (
    <BrowserRouter>
      <div className="font-sans antialiased text-slate-900">
        <nav className="fixed bottom-4 right-4 z-50 flex gap-2">
          <Link to="/" className="px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-semibold hover:bg-slate-50">Home</Link>
          <Link to="/admin" className="px-3 py-1 bg-slate-800 text-white shadow-sm rounded-full text-xs font-semibold hover:bg-slate-700">Admin</Link>
        </nav>

        <Routes>
          <Route path="/" element={<CustomerLanding />} />
          <Route path="/voice" element={<CustomerView />} />
          <Route path="/track" element={<TrackView />} />
          <Route path="/feedback" element={<FeedbackView />} />
          <Route path="/admin" element={<DashboardView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
