import { create } from './index';

const params = {
  host: 'localhost',
  port: 3031,
  url: 'http://localhost:3031',
};

create(params).then(() => {
  console.log('Server is up!');
});
