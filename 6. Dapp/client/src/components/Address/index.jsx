import useEth from "../../contexts/EthContext/useEth";

function Address() {
  const { state : { accounts, networkID }} = useEth();

  const getBlockchainName = (id) => {
    const known_networks = { "1658047570712" : "Ganache", "1" : "Mainnet", "3" : "Ropsten"}
    return known_networks[id];
  } 

  return (
    <div className="header">
      <strong>Address</strong> { accounts && accounts[0] }
      <br/>
      <strong>Network</strong> { networkID && getBlockchainName(networkID) }
    </div>
  );
}

export default Address;