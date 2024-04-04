import React, { useState } from 'react';
import Modal from './Modal';
import './PolkadptToEtheriem.css';

interface ParentComponentProps {
    submit: (amount: any, address: any) => void; // Updated to accept two parameters
    setIsModalOpen: (isOpen: boolean) => void;
    isModalOpen: boolean;
    isPending: boolean;
    isConnected: boolean;
}

const ParentComponent: React.FC<ParentComponentProps> = ({ submit, isModalOpen, setIsModalOpen, isPending, isConnected }) => {
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    console.log({amount});
    console.log({address})
    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    };

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {/* <h3>Enter Address</h3>
                <input
                    type="text"
                    className='Address'
                    placeholder='Enter Address Here'
                    value={address}
                    onChange={handleAddressChange}
                />
                <h3>Enter Amount</h3>
                <input
                    type="text"
                    className='Address Amount'
                    placeholder='Enter Amount'
                    value={amount}
                    onChange={handleAmountChange}
                /> */}
                <div className='buttons' style={{ marginTop: "20px" }}>
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={closeModal}>Cancel</button>
                    <button className={`loading-button ${isPending ? 'loading' : ''}`}  onClick={() => submit(amount, address)}>
        <span>Submit</span>
        <div className="loader"></div>
      </button>
                </div>
            </Modal>
        </div>
    );
};

export default ParentComponent;
