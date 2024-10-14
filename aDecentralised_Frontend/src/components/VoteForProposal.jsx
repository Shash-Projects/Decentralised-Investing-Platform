import React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../AuthContext";
import { ethers } from "ethers";
import { contractABI, contractByteCode } from "../../Constants";

function VoteForProposal() {

    const { provider, isConnected } = useAuth();
    const location = useLocation();  // Use location to get passed state
    const { daoAddress } = location.state || {};  // Destructure the passed DAO address
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { isSubmitting, errors },
      } = useForm();


    const handleVoting = async (data)=>{
        if (!isConnected) {
            setError("general", {
              message: "You must be logged in to vote for proposal.",
            });
            return;
          }
      
        if (Object.values(data).some((field) => field.trim() === "")) {
            setError("general", { message: "All fields must be filled" });
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
            const tx = await contractWithSigner.voteForProposal(data.vote, data.proposalIndex);
            await tx.wait();
            console.log("Tx successful:" , tx.hash);
           
           //Listeners
           contractWithSigner.on("proposalExpired", async(proposalId)=>{
              console.log("Proposal EXPIRED:", proposalId.toString());
              document.getElementById("remark").textContent = `Proposal with ID ${proposalId} has Expired`;
              reset();
           })

           contractWithSigner.on("votedAlready", (voter)=>{
            console.log("Vote already casted on proposal by:", voter.toString());
            document.getElementById("remark").textContent = `Already voted by: ${voter}`;
            reset();
         })
            contractWithSigner.on("votedSuccessfully", (proposalId)=>{
              console.log("Voted Successfully:", proposalId.toString());
              document.getElementById("remark").textContent = `Successfully voted: ${proposalId}`;
              reset();
            })

            reset();
       } catch (error) {
           console.log("Error: ", error);
           setError("general", { message: "An error occurred while voting for proposal." });
       }
    }  

  return (
    <div>
        <form 
        onSubmit={handleSubmit(handleVoting)}
        className='flex flex-col items-center  text-gray-950 rounded  '
        >
          <div className='border flex flex-col rounded shadow-lg w-96 items-center mt-6'>

            {/* <label htmlFor="daoAddress" className="mb-1 font-medium">
              Home DAO Address
            </label>
            <input
                type="text"
                id="daoAddress"
                className="p-2 border border-gray-300 rounded"
                placeholder="DAO that you are part of"
                {...register("daoAddress", {
                    required: "DAO Address is required",
              })}
            />
            {errors.daoAddress && (
              <p className="text-red-500">{errors.expiryHr.message}</p>
            )} */}

            <label htmlFor="vote" className="font-medium mt-5 mb-3">
              Vote - True/False ?
            </label>
            <input
                type="text"
                id="vote"
                className="p-2 border border-gray-300 rounded"
                placeholder="Vote"
                {...register("vote", {
                    required: "Vote is required",
              })}
            />
            {errors.vote && (
              <p className="text-red-500">{errors.vote.message}</p>
            )}

            <div className="flex flex-col">
                <label htmlFor="proposalIndex" className="mt-5 mb-3 font-medium">
                    Proposal Index
                </label>
                <input
                type="number"
                id="proposalIndex"
                className="p-2 border border-gray-300 rounded"
                placeholder="Index"
                {...register("proposalIndex", { required: "Proposal index is a required field" })}
            />
            {errors.proposalIndex && (
              <p className="text-red-500">{errors.proposalIndex.message}</p>
            )}
          </div>

            <button 
                type="submit" 
                className='"text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-white'
                disabled = {isSubmitting}
            >{isSubmitting ? "Voting..." : "Vote"}
            </button>
            <p id="remark" className="text-green-500 text-sm text-center mt-2" ></p>
            {errors.general && (
            <p className="text-red-500 text-center mt-2">
              {errors.general.message}
            </p>
          )}
          </div>
        </form>
    </div>
  )
}

export default VoteForProposal