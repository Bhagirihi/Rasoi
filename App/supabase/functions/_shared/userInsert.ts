/** rasoi.User.id has no DB default — Prisma used cuid(); UUID is fine for edge inserts. */
export function createRasoiUserId(): string {
  return crypto.randomUUID();
}

export function newUserRowIds(now: string): { id: string; updatedAt: string } {
  return {
    id: createRasoiUserId(),
    updatedAt: now,
  };
}
