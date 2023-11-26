import { EthProvider } from "./contexts/EthContext/index.js";
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/index.jsx';
import Home from './components/Home/index.jsx';
import Staking from './components/Staking/index.jsx';
import Unstake from './components/Unstake/index.jsx';
import Rewards from './components/Rewards/index.jsx';
import StakeHistory from './components/StakeHistory/index.jsx';
import Footer from './components/Footer/index.jsx';
import "./App.scss";

function App() {
  return (
    <EthProvider>
      <div id="App" >

        <Header />

        <Routes>
          <Route path="/Family-staking/" element={<Home />} />
          <Route path="/Family-staking/stake/:token" element={<Staking />} />
          <Route path="/Family-staking/unstake/:token" element={<Unstake />} />
          <Route path="/Family-staking/rewards" element={<Rewards />} />
          <Route path="/Family-staking/history" element={<StakeHistory />} />
          <Route path="/Family-staking/*" element={<div>404</div>} />
        </Routes>

        <Footer />

      </div>
    </EthProvider>
  );
}

export default App;
