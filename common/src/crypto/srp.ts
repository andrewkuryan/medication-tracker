type HashFunction = (value: string) => string

export default class SRPGenerator {
  protected readonly k: bigint;

  protected readonly NHash: bigint;

  protected readonly gHash: bigint;

  constructor(
      protected readonly N: bigint,
      protected readonly g: bigint,
      protected readonly hash: HashFunction,
  ) {
    this.k = BigInt(`0x${hash(N.toString(16) + g.toString(16))}`) % N;
    this.NHash = BigInt(`0x${hash(N.toString(16))}`);
    this.gHash = BigInt(`0x${hash(g.toString(16))}`);
  }

  protected computeScrambler = (clientPublicKey: bigint, serverPublicKey: bigint) => {
    const scramblerHash = this.hash(clientPublicKey.toString(16) + serverPublicKey.toString(16));
    return BigInt(`0x${scramblerHash}`) % (this.N - BigInt(1));
  };

  computeClientIdentity = (
    email: string,
    salt: string,
    clientPublicKey: bigint,
    serverPublicKey: bigint,
    sessionKey: string,
  ) => this.hash(
    // eslint-disable-next-line no-bitwise
    (this.NHash ^ this.gHash).toString(16) + this.hash(email) + salt
      + clientPublicKey.toString(16)
      + serverPublicKey.toString(16)
      + sessionKey,
  );

  computeServerIdentity = (
    clientPublicKey: bigint,
    clientIdentity: string,
    sessionKey: string,
  ): string => this.hash(clientPublicKey.toString(16) + clientIdentity + sessionKey);
}
