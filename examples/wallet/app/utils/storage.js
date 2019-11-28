export const saveAccountInfoInLocalStorage = (keys: AccountKeys) => {
  localStorage.setItem('savedKeys', 'true');
  localStorage.setItem('address', keys.address);
  localStorage.setItem('identifier', keys.identifier);
  localStorage.setItem('privateKey', keys.privateKey);
};

export const isAccountInfoInLocalStorage = () => {
  const savedKeys = localStorage.getItem('savedKeys') === 'true';
  return savedKeys;
};

export const readAccountKeysFromLocalStorage = () => {
  return new Promise((resolve, reject) => {
    const savedKeys = localStorage.getItem('savedKeys') === 'true';
    if (savedKeys) {
      const address = localStorage.getItem('address');
      const identifier = localStorage.getItem('identifier');
      const privateKey = localStorage.getItem('privateKey');
      const accountKeys = { address, identifier, privateKey };
      resolve(accountKeys);
    }
    reject(new Error('There are no keys stored in the wallet yet'));
  });
};
