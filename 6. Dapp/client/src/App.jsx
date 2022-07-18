import { EthProvider } from "./contexts/EthContext";
//import Intro from "./components/Intro/";
import Voting from "./components/Voting";
import Address from "./components/Address";

import "./App.css";

function App() {

  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <Address/>
          <hr />
          <Voting />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
