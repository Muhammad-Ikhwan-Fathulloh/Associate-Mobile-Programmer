export type StatusSync = 'PENDING' | 'SYNCED';

export type Catatan = {
  id?: number;
  /** Id di server. Null bila catatan belum pernah dikirim. */
  serverId: number | null;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  updatedAt: number;
  syncStatus: StatusSync;
};
