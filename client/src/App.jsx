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
          <Route path="/" element={<Home />} />
          <Route path="/stake/:token" element={<Staking />} />
          <Route path="/unstake/:token" element={<Unstake />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/history" element={<StakeHistory />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>

        <Footer />

      </div>
    </EthProvider>
  );
}

export default App;
