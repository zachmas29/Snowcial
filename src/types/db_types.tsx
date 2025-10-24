export interface User {
  id: number;
  lastUpdated: Date;
  lastActive: Date;
  firstName: string;
  lastName: string;
  email: string;
  nickname?: string;
  bioText?: string;
  profilePhotoPath?: string;
  bannerPhotoPath?: string;
}

export interface Event {
  id: number;
  creatorId: number;
  createdAt: Date;
  lastUpdated: Date;
  eventTime: Date;
  title: string;
  description?: string;
}
