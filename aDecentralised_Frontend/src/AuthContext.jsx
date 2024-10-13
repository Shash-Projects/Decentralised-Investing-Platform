import React, {useContext, createContext, useState, useEffect} from "react";
import { ethers } from "ethers";

// Creating context with default values
const AuthContext = createContext({
    provider: null,
    account: null,
    isConnected: false,
    connectToMetamask: ()=>{},
    handleAccountsChange: ()=>{}

})

// Custom hook to use the AuthContext
export const useAuth = ()=> useContext(AuthContext);

// Provider Component
export const AuthProvider = ({children})=>{
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(()=>{
        if(window.ethereum){
            window.ethereum.on('accountsChanged', handleAccountsChange); //sets up an event listener for the accountsChanged event emitted by MetaMask.

            return ()=>{
                window.ethereum.removeListener('accountsChanged', handleAccountsChange);  // unmounts the listener 
            }
        }
    }, []);
    function handleAccountsChange(accounts) {  // accounts:  an array of Ethereum addresses connected to metamask
        if (accounts.length > 0 && account !== accounts[0]) {
            setAccount(accounts[0]);
            setIsConnected(true);
        } else {
            setIsConnected(false);
            setAccount(null);
        }
    }

    async function connectToMetamask() {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum); //This object is injected by MetaMask and indicates that MetaMask (or another Ethereum provider) is installed.
                setProvider(provider);

                await provider.send("eth_requestAccounts", []); //Sends a request to MetaMask to prompt the user to connect their accounts.
                const signer = provider.getSigner(); //  Retrieves a signer object from the provider to sign transactions and messages.
                const address = await signer.getAddress();

                setIsConnected(true);
                setAccount(address); //Retrieves a list of accounts currently connected to the provider. 
            } catch (err) {
                console.log("not connected", err);
            }
        }
    }

    return (
        <AuthContext.Provider value={{ provider, account, isConnected, connectToMetamask, handleAccountsChange }}>
            {children}
        </AuthContext.Provider>
    );
}