import {useState, useEffect} from 'react';
import { ethers } from 'ethers'
import { useAuth } from './AuthContext';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import Hero from  './components/Hero';
import ProposerInvestorCards from './components/Cards';


function App() {
  const { provider, account, isConnected, connectToMetamask } = useAuth();

  return (
    <>
    <Navbar/>
    <Hero status={account} connectWallet= {connectToMetamask} />
    <ProposerInvestorCards status={isConnected}/>
    <Footer/>
    </>
  )
}

export default App
