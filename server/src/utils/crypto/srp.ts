import { createHash, getRandomValues } from 'node:crypto';

import { modExp } from '@common/crypto/math';
import SRPGenerator from '@common/crypto/srp';

function sha3(value: string) {
  const hash = createHash('SHA3-512');
  hash.update(value);
  return hash.digest('hex');
}

function generateRandomInt(byteSize: number) {
  const data = new Uint8Array(byteSize);
  getRandomValues(data);
  const hexString = [...data].map((it) => it.toString(16).padStart(2, '0')).join('');
  return BigInt(`0x${hexString}`);
}

export default class ServerSRPGenerator extends SRPGenerator {
  constructor(N: bigint, g: bigint) {
    super(N, g, sha3);
  }

  generateKeys = (verifier: bigint): { privateKey: bigint, publicKey: bigint } => {
    const privateKey = generateRandomInt(256);
    return { privateKey, publicKey: this.k * verifier + modExp(this.g, privateKey, this.N) };
  };

  computeSessionKey = (
    clientPublicKey: bigint,
    verifier: bigint,
    serverPrivateKey: bigint,
    serverPublicKey: bigint,
  ): string => {
    const scrambler = this.computeScrambler(clientPublicKey, serverPublicKey);
    const key = modExp(
      clientPublicKey * modExp(verifier, scrambler, this.N),
      serverPrivateKey,
      this.N,
    );
    return this.hash(key.toString(16));
  };
}
