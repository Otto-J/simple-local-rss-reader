export interface Podcast {
  id?: number;
  title: string;
  link: string;
  author: string;
  extrInfo: {
    category: string;
    language: string;
  };
  description: string;
  cover: string;
  isPodcast: boolean;
  remark: string;
  createTime: string;
  updateTime: string;
}

export interface User {
  id?: number;
  name: string;
  readList: string[];
  createTime: string;
  updateTime: string;
}

export interface UserNote {
  id?: number;
  title: string;
  content: string;
  createTime: string;
  updateTime: string;

  // 关联
  itemId: string;
}

export interface IPodcastItem {
  id?: number;
  title: string;
  content: string;
  pubDate: string;
  link: string;
  cover: string;
  duration: string;
  guid: string;
  createTime?: string;
  updateTime?: string;

  media: {
    length: string;
    type: string;
    url: string;
  };
  // relation
  podcastId: number;
}
