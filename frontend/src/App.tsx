import {ethers} from 'ethers';
import React, {ReactElement, useEffect, useState} from 'react'
import {Candidate, CandidateFormData} from './interfaces/Candidates';
import getContract from './utils/hooks/useGetContract';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import {CandidateCard} from "./components/CandidateCard";
import {Box, Container, Grid, Stack, styled, Typography} from "@mui/material";

function App(): ReactElement {
    const [contract, setContract] = useState()
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [candidateForm, setCandidateForm] = useState<CandidateFormData>({name: '', imageHash: ''})
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

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
        if (!address) {
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
            tempArray.push({
                id: candidate.id,
                name: candidate.name,
                totalVote: candidate.totalVote,
                imageHash: candidate.imageHash,
                candidateAddress: candidate.candidateAddress
            })
        })
        setCandidates(tempArray)
    }

    const Input = styled('input')({
        display: 'none',
    });

    return (
        <>
            <Container maxWidth="md" sx={{marginY: "2rem"}}>
                <form>
                    <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                        <TextField id="filled-basic" label="Name" variant="filled"/>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file"/>
                            <Button variant="outlined" component="span">
                                Upload image
                            </Button>
                        </label>
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" component="span" onClick={() => registerCandidate()}>
                                Register as Candidate
                            </Button>
                        </label>
                    </Stack>
                </form>

                <Typography variant="h6" component="h2">
                    Total registered Candidate: {candidates.length}
                </Typography>
            </Container>

            <Container sx={{bgcolor: "#F0F3F7"}}>
                <Box sx={{flexGrow: 1, paddingY: "3rem", paddingX: "2rem"}}>
                    <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}}>
                        {
                            candidates.map((candidate, index) =>
                                <Grid item sm={4} key={index}>
                                    <CandidateCard candidate={candidate} vote={vote}/>
                                </Grid>)
                        }
                    </Grid>
                </Box>
            </Container>

        </>
    )
}

export default App



