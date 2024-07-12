// eslint-disable-next-line import/prefer-default-export
export function modExp(base: bigint, exp: bigint, N: bigint): bigint {
  if (exp === BigInt(0)) {
    return BigInt(1);
  }
  const z = modExp(base, exp / BigInt(2), N);
  if (exp % BigInt(2) === BigInt(0)) {
    return (z * z) % N;
  }
  return (base * z * z) % N;
}
