export const getCredential = (account: string): string => getJsonItem(account);
export const setCredential = (
  account: string,
  credential: string | null
): void => setJsonItem(account, credential);
export const removeCredential = (account: string): void => removeItem(account);
