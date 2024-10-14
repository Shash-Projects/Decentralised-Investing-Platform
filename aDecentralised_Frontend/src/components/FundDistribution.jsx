import React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../AuthContext";
import { ethers } from "ethers";
import { contractABI, contractByteCode } from "../../Constants";

async function FundDistribution () {

    const { provider, isConnected } = useAuth();
    const location = useLocation();  // Use location to get passed state
    const { daoAddress } = location.state || {};  // Destructure the passed DAO address

    if (!isConnected) {
        document.getElementById(
            "remark"
        ).textContent = `You must be logged in to distribute funds`;
        return;
    }

    const contract = new ethers.Contract(
        daoAddress,
        contractABI,
        provider
      );
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    try {
        
          const tx = await contractWithSigner.fundDistribution;
          await tx.wait();

          // Listeners
        contractWithSigner.on("check", (profit, proposer, buyer, total)=>{
            console.log("Total Return from investment: ",total);
            console.log("Each Proposer's Share: ",proposer);
            console.log("Each Buyer's Share: ",buyer);
            document.getElementById(
               "remark"
           ).textContent = `"Total Return from investment is ${total}`;
            reset();
        })

        contractWithSigner.on("FundDistributedSuccessfully", (profit, proposer, buyer, total)=>{
            document.getElementById(
               "remark2"
           ).textContent = `"Each Proposer's Share ${proposer}`;
            reset();
        })

          console.log("Tx successful: Fund Distributed Succesfully: ", tx.hash);
          reset();

     } catch (error) {
         console.log("Error: ", error);
         document.getElementById(
            "error"
        ).textContent = `"Fund Distribution Failed !!`;
         
     }

  return (
    <div>
        <p className="text-red-500 text-sm text-center mt-2" id="error"></p>
        <p className="text-green-500 text-sm text-center mt-2" id="remark"></p>
        <p className="text-green-500 text-sm text-center mt-2" id="remark2"></p>
    </div>
  )
}

export default FundDistribution