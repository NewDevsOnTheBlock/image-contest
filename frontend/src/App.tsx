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
    const [candidateFormData, setCandidateFormData] = useState<CandidateFormData>({name: '', imageHash: ''})
    const contractAddress = "0xf5059a5D33d5853360D16C683c16e67980206f36"

    //TODO: SUBSCRIBE TO EVENT -->
    useEffect(() => {
        setContract(getContract(contractAddress))
    }, [])

    useEffect(() => {
        if (contract) {
            getAllCandidates().then()
        }
    }, [contract])

    async function registerCandidate() {
        const name = candidateFormData.name;
        const contracTName = await contract.registerCandidate(name, "https://gateway.pinata.cloud/ipfs/QmXMxbkj4Wbx8qn1PDZ4v91F9u6Y4YqHkieXmZDpPFKU4T");
        console.log('register', contracTName)
        contract.on("candidateCreated", async function (evt) {
            getAllCandidates().then()
        })
    }

    async function vote(address: string) {
        if (!address) {
            throw Error("no address defined")
        }

        await contract.vote(address);
        contract.on("Voted", async function (evt) {
            getAllCandidates().then()
        })
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

    const handleChange = (event: any) => {
        setCandidateFormData((prevState) => {
            return {
                ...prevState,
                [event.target.name]: event.target.value
            }
        });
    }

    return (
        <>
            <Container maxWidth="md" sx={{marginY: "2rem"}}>
                <Box component="form">
                    <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                        <TextField id="filled-basic"
                                   label="Name" variant="filled"
                                   name="name"
                                   value={candidateFormData.name}
                                   onChange={handleChange}/>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file"/>
                            <Button variant="outlined" component="span">
                                Upload image
                            </Button>
                        </label>
                        <Button variant="contained" component="span" onClick={() => registerCandidate()}>
                            Register as Candidate
                        </Button>
                    </Stack>
                </Box>

                <Typography variant="h6" component="h2">
                    Total registered Candidate: {candidates.length}
                </Typography>
            </Container>

            {candidates.length > 0 && (<Container sx={{bgcolor: "#F0F3F7"}}>
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
            </Container>)}

        </>
    )
}

export default App



