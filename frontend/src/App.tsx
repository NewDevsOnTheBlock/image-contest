import { ethers } from 'ethers';
import React, { ReactElement, useEffect, useState } from 'react'
import {Candidate, CandidateFormData} from './interfaces/Candidates';
import getContract from './utils/hooks/useGetContract';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import {CandidateCard} from "./components/CandidateCard";
import {Box, Grid} from "@mui/material";

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
    <div className="container">
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

      <p>Total registered Candidate: {candidates.length}</p>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {
            candidates.map((candidate, index) =>
              <Grid item xs={2} sm={4} md={4} key={index}>
                <CandidateCard candidate={candidate} vote={vote}/>
              </Grid>)
          }
        </Grid>
      </Box>
    </div>
  )
}

export default App



