// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import Web3 from 'web3'; // Uncomment when integrating with blockchain

// --- Login Page ---
function LoginPage({ setToken }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = () => {
    // Simulate sending OTP (replace with real API call)
    alert(`OTP sent to ${email}`);
  };

  const handleVerifyOTP = () => {
    // Simulate OTP verification; here we use "123456" as the valid OTP
    if (otp === "123456") {
      const token = "token_" + Math.random().toString(36).substr(2, 9);
      setToken(token);
      navigate("/vote");
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <input
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleSendOTP}>Send OTP</button>
      <br /><br />
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOTP}>Verify OTP</button>
    </div>
  );
}

// --- Voting Page ---
function VotePage({ votes, setVotes }) {
  const [category, setCategory] = useState('');
  const [voteName, setVoteName] = useState('');
  const navigate = useNavigate();

  const handleAddVote = () => {
    if (category && voteName) {
      setVotes([...votes, { category, voteName }]);
      setCategory('');
      setVoteName('');
    } else {
      alert("Please fill in both fields.");
    }
  };

  const handleSubmitVotes = () => {
    if (votes.length > 0) {
      navigate("/confirm");
    } else {
      alert("Please add at least one vote.");
    }
  };

  return (
    <div>
      <h2>Voting Page</h2>
      <input
        placeholder="Award Category (e.g., Best Actor)"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <input
        placeholder="Candidate Name"
        value={voteName}
        onChange={e => setVoteName(e.target.value)}
      />
      <button onClick={handleAddVote}>Add Vote</button>
      <br /><br />
      <button onClick={handleSubmitVotes}>Confirm Votes</button>
    </div>
  );
}

// --- Confirmation Page ---
function ConfirmPage({ votes, token, submitVoteToBlockchain }) {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    // Send votes to blockchain (this is a placeholder function)
    await submitVoteToBlockchain(votes, token);
    navigate("/success");
  };

  return (
    <div>
      <h2>Confirm Your Votes</h2>
      <ul>
        {votes.map((vote, index) => (
          <li key={index}>
            {vote.category}: {vote.voteName}
          </li>
        ))}
      </ul>
      <button onClick={handleConfirm}>Submit Vote</button>
    </div>
  );
}

// --- Success Page ---
function SuccessPage({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  return (
    <div>
      <h2>Vote Submitted Successfully!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

// --- Main App ---
function App() {
  const [token, setToken] = useState(null);
  const [votes, setVotes] = useState([]);

  // This function would interact with the blockchain
  const submitVoteToBlockchain = async (votes, token) => {
    console.log("Submitting votes to blockchain:", votes, "with token:", token);
    // Example using Web3 (replace with actual blockchain logic):
    // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    // const contract = new web3.eth.Contract(contractABI, contractAddress);
    // await contract.methods.vote(votes, token).send({ from: userAddress });
    return new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setToken={setToken} />} />
        <Route path="/vote" element={<VotePage votes={votes} setVotes={setVotes} />} />
        <Route path="/confirm" element={<ConfirmPage votes={votes} token={token} submitVoteToBlockchain={submitVoteToBlockchain} />} />
        <Route path="/success" element={<SuccessPage setToken={setToken} />} />
      </Routes>
    </Router>
  );
}

//export default App;

// context/VoteContext.js
import { createContext, useState, useContext } from 'react';

const VoteContext = createContext();

export const VoteProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(null);
  const [votes, setVotes] = useState({}); // Object: categoryId -> answers array

  return (
    <VoteContext.Provider value={{ email, setEmail, token, setToken, votes, setVotes }}>
      {children}
    </VoteContext.Provider>
  );
};

export const useVote = () => useContext(VoteContext);

// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useVote } from '../context/VoteContext';

export default function LoginPage() {
  const { setEmail, setToken } = useVote();
  const router = useRouter();
  const [inputEmail, setInputEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const sendOTP = () => {
    // Simulate sending OTP (in a real app, call an email API)
    alert(`OTP sent to ${inputEmail} (Use 123456)`);
    setOtpSent(true);
  };

  const verifyOTP = () => {
    if (otp === '123456') {
      // Save email and create a session token
      setEmail(inputEmail);
      setToken('token_' + Math.random().toString(36).substr(2, 9));
      router.push('/vote');
    } else {
      alert('Incorrect OTP. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={inputEmail}
        onChange={(e) => setInputEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={sendOTP} style={{ padding: '8px 16px' }}>Send OTP</button>
      {otpSent && (
        <>
          <br /><br />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button onClick={verifyOTP} style={{ padding: '8px 16px' }}>Verify OTP</button>
        </>
      )}
    </div>
  );
}
// pages/vote.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useVote } from '../context/VoteContext';

// Sample categories data (add more as needed)
const categoriesData = [
  {
    id: 'cat1',
    title: 'Most Beautiful in CSC',
    awards: [
      'Who deserves to win Most Beautiful in CSC?',
      'Who has the most captivating smile?',
      'Question 3',
      'Question 4',
      'Question 5',
      'Question 6',
      'Question 7',
      'Question 8',
      'Question 9',
      'Question 10'
    ],
  },
  {
    id: 'cat2',
    title: 'Best Actor in CSC',
    awards: [
      'Who deserves to win Best Actor in CSC?',
      'Who delivered the most convincing performance?',
      'Question 3',
      'Question 4',
      'Question 5',
      'Question 6',
      'Question 7',
      'Question 8',
      'Question 9',
      'Question 10'
    ],
  },
  {
    id: 'cat3',
    title: 'Best Musician in CSC',
    awards: [
      'Who deserves to win Best Musician in CSC?',
      'Who rocked the stage the hardest?',
      'Question 3',
      'Question 4',
      'Question 5',
      'Question 6',
      'Question 7',
      'Question 8',
      'Question 9',
      'Question 10'
    ],
  },
];

function AccordionItem({ category, onAnswerChange, savedAnswers }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`accordion-item ${expanded ? 'expanded' : ''}`}>
      <div className="accordion-header" onClick={toggleExpanded}>
        {category.title}
      </div>
      {expanded && (
        <div className="award-list">
          {category.awards.map((award, index) => (
            <div key={index} className="award-question">
              <label>{award}</label>
              <input
                type="text"
                placeholder="Enter your vote"
                value={savedAnswers && savedAnswers[index] ? savedAnswers[index] : ''}
                onChange={(e) => onAnswerChange(category.id, index, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .accordion-item {
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
          cursor: pointer;
        }
        .accordion-header {
          font-size: 1.2em;
          font-weight: bold;
        }
        .award-list {
          margin-top: 12px;
        }
        .award-question {
          margin-bottom: 10px;
        }
        input {
          width: 100%;
          padding: 6px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

export default function VotePage() {
  const { votes, setVotes } = useVote();
  const router = useRouter();

  const handleAnswerChange = (categoryId, questionIndex, value) => {
    setVotes(prevVotes => {
      const categoryVotes = prevVotes[categoryId] || [];
      categoryVotes[questionIndex] = value;
      return { ...prevVotes, [categoryId]: categoryVotes };
    });
  };

  const handleSubmit = () => {
    // Proceed to confirmation page
    router.push('/confirm');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Vote for Awards</h1>
      <div className="grid-container">
        {categoriesData.map(category => (
          <AccordionItem
            key={category.id}
            category={category}
            onAnswerChange={handleAnswerChange}
            savedAnswers={votes[category.id]}
          />
        ))}
      </div>
      <button onClick={handleSubmit} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Confirm Votes
      </button>
      <style jsx>{`
        .grid-container {
          display: grid;
          grid-gap: 16px;
        }
        @media (min-width: 768px) {
          .grid-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
// pages/confirm.js
import { useVote } from '../context/VoteContext';
import { useRouter } from 'next/router';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, TransactionInstruction } from '@solana/web3.js';

export default function ConfirmPage() {
  const { votes, token } = useVote();
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const handleSubmitVote = async () => {
    if (!publicKey) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      // Prepare the vote data (include token & votes)
      const voteData = { token, votes };
      const memoData = JSON.stringify(voteData);

      // Create a new transaction
      const transaction = new Transaction();

      // The Memo Program ID on Solana:
      const memoProgramId = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
      const memoIx = new TransactionInstruction({
        keys: [],
        programId: memoProgramId,
        data: Buffer.from(memoData, 'utf8'),
      });
      transaction.add(memoIx);

      // Get a recent blockhash and set fee payer
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign the transaction with your wallet (Phantom will prompt)
      const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction to the network
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(txid);

      alert('Vote submitted! Transaction ID: ' + txid);
      router.push('/success');
    } catch (error) {
      console.error(error);
      alert('Error submitting vote: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Confirm Your Votes</h1>
      <pre>{JSON.stringify(votes, null, 2)}</pre>
      <button onClick={handleSubmitVote} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Submit Vote to Solana Testnet
      </button>
    </div>
  );
}
// pages/success.js
import { useRouter } from 'next/router';
import { useVote } from '../context/VoteContext';

export default function SuccessPage() {
  const { setToken, setVotes, setEmail } = useVote();
  const router = useRouter();

  const handleLogout = () => {
    setToken(null);
    setVotes({});
    setEmail('');
    router.push('/');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Vote Submitted Successfully!</h1>
      <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Logout
      </button>
    </div>
  );
}
