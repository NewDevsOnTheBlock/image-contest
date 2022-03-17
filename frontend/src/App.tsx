import { ethers } from 'ethers';
import React, { ReactElement, useEffect, useState } from 'react'
import {Candidate, CandidateFormData} from './interfaces/Candidates';
import getContract from './utils/hooks/useGetContract';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';




function App(): ReactElement {
  const [contract, setContract] = useState()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [candidateForm, setCandidateForm] = useState<CandidateFormData>({name: '', imageHash: ''})
  const contractAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"
  
  //TODO: SUBSCRIBE TO EVENT --> 
  useEffect(() => {
    setContract(getContract(contractAddress))
  }, [])

  useEffect(() => {
    if (contract) {
      getAllCandidates()
    }
  }, [contract])

  async function registerCandidate() {
    const contracTName = await contract.registerCandidate("hannes", "https://gateway.pinata.cloud/ipfs/QmXMxbkj4Wbx8qn1PDZ4v91F9u6Y4YqHkieXmZDpPFKU4T");
    console.log(contracTName)
  }

  function vote(address: string) {
    if(!address) {
      throw Error("no address defined")
    }
    console.log('ADDRESSE ', address)
    contract.vote(address);
    getAllCandidates();
  }

  async function getAllCandidates() {
    const retrievedCandidates = await contract.fetchCandidates();
    const tempArray = [] as Candidate[]
    retrievedCandidates.forEach(candidate => {
      console.log(candidate)
      tempArray.push({ id: candidate.id, name: candidate.name, totalVote: candidate.totalVote, imageHash: candidate.imageHash, candidateAddress: candidate.candidateAddress })
    })
    console.log('tempArray', tempArray)
    setCandidates(tempArray)
  }

  return (
    <div className="border border-gray-50 rounded-xl w-full h-full p-20 shadow-xl">
      <form className='mb-5 p-2'>
          <TextField label="Name" />
          <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" type="file" />
            <Button className="mr-2" variant="contained" component="span">
              Upload
            </Button>
          </label>
          <Button
            onClick={() => registerCandidate()} 
            variant="contained"> Register as Candidate
          </Button>
      </form>
   

      <div className="flex flex-wrap ">
        <p>Candidates Length {candidates.length}</p>
        {/* {candidates.map(candidate => (
        <li key={candidate.id}>{candidate.name}</li>
      ))} */}
        {candidates?.length > 0 && candidates.map((candidate, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-lg">
            <img className="h-40 rounded w-full object-cover object-center mb-6" src={candidate.imageHash} alt="content" />
            <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">{candidate.name}</h3>
            <h2 className="text-lg text-gray-900 font-medium title-font mb-4">Votes: {candidate.totalVote.toNumber()}</h2>
            <p>{candidate.candidateAddress}</p>
            <Button onClick={() => vote(candidate.candidateAddress)} className="mr-2" variant="contained" component="span">
              Vote
            </Button>
          </div>
        ))}

      </div>
    </div>
  )
}

export default App



