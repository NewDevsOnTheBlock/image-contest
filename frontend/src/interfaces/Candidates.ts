import { BigNumber } from "ethers";

export default interface Candidate {
    id: number;
    totalVote: number | BigNumber;
    name: string;
    imageHash?: string;
    candidateAddress?: string;
}

export default interface CandidateFormData {
    name?: string;
    imageHash?: string;
}