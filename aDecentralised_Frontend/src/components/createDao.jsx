import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../AuthContext';
import { ethers } from 'ethers';
import { contractABI, contractByteCode } from '../../Constants';
import Navbar from './Navbar';
import Footer from './Footer';

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
            return <div className="text-red-500">Something went wrong. Please try again later.</div>;
        }
        return this.props.children;
    }
}

const CreateDao = () => {
    const { provider, account, isConnected, connectToMetamask } = useAuth();
    const { register, handleSubmit, setError, reset, formState: { isSubmitting, errors } } = useForm();

    const onSubmit = async (data) => {
        if (!isConnected) {
            document.getElementById("abc").innerHTML =
                "You must be logged in to create a Dao.";
            return;
        }

        if (Object.values(data).some((field) => field.trim() === "")) {
            console.log("Error: All fields must be filled");
            document.getElementById("abc").innerHTML = "All fields must be filled";
            return;
        }

        try {
            const signer = provider.getSigner();

            const daoFactory = new ethers.ContractFactory(
                contractABI,
                contractByteCode,
                signer
            );

            const daoContract = await daoFactory.deploy(
                data.noOfExperts,
                data.minAcceptanceToPassProposal,
                data.stakeAmount
            );

            await daoContract.deployed();
            console.log("DAO Contract deployed at:", daoContract.address);
            document.getElementById(
                "abc"
            ).innerHTML = `DAO Deployed Successfully at ${daoContract.address}`;
            reset();
        } catch (error) {
            console.log("contract couldn't be deployed", error);
            document.getElementById("abc").innerHTML = "Error deploying contract";
        }
    };

    return (
        <ErrorBoundary>
            <Navbar />
            <div className="flex flex-col items-center p-6 bg-gray-300">
                <h1 className='text-gray-900 text-3xl mb-4 border flex flex-col items-center bg-gray-600 rounded p-2 m-2 border-gray-900 pb-2'>
                    Create Organisation
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="shadow-2xl flex flex-col bg-white gap-4 p-6 border-gray-900 rounded-lg w-full max-w-lg">
                    <div className="flex flex-col">
                        <label htmlFor="noOfExperts" className="mb-1 font-medium">Number of Experts</label>
                        <input
                            id="noOfExperts"
                            className="p-2 border border-gray-300 rounded"
                            placeholder="No of Experts"
                            type="text"
                            {...register("noOfExperts", { required: "Number of Experts is required" })}
                            aria-required="true"
                        />
                        {errors.noOfExperts && <p className="text-red-500">{errors.noOfExperts.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="minAcceptanceToPassProposal" className="mb-1 font-medium">Minimum Votes for Passing a Proposal</label>
                        <input
                            id="minAcceptanceToPassProposal"
                            className="p-2 border border-gray-300 rounded"
                            placeholder="Threshold acceptance"
                            type="text"
                            {...register("minAcceptanceToPassProposal", { required: "Minimum Acceptance is required" })}
                            aria-required="true"
                        />
                        {errors.minAcceptanceToPassProposal && <p className="text-red-500">{errors.minAcceptanceToPassProposal.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="stakeAmount" className="mb-1 font-medium">Enter the Staking Amount</label>
                        <input
                            id="stakeAmount"
                            className="p-2 border border-gray-300 rounded"
                            placeholder="in gwei"
                            type="text"
                            {...register("stakeAmount", { required: "Stake Amount is required" })}
                            aria-required="true"
                        />
                        {errors.stakeAmount && <p className="text-red-500">{errors.stakeAmount.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
                    >
                        {isSubmitting ? "Creating Dao..." : "Create Dao"}
                    </button>
                    <p id="abc" className="text-red-600 text-3xl"></p>
                </form>
            </div>
            <Footer />
        </ErrorBoundary>
    );
};

export default CreateDao;
