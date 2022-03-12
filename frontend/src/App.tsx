import React, { ReactElement, useEffect, useState } from 'react'
import logo from './logo.svg'
import { abi } from '../../backend/artifacts/contracts/VoteManager.sol/VoteManager.json'
import { ethers } from "ethers";

function App(): ReactElement {
  const [contract, setContract] = useState()
  const [provider, setProvider] = useState()
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  useEffect(() => {
    initSignerAndContract()

  }, [])

  async function initSignerAndContract() {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    console.log('provider is ', provider)
    if(provider) {
      setContract( new ethers.Contract(contractAddress, abi, provider.getSigner()))
    }
  }

  async function getWinner() {
    const contracTName = await contract.getWinner();
    console.log(contracTName)
  }
  
  return (
    <div className="border border-gray-50 rounded-xl p-20 shadow-xl">
      <header>
        <div className="flex justify-center">
          <img src={logo} className="h-32 w-32 animate-spin-slow" alt="logo" />
        </div>
        <p className="text-2xl pb-3">Hello Vite + React + tailwindcss!</p>
        <p>
          <button
            className="bg-purple-400 pl-2 pr-2 pt-1 pb-1 rounded text-sm text-purple-100"
            onClick={() => getWinner()}
          >
            Get Winner
          </button>
        </p>
        <p className="pb-3 pt-3">
          Edit{' '}
          <code className="border border-1 pl-1 pr-1 pb-0.5 pt-0.5 rounded border-purple-400 font-mono text-sm bg-purple-100 text-purple-900">
            src/App.tsx
          </code>{' '}
          and save to test HMR updates.
        </p>
        <p>
          <a
            className="text-purple-400 underline"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="text-purple-400 underline"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
          {' | '}
          <a
            className="text-purple-400 underline"
            href="https://tailwindcss.com/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            tailwindcss Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App



