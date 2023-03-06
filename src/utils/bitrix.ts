import config from '../config/bitrix.json';
export default (name = 'url') => {
  switch (name) {
    case 'token':
    case 'oauth':
      return config[name];
    default:
      return config.server;
  }
};
