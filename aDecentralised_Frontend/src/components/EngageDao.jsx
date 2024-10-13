
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useAuth } from '../AuthContext';

const EngageDao = () => {
  const { provider, account, isConnected, connectToMetamask } = useAuth();
  const [daoAddress, setDaoAddress] = useState("");  // State to store the contract address input
  const [submittedDaoAddress, setSubmittedDaoAddress] = useState(""); // State to store the submitted DAO address
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if the form is submittedddress

  const handleSubmit = (e) => {
    e.preventDefault();
    if (daoAddress) {
      setSubmittedDaoAddress(daoAddress);  // Set the submitted DAO address
      setIsSubmitted(true);  // Show the section after submission
    }
  };

  return (
    <>
      <Navbar />
      <form action="submit" className='flex flex-col items-center text-gray-950 rounded' onSubmit={handleSubmit}>
        <div className='border flex flex-col rounded shadow-lg w-64 items-center mt-6'>
          <label htmlFor="DAO" className='text-2xl m-2'>Input DAO Address </label>
          <input
            type="text"
            id='DAO'
            placeholder='Enter DAO Address'
            className='rounded-lg m-4'
            value={daoAddress}
            onChange={(e) => setDaoAddress(e.target.value)}  // Capture the DAO address
          />
          <button className='text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
            Submit
          </button>
        </div>
      </form>
      {isSubmitted && (
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="-my-8 divide-y-2 divide-gray-100">
            <div className="py-8 flex flex-wrap md:flex-nowrap">
              <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                <span className="font-semibold title-font text-gray-700">make your Stake </span>
                <span className="mt-1 text-gray-500 text-sm">Anyone (seats limited) </span>
              </div>
              <div className="md:flex-grow">
                <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">Bitters hashtag waistcoat fashion axe chia unicorn</h2>
                <p className="leading-relaxed">Stake in your selected DAO to be part of governance and decision making.</p>
                <Link to="/engage-DAO/stake" state={{ daoAddress }} className="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Make Your Stake
                </Link>

              </div>
            </div>
            <div className="py-8 flex flex-wrap md:flex-nowrap">
              <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                <span className="font-semibold title-font text-gray-700">Create Proposal</span>
                <span className="mt-1 text-gray-500 text-sm">Only Stakers</span>
              </div>
              <div className="md:flex-grow">
                <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">Meditation bushwick direct trade taxidermy shaman</h2>
                <p className="leading-relaxed">Create your desired proposal.</p>
                <Link to="/engage-DAO/create-proposal" state={{ daoAddress }} className="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Create Proposal
                </Link>
              </div>
            </div>
            <div className="py-8 flex flex-wrap md:flex-nowrap">
              <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                <span className="font-semibold title-font text-gray-700">CATEGORY</span>
                <span className="text-sm text-gray-500">12 Jun 2019</span>
              </div>
              <div className="md:flex-grow">
                <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">Woke master cleanse drinking vinegar salvia</h2>
                <p className="leading-relaxed">Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha lumbersexual pork belly polaroid hoodie portland craft beer.</p>
                <button className="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

    </>
  );
};

export default EngageDao; 