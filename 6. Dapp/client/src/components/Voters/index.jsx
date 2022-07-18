import useEth from '../../contexts/EthContext/useEth';
import { useEffect, useState } from 'react';

function Voters(props) {
      const {
            state: { contract, accounts },
      } = useEth();

      const [ voters, setVoters ] = useState([]);

      useEffect(() => { // Initially fill with past events 
            async function setup() {
                  let options = {
                        fromBlock: 0,
                        toBlock: 'latest',
                  };
                 let voters = (
                        await contract.getPastEvents('VoterRegistered', options)
                  ).map((event) => event.returnValues.voterAddress);

                  setVoters(voters);
            }
            setup();
             // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      useEffect(() => {
            async function setup() {
                  props.setIsVoter(voters.includes(accounts[0]));
            }
            setup();
             // eslint-disable-next-line react-hooks/exhaustive-deps
      });

      let options = {
            fromBlock: 'latest',        
      };

      contract.events.VoterRegistered(options)
            .on('data', event => {
                   let old = voters.slice(); 
                   old.push(event.returnValues[0]); 
                   setVoters(old);
            })

      const addVoter = async () => {
            let voterAddr = document.getElementById('newVoter').value;
            try {
                  await contract.methods
                        .addVoter(voterAddr)
                        .send({ from: accounts[0] });
                  document.getElementById('newVoter').value = '';
            } catch (e) {
                  alert('This voter is not registered !');
            }
      };

      const registeredVoters = (
            <div>
                  <h1>Registered voters</h1>
                  {voters.length !== 0 ? (
                        <ul>
                              {voters.map((addr) => (
                                    <li key={addr}>{addr}</li>
                              ))}
                        </ul>
                  ) : (
                        <ul>No voter registered</ul>
                  )}
            </div>
      );

      return (
            <div>
                  {registeredVoters}
                  {(props.isOwner && props.currentWorkflowState===0) &&
                  <div >
                        <input
                              type="text"
                              id="newVoter"
                              placeholder="Voter address"
                        />
                        <button onClick={addVoter}>Add voter</button>
                        <br />
                  </div>}
            </div>
      );
}

export default Voters;
