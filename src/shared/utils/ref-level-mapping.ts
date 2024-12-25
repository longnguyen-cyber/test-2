export function getLevelByRefCount(refCount: number): number {
  if (refCount > 40) return 5;
  if (refCount > 30 && refCount <= 40) return 4;
  if (refCount > 20 && refCount <= 30) return 3;
  if (refCount > 10 && refCount <= 20) return 2;
  return 1;
}
