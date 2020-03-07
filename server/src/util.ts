export const toRadians = (deg: number) => Math.PI / 180 * deg;
export const toDegrees = (rad: number) => 180 / Math.PI * rad;

export const map = (n: number, in_min: number, in_max: number, out_min: number, out_max: number) =>
  (n - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;


export function assertUnreachable(_data: never): never {
  throw new Error('Reached unreachable code');
}
