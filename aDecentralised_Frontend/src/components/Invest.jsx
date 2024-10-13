// src/components/Invest.js
import React from 'react';
import { useForm } from 'react-hook-form';
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

const Invest = () => {
    const { register, handleSubmit, setError, reset, formState: { isSubmitting, errors } } = useForm();

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            console.log(data);
            alert("Invested");
            reset();
        } catch (error) {
            setError("Address", { message: "The Address does not exist!!" });
        }
    };

    return (
        <ErrorBoundary>
            <Navbar/>
            <div className='flex flex-col items-center  p-6 bg-gray-300'>
                <form onSubmit={handleSubmit(onSubmit)} className="shadow-2xl flex flex-col bg-white gap-4 p-6 border-gray-900 rounded-lg w-full max-w-lg">
                    <h1 className='text-gray-900 text-3xl mb-4 border flex flex-col  items-center bg-gray-600  rounded p-2 m-2 border-gray-900 pb-2'>
                        Invest
                    </h1>

                    <div className="flex flex-col">
                        <label htmlFor="address" className="mb-1 font-medium">Address</label>
                        <input
                            id="address"
                            className="p-2 border border-gray-300 rounded"
                            placeholder="Address"
                            type="text"
                            {...register("Address", { required: "Address is required" })}
                            aria-required="true"
                        />
                        {errors.Address && <p className="text-red-500">{errors.Address.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="tokens" className="mb-1 font-medium">Tokens</label>
                        <input
                            id="tokens"
                            className="p-2 border border-gray-300 rounded"
                            placeholder="Tokens"
                            type="number"
                            {...register("tokens", { required: "Tokens are required" })}
                            aria-required="true"
                        />
                        {errors.tokens && <p className="text-red-500">{errors.tokens.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="ether" className="mb-1 font-medium">Ether</label>
                        <input
                            id="ether"
                            className="p-2 border border-gray-300 rounded"
                            placeholder="Ether"
                            type="number"
                            {...register("ether", { required: "Ether is required" })}
                            aria-required="true"
                        />
                        {errors.ether && <p className="text-red-500">{errors.ether.message}</p>}
                    </div>

                    <button disabled={isSubmitting} className="bg-blue-500 text-white p-2 rounded mt-4">
                        {isSubmitting ? "Submitting..." : "Buy Tokens"}
                    </button>
                </form>
            </div>
            <Footer/>
        </ErrorBoundary>
    );
};

export default Invest;
