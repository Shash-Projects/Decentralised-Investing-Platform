import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../AuthContext";
import { ethers } from "ethers";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { contractABI, contractByteCode } from "../../Constants";

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught by ErrorBoundary:", error);
    // You can also log error info to an external service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500">
          Something went wrong. Please try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

const CreateProposal = () => {
  const { provider, isConnected } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  const [proposal, setProposal] = useState({
    target: "",
    amountToInvest: "",
    marginForStakers: "",
    marginForPublic: "",
    expiryHr: "",
    initialSupply: "",
    tokenPrice: "",
  });

  const handleCreateProposal = async (data) => {
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

    // Update proposal state with form data
    setProposal({
      target: data.target,
      amountToInvest: data.amountToInvest,
      marginForStakers: data.marginForStakers,
      marginForPublic: data.marginForPublic,
      expiryHr: data.expiryHr,
      initialSupply: data.initialSupply,
      tokenPrice: data.tokenPrice,
    });

    await ToPropose();
  };

  const ToPropose = async () => {
    try {
      const contractAddress = "0x28730Bf391106F55f8cFB3a98F452Ea34c9Bac93";
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.makeProposal(
        proposal.target,
        proposal.amountToInvest,
        proposal.marginForStakers,
        proposal.marginForPublic,
        proposal.expiryHr,
        proposal.initialSupply,
        proposal.tokenPrice
      );

      await tx.wait();
      console.log("Tx successful: proposal created", tx.hash);
      reset();
    } catch (error) {
      console.log("Error:", error);
      setError("general", { message: "An error occurred while creating the proposal." });
    }
  };

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="flex flex-col items-center p-6 bg-gray-300">
        <h1 className="text-gray-900 text-3xl mb-4 border flex flex-col items-center bg-gray-50 rounded p-2 m-2 border-gray-900 pb-2">
          Create Proposal
        </h1>
        <form
          onSubmit={handleSubmit(handleCreateProposal)}
          className="shadow-2xl flex flex-col bg-white gap-4 p-6 border-gray-900 rounded-lg w-full max-w-lg"
        >
          <div className="flex flex-col">
            <label htmlFor="target" className="mb-1 font-medium">
              Home DAO Address
            </label>
            <input
              type="text"
              id="target"
              className="p-2 border border-gray-300 rounded"
              placeholder="DAO that you are part of"
              {...register("target", {
                required: "DAO Address is required",
              })}
            />
            {errors.target && (
              <p className="text-red-500">{errors.target.message}</p>
            )}
          </div>


          <div className="flex flex-col">
            <label htmlFor="target" className="mb-1 font-medium">
              Target Address
            </label>
            <input
              type="text"
              id="target"
              className="p-2 border border-gray-300 rounded"
              placeholder="Address in which we will invest"
              {...register("target", {
                required: "Target Address is required",
              })}
            />
            {errors.target && (
              <p className="text-red-500">{errors.target.message}</p>
            )}
          </div>

          {/* <div className="flex flex-col">
            <label htmlFor="amountToInvest" className="mb-1 font-medium">
              Amount to Invest
            </label>
            <input
              type="number"
              id="amountToInvest"
              className="p-2 border border-gray-300 rounded"
              placeholder="Amount to Invest"
              {...register("amountToInvest", {
                required: "Amount to Invest is required",
              })}
            />
            {errors.amountToInvest && (
              <p className="text-red-500">{errors.amountToInvest.message}</p>
            )}
          </div> */}

          <div className="flex flex-col">
            <label htmlFor="marginForStakers" className="mb-1 font-medium">
              Margin for Stakers
            </label>
            <input
              type="text"
              id="marginForStakers"
              className="p-2 border border-gray-300 rounded"
              placeholder="Margin for Stakers"
              {...register("marginForStakers", {
                required: "Margin for Stakers is required",
              })}
            />
            {errors.marginForStakers && (
              <p className="text-red-500">{errors.marginForStakers.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="marginForPublic" className="mb-1 font-medium">
              Margin for Public
            </label>
            <input
              type="text"
              id="marginForPublic"
              className="p-2 border border-gray-300 rounded"
              placeholder="Margin for Public"
              {...register("marginForPublic", {
                required: "Margin for Public is required",
              })}
            />
            {errors.marginForPublic && (
              <p className="text-red-500">{errors.marginForPublic.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="expiryHr" className="mb-1 font-medium">
              Expiry Time (hours)
            </label>
            <input
              type="text"
              id="expiryHr"
              className="p-2 border border-gray-300 rounded"
              placeholder="Expiry Time in hours"
              {...register("expiryHr", { required: "Expiry Time is required" })}
            />
            {errors.expiryHr && (
              <p className="text-red-500">{errors.expiryHr.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="initialSupply" className="mb-1 font-medium">
              Initial Supply
            </label>
            <input
              type="text"
              id="initialSupply"
              className="p-2 border border-gray-300 rounded"
              placeholder="Initial Supply"
              {...register("initialSupply", {
                required: "Initial Supply is required",
              })}
            />
            {errors.initialSupply && (
              <p className="text-red-500">{errors.initialSupply.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="tokenPrice" className="mb-1 font-medium">
              Token Price (in wei)
            </label>
            <input
              type="text"
              id="tokenPrice"
              className="p-2 border border-gray-300 rounded"
              placeholder="Token Price (in wei)"
              {...register("tokenPrice", {
                required: "Token Price is required",
              })}
            />
            {errors.tokenPrice && (
              <p className="text-red-500">{errors.tokenPrice.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
          >
            {isSubmitting ? "Creating Proposal..." : "Create Proposal"}
          </button>
          {errors.general && (
            <p className="text-red-500 text-center mt-2">
              {errors.general.message}
            </p>
          )}
        </form>
      </div>
      <Footer />
    </ErrorBoundary>
  );
};

export default CreateProposal;
