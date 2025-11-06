export interface UserProfile {
  id: number;
  name: string;
  avatarUrl: string;
}

export const USER_PROFILES: UserProfile[] = [
  {
    id: 1,
    name: 'Chris',
    avatarUrl: 'https://picsum.photos/seed/avatar1/80/80',
  },
  {
    id: 2,
    name: 'Jane',
    avatarUrl: 'https://picsum.photos/seed/avatar2/80/80',
  },
  {
    id: 3,
    name: 'Kids',
    avatarUrl: 'https://picsum.photos/seed/avatar3/80/80',
  },
];
