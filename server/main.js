import { create } from './index';

const params = {
  host: 'localhost',
  port: 3001,
  url: 'http://localhost:3001',
};

create(params).then(() => {
  console.log('Server is up!');
});
