import useEth from '../../contexts/EthContext/useEth';
import { useEffect, useState } from 'react';

function Proposals(props) {
      const {
            state: { accounts, contract },
      } = useEth();

      const [proposals, setProposals] = useState([]);

      async function updateProposals() {
            let options = {
                  fromBlock: 0,
                  toBlock: 'latest',
            };

            let _proposals = [];

            const idProposalList = (
                  await contract.getPastEvents('ProposalRegistered', options)
            ).map((prop) => prop.returnValues.proposalId);

            for (let id of idProposalList) {
                  let proposal = await contract.methods
                        .getOneProposal(id)
                        .call({ from: accounts[0] });
                  _proposals.push([id, proposal.description, parseInt(proposal.voteCount)]);
            }

            setProposals(_proposals);
      }

      useEffect( // fill initial proposals
            () => {
                  updateProposals();
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [props.workflowState]
      );

      const addProposal = async () => {
            let proposal = document.getElementById('newProposal').value;
            await contract.methods
                  .addProposal(proposal)
                  .send({ from: accounts[0] });
            document.getElementById('newProposal').value = '';
            updateProposals();
      };

      const voteForProposal = async () => {
            var radioButtons = document.getElementsByName('rad');
            for (var i = 0; i < radioButtons.length; i++) {
                  if (radioButtons[i].checked) {
                        await contract.methods
                              .setVote(parseInt(radioButtons[i].value))
                              .send({ from: accounts[0] });
                        break;
                  }
            }
      };

      const displayProposals = (
            <div>
                  <h1>Registered Proposals</h1>
                  {proposals.length === 0 ? 
                        (
                        <ul>No proposal registered</ul>
                  ) : (
                        <ul>
                              {proposals.map((prop) => (
                                    <li key={prop[0]}>{prop[1]+((props.workflowState===5)?" (votes : "+prop[2]+")":"")}</li>
                              ))}
                        </ul>
                    ) 
                  }
                         
            </div>
      );

      const createNewProposal = (
            <div>
                  <br />
                  <input
                        type="text"
                        id="newProposal"
                        placeholder="Text of a new proposal"
                  />
                  <button onClick={addProposal}>Create new proposal</button>
            </div>
      );

      const selectProposal = (
            <div>
                  <h1>Please vote for a proposal</h1>
                  <fieldset>
                        {proposals.map((prop) => (
                              <div key={prop[0]}>
                                    <input
                                          type="radio"
                                          name="rad"
                                          value={prop[0]}
                                    />
                                    {prop[1]}
                              </div>
                        ))}
                  </fieldset>
                  <button onClick={voteForProposal}>Vote</button>
            </div>
      );

      return (
            <div>
                  {props.workflowState >=1 && !(props.isVoter && props.workflowState===3) && displayProposals} 
                  {props.workflowState === 1 && props.isVoter && createNewProposal}
                  {props.workflowState === 3 && props.isVoter && selectProposal}
            </div>
      );
}

export default Proposals;
