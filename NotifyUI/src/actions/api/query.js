const query = async(token, request, method, body) => {
  let config = { method };

  if (token)
    config.headers = new Headers({ 'Authorization': token });
  if (method === 'POST')
    config.body = JSON.stringify(body);

  try {
    let response = await fetch(request, config);
    let data = await response.json();
    return Promise.resolve(data);
  } catch(err) {
    return Promise.reject(err);
  }
};

module.exports = {
  query
};