import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import configs from '../config.json';

function fetchQuery(operation, variables) {
  return fetch(configs.explorerUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  }).then(response => {
    return response.json();
  });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
});

export default environment;
