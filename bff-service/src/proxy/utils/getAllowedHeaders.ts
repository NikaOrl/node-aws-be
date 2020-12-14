const ALLOWED_HEADERS = ["authorization"];

const getAllowedHeaders = (headers = {}) =>
  Object.keys(headers).reduce((acc, headerKey) => {
    if (ALLOWED_HEADERS.includes(headerKey)) {
      acc[headerKey] = headers[headerKey];
    }
    return acc;
  }, {});

export default getAllowedHeaders;
