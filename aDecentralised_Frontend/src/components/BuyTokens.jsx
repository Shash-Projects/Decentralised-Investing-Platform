import React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../AuthContext";
import { ethers } from "ethers";
import { contractABI, contractByteCode } from "../../Constants";

function BuyTokens() {

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

      const handleBuying = async(data)=>{
        if (!isConnected) {
            setError("general", {
              message: "You must be logged in to create a proposal.",
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
     
            const tx = await contractWithSigner.buyTokens(data.tokens, {value: data.amount});
            await tx.wait();
            //Listeners
            contractWithSigner.on("Sell", (buyer, amount)=>{
                document.getElementById(
                   "remark"
               ).textContent = ` Buyer ${buyer} successfully bought ${amount} tokens. `;
                reset();
            })

            console.log("Tx successful: Tokens Bought ", tx.hash);
           
          } catch (error) {
            console.log("Error: ", error);
            setError("general", { message: "An error occurred while staking." });
          }
      }


  return (
    <div>
        <form 
        onSubmit={handleSubmit(handleBuying)}
        className='flex flex-col items-center  text-gray-950 rounded  '
        >
          <div className='border flex flex-col rounded shadow-lg w-96 items-center mt-6'>

            <label htmlFor="vote" className="font-medium mt-5 mb-3">
              Buy Tokens
            </label>
            <input
                type="text"
                id="tokens"
                className="p-2 border border-gray-300 rounded"
                placeholder="Number of Tokens"
                {...register("tokens", {
                    required: "Token is required",
              })}
            />
            {errors.token && (
              <p className="text-red-500">{errors.token.message}</p>
            )}

            <label htmlFor="vote" className="font-medium mt-5 mb-3">
              Enter Amount
            </label>
            <input
                type="text"
                id="amount"
                className="p-2 border border-gray-300 rounded"
                placeholder="Amount"
                {...register("amount", {
                    required: "Amount is required",
              })}
            />
            {errors.amount && (
              <p className="text-red-500">{errors.amount.message}</p>
            )}



            <button 
                type="submit" 
                className='"text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-white'
                disabled = {isSubmitting}
            >{isSubmitting ? "Buying..." : "Buy"}
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

export default BuyTokens