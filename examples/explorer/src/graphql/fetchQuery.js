import { fetchQuery } from 'relay-runtime';
import environment from './environment';

const fetch = env => (query, variables) => {
  return fetchQuery(env, query, variables);
};

export default fetch(environment);
