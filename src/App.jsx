import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/index.jsx';
import Home from './components/Home/index.jsx';
import Stake from './components/Stake/index.jsx';
import Footer from './components/Footer/index.jsx';
import "./App.scss";

function App() {
  return (
    <div id="App" >

      <Header />

      <Routes>
        <Route path="/Family-staking/" element={<Home />} />
        <Route path="/Family-staking/stake" element={<Stake />} />
        <Route path="/Family-staking/*" element={<div>404</div>} />
      </Routes>

      <Footer />

    </div>
  );
}

export default App;
