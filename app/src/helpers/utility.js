export const getFullUrl = (url) => {
  if (url) {
  
    return `${process.env.REACT_APP_BASE_URL}/${url}`;
  } else {
    return process.env.REACT_APP_BASE_URL;
  }
};
