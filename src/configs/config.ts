import { Config } from './config.interface';

export const config: Config = {
  nest: {
    port: 3030,
  },
  cors: {
    enabled: true,
  },
  security: {
    expiresIn: '1y',
    refreshIn: '7d',
    bcryptSaltOrRound: '10',
  },
};

export default (): Config => config;
