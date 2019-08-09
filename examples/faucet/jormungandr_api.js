const axios = require('axios');

async function getAccountStatus(hostUrl, accountId) {
  const response = await axios.get(`${hostUrl}/account/${accountId}`);
  return response.data;
}

async function getNodeSettings(hostUrl) {
  const response = await axios.get(`${hostUrl}/settings`);
  return response.data;
}

async function postMsg(hostUrl, msg) {
  axios.post(`${hostUrl}/message`, msg, {
    headers: {
      'content-type': 'application/octet-stream'
    }
  });
}

module.exports = {
  getAccountStatus,
  getNodeSettings,
  postMsg
};
