import process from 'process';

export const jwtConstants = {
  secret: process?.env?.secretjwt || 'secret word',
};
