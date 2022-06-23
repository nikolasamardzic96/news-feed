import { newsRegex } from './constants';

export const currentNewsRegex = () => {
  const regexObject = {};
  newsRegex.map((rx, index) => {
    return (regexObject[index.toString()] = rx.toString());
  });
  return regexObject;
};
