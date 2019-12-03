export function saveAccountInfoInLocalStorage(keys: AccountKeys): void {
  Object.keys(keys).forEach(key => localStorage.setItem(key, keys[key]));
}

export function readAccountKeysFromLocalStorage(): any {
  const savedKeys =
    localStorage.getItem('privateKey') !== undefined &&
    localStorage.getItem('privateKey') !== null;
  if (savedKeys) {
    const address = localStorage.getItem('address');
    const identifier = localStorage.getItem('identifier');
    const privateKey = localStorage.getItem('privateKey');
    const accountKeys = { address, identifier, privateKey };
    return accountKeys;
  }
  return undefined;
}
