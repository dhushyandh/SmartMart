import BestSeller from '../components/BestSeller'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import NewLetterBox from '../components/NewLetterBox'
import OurPolicy from '../components/OurPolicy'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewLetterBox />
    </div>
  )
}

export default Home
