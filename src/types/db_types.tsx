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

export interface UserTag {
  id: number;
  name: string;
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

export interface EventTag {
  id: number;
  name: string;
}

export interface GalleryPhoto {
  id: number;
  photoPath: string;
  createdAt: Date;
}

export interface EventRsvp {
  userId: number;
  eventId: number;
  createdAt: Date;
  status: string;
}

export interface EventComment {
  id: number;
  creatorId: number;
  eventId: number;
  createdAt: Date;
  commentText: string;
}
