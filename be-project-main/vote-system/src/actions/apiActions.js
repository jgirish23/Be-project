import axios from "axios";

const API_URL = "http://localhost:5000";

export const encryptVote = async (vote) => {
  try {
    const response = await axios.post(`${API_URL}/encrypt`, { vote });
    return response.data.enc_vote;
  } catch (error) {
    console.error(
      "There was an error encrypting the vote:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const decryptVoteSum = async (enc_vote_sum) => {
  try {
    if(enc_vote_sum === 0) return 0;
    const response = await axios.post(`${API_URL}/decrypt`, { enc_vote_sum });
    return response.data.decrypted_sum;
  } catch (error) {
    console.error(
      "There was an error decrypting the vote sum:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const contractVote = async (enc_vote) => {
  try {
    const response = await axios.post(`${API_URL}/contract/vote`, { enc_vote });
    return response.data;
  } catch (error) {
    console.error(
      "There was an error submitting the vote:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getEncryptedSum = async () => {
  try {
    const response = await axios.get(`${API_URL}/contract/sum`);
    return response.data;
  } catch (error) {
    console.error(
      "There was an error getting the encrypted sum:",
      error.response?.data || error.message
    );
    throw error;
  }
};
