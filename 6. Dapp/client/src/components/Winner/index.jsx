import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Winner(props) {
  const { state : { contract, accounts }} = useEth();
  const [ winningProposal, setWinningProposal ] = useState(null);
  const [ winningProposalDesc, setWinningProposalDesc ] = useState(null);

  useEffect( 
    () => { async function setup() {
        try {
          let winningProp = await contract.methods.winningProposalID().call(); 
          setWinningProposal(winningProp);
          let desc = await contract.methods.getOneProposal(winningProp).call({ from: accounts[0] });
          setWinningProposalDesc(desc[0]);
      } catch (error) {
          alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
      };
      }
    setup();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 return (
    <div>
        <h1> Winning Proposal</h1>
        <p> #{winningProposal} : {winningProposalDesc} </p>
    </div>
  );
}

export default Winner;