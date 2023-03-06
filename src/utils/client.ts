import config from 'src/config/client.json';
export default function client<T extends keyof typeof config>(name: T) {
  return config[name];
}
