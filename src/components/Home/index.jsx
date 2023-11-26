// == Import
// import PropTypesLib from 'prop-types';
import Hero from '../Hero';
import StakingList from '../StakingList';
import './home.scss';

// == Composant
function Home() {
  return (
    <main>
      <Hero />
      <StakingList />
    </main>
  );
}

// == Export
export default Home;
