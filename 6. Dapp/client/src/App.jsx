import { EthProvider } from "./contexts/EthContext";
import Voting from "./components/Voting";
import Address from "./components/Address";

import "./App.css";

function App() {

  document.title = "Voting frontend"

  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <Address/>
          <hr/>
          <Voting />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
