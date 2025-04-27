export const generatePlayerID = () => {
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `bq${randomPart}`;
};