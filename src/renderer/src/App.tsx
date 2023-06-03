import { VstTest, Welcome } from '@renderer/components';
import { Routes, Route, Link } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <>
      <nav className="mb-5 flex gap-2">
        <Link to="/">welcom</Link>
        <Link to="/vst">vst</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/vst" element={<VstTest />} />
      </Routes>
    </>
  );
}

export default App;
