import qs from 'qs';

function post(url, body, query) {
  if (query) {
    url = url.concat('?').concat(qs.stringify(query));
  }

  return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body)
    })
    .then(checkStatus)
    .then(parseJSON);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function get(url, query) {
  if (query) {
    url = url.concat('?').concat(qs.stringify(query));
  }

  return fetch(url, { accept: "application/json" })
    .then(checkStatus)
    .then(parseJSON)
}

export default {
  post, get
};
