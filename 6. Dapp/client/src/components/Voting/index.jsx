import { useState } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import Workflow from '../Workflow';
import Proposals from '../Proposals';
import Voters from '../Voters';
import Winner from '../Winner';
import NoticeNoArtifact from './NoticeNoArtifact';
import NoticeWrongNetwork from './NoticeWrongNetwork';

function Voting() {
      const { state } = useEth();
      const [currentWorkflowState, setCurrentWorkflowState] = useState(0);
      //const [voters, setVoters] = useState([]);
      const [isVoter, setIsVoter] = useState(false); // indicates if connected account is a registered voter
      const [owner, setOwner] = useState(false);

      const voting = (
            <>
                  <div className="container">
                        <Workflow
                              changeState={setCurrentWorkflowState}
                              setOwner={setOwner}
                        />
                        <Voters
                              currentWorkflowState={currentWorkflowState}
                              isOwner={owner}
                              //setVoters={setVoters}
                              //voters={voters}
                              setIsVoter={setIsVoter}
                        />
                        {currentWorkflowState >= 1 && (
                              <Proposals
                                    workflowState={currentWorkflowState}
                                    isVoter={isVoter}
                              />
                        )}
                        {currentWorkflowState >= 5 && <Winner />}
                  </div>
            </>
      );

      return (
            <div className="artifacts">
                  {!state.artifact ? (
                        <NoticeNoArtifact />
                  ) : !state.contract ? (
                        <NoticeWrongNetwork />
                  ) : (
                        voting
                  )}
            </div>
      );
}

export default Voting;
