import { EthProvider } from "./contexts/EthContext";
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Staking from './components/Staking';
import Unstake from './components/Unstake';
import Rewards from './components/Rewards';
import StakeHistory from './components/StakeHistory';
import Footer from './components/Footer';
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
