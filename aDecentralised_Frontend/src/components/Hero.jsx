import React from 'react';

const Hero = (props) => {
 
  
  return (
    <section className="relative bg-cover bg-center h-screen" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519621464183-ef6c4b683e29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMTI3NTZ8MHwxfGFsbHwxfHx8fHx8fDE2NjE0ODI4Nw&ixlib=rb-1.2.1&q=80&w=1080)' }}>
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Revolutionize Your Investments</h1>
          <p className="text-lg md:text-xl mb-8">
            Join the future of finance with our decentralized investment platform. Propose and invest in exciting opportunities with full transparency and security.
          </p>
          {
            props.status? <p className='text-3xl text-blue-950'>Welcome Aboard: <span>{props.status}</span></p>:<button onClick={props.connectWallet} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg text-lg font-semibold transition duration-300" >Get Authenticated</button>
          }
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
