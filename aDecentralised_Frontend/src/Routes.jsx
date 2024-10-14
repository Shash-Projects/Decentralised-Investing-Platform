// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateProposals from'./components/Propose';
import Propose from'./components/Propose';
import CreateDao from './components/createDao';
import Invest from './components/Invest'; 
import EngageDao from './components/EngageDao';
import App from './App';
import { AuthProvider } from './AuthContext';
import Stake from './components/Stake';
import VoteForProposal from './components/VoteForProposal';
import FundDistribution from './components/FundDistribution';
import BuyTokens from './components/BuyTokens';


const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/engage-DAO/create-proposal" element={<Propose />} />
          <Route path="/create-DAO" element={<CreateDao />} />
          <Route path="/engage-DAO" element={<EngageDao />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/engage-DAO/stake" element={<Stake />} />
          <Route path="/engage-DAO/vote-for-proposal" element={<VoteForProposal />} />
          <Route path="/engage-DAO/fund-distribution" element={<FundDistribution />} />
          <Route path="/engage-DAO/buy-tokens" element={<BuyTokens />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
