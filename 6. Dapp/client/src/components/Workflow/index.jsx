import { useState, useEffect } from 'react';
import useEth from '../../contexts/EthContext/useEth';

/* Ce composant permet pour l'owner du contrat d'avancer dans le workflow et de faire remonter l'état courant au composant Voting par la methode props.changeState*/
function Workflow(props) {
      const {
            state: { contract, accounts },
      } = useEth();
      const [value, setValue] = useState(0);
      const [owned, setOwned] = useState(false);

      const displayStates = [
            'Registering Voters',
            'Proposals Registration Started',
            'Proposals Registration Ended',
            'Voting Session Started',
            'Voting Session Ended',
            'Votes Tallied',
      ];

      useEffect(() => {
            async function setup() {
                  try {
                        let currentWorkflowStatus = await contract.methods
                              .workflowStatus()
                              .call();
                        setValue(currentWorkflowStatus);

                        props.changeState(parseInt(currentWorkflowStatus));

                        const owner = await contract.methods.owner().call();
                        setOwned(accounts[0] === owner);
                        props.setOwner(owned);
                  } catch (error) {
                        alert(
                              `Failed to load web3, accounts, or contract. Check console for details.`
                        );
                        console.error(error);
                  }
            }
            setup();
      });

      const changeToNextState = async () => {
            if (value === '5') return; // 5 is last state in workflow
            let methodForNextStatus = [
                  contract.methods.startProposalsRegistering,
                  contract.methods.endProposalsRegistering,
                  contract.methods.startVotingSession,
                  contract.methods.endVotingSession,
                  contract.methods.tallyVotes,
            ];
            await methodForNextStatus[value]().send({ from: accounts[0] });
            let currentWorkflowStatus = await contract.methods
                  .workflowStatus()
                  .call();
            setValue(currentWorkflowStatus);
      };

      return (
            <div>
                  <h1> Current state</h1>
                  <div className="App">
                        <p>{displayStates[value]} </p>
                  </div>
                  <div className="App">
                        <button
                              onClick={changeToNextState}
                              hidden={!owned || value === '5'}
                        >
                              Next State
                        </button>
                  </div>
            </div>
      );
}

export default Workflow;
