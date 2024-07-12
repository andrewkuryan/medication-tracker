import QuickCrypto from 'react-native-quick-crypto';

import SRPGenerator from '@common/crypto/srp';
import { modExp } from '@common/crypto/math';

export function sha3(value: string) {
  const hash = QuickCrypto.createHash('SHA3-512');
  hash.update(value);
  return hash.digest('hex');
}

export function generateRandomHex(byteSize: number): string {
  const data = new Uint8Array(byteSize);
  QuickCrypto.getRandomValues(data);
  return [...data].map((it) => it.toString(16).padStart(2, '0')).join('');
}

export function generateRandomInt(byteSize: number) {
  return BigInt(`0x${generateRandomHex(byteSize)}`);
}

export default class ClientSRPGenerator extends SRPGenerator {
  constructor(N: bigint, g: bigint) {
    super(N, g, sha3);
  }

  generateSaltVerifier = (
    login: string,
    password: string,
  ): { salt: string; verifier: bigint } => {
    const salt = generateRandomHex(32);
    const x = this.computeSecret(login, password, salt);
    const verifier = modExp(this.g, x, this.N);
    return { salt, verifier };
  };

  generateKeys = (): { privateKey: bigint; publicKey: bigint } => {
    const privateKey = generateRandomInt(256);
    return { privateKey, publicKey: modExp(this.g, privateKey, this.N) };
  };

  computeSessionKey = (
    email: string,
    password: string,
    salt: string,
    clientPublicKey: bigint,
    clientPrivateKey: bigint,
    serverPublicKey: bigint,
  ): string => {
    const scrambler = this.computeScrambler(clientPublicKey, serverPublicKey);
    const secret = this.computeSecret(email, password, salt);
    const key = modExp(
      serverPublicKey - this.k * modExp(this.g, secret, this.N),
      clientPrivateKey + scrambler * secret,
      this.N,
    );
    return this.hash(key.toString(16));
  };

  private computeSecret = (email: string, password: string, salt: string) => {
    const secretHex = this.hash(salt + this.hash(`${email}:${password}`));
    return BigInt(`0x${secretHex}`) % (this.N - BigInt(1));
  };
}
