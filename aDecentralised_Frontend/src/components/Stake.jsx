import React from "react";
import { useLocation } from "react-router-dom";  // Import useLocation
import { useForm } from "react-hook-form";
import { useAuth } from "../AuthContext";
import { ethers } from "ethers";
import { contractABI } from "../../Constants";

const Stake = () => {
  const { provider, isConnected } = useAuth();
  const location = useLocation();  // Use location to get passed state
  const { daoAddress } = location.state || {};  // Destructure the passed DAO address
  console.log(daoAddress);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  const handleStaking = async (data) => {
    if (!isConnected) {
      setError("general", {
        message: "You must be logged in to create a proposal.",
      });
      return;
    }

    if (!daoAddress) {
      setError("general", { message: "DAO Address is missing" });
      return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(daoAddress, contractABI, signer);  // Use the passed DAO address

    try {
      const stakeAmt = ethers.utils.parseEther(data.stake);  // Convert to Wei
      const tx = await contract.stake({ value: stakeAmt });
      await tx.wait();
      console.log("Tx successful: Staked ", tx.hash);
      document.getElementById("remark").innerHTML = `Staked Successfully ${tx.hash}`;
      reset();
    } catch (error) {
      console.log("Error: ", error);
      setError("general", { message: "An error occurred while staking." });
    }
  };

  return (
    <div>
      <form 
        onSubmit={handleSubmit(handleStaking)}
        className='flex flex-col items-center text-gray-950 rounded'>
        <div className='border flex flex-col rounded shadow-lg w-64 items-center mt-6'>

          {/* Display the received DAO Address */}
          {daoAddress && (
            <div className="mb-4 text-center">
              <p className="font-bold">DAO Address:</p>
              <p className="text-gray-700">{daoAddress}</p>  {/* Show the DAO Address */}
            </div>
          )}

          <label htmlFor="stake" className="mb-1 font-medium">
            Stake Amount (wei)
          </label>
          <input
            type="number"
            id="stake"
            className="p-2 border border-gray-300 rounded"
            placeholder="Enter stake amount"
            step="any"
            {...register("stake", { required: "Stake Amount cannot be zero" })}
          />
          {errors.stake && <p className="text-red-500">{errors.stake.message}</p>}

          <button 
            type="submit" 
            className='text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
            disabled={isSubmitting}>
            {isSubmitting ? "Staking..." : "Stake"}
          </button>
          {errors.general && <p className="text-red-500 text-center mt-2" id="remark">{errors.general.message}</p>}
        </div>
      </form>
    </div>
  );
};

export default Stake;
