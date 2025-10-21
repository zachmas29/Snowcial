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
