import config from '../config/bitrix.json';
export default function client<T extends keyof typeof config>(name: T) {
  return config[name];
}
