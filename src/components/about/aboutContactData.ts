export type AboutContactIcon = 'github' | 'x' | 'email' | 'bilibili' | 'xiaohongshu' | 'douyin';

export interface AboutContact {
  id: string;
  platform: string;
  value: string;
  href: string;
  external: boolean;
  iconKey: AboutContactIcon;
}

export function getAboutContactLinkAttributes(contact: AboutContact) {
  return contact.external
    ? { target: '_blank' as const, rel: 'noopener noreferrer' as const }
    : {};
}

export const ABOUT_CONTACTS: AboutContact[] = [
  {
    id: '01',
    platform: 'GitHub',
    value: '@MuziGeek',
    href: 'https://github.com/MuziGeek',
    external: true,
    iconKey: 'github',
  },
  {
    id: '02',
    platform: 'X / Twitter',
    value: '@liduo55093',
    href: 'https://x.com/liduo55093',
    external: true,
    iconKey: 'x',
  },
  {
    id: '03',
    platform: 'Email',
    value: 'mz@easymuzi.cn',
    href: 'mailto:mz@easymuzi.cn',
    external: false,
    iconKey: 'email',
  },
  {
    id: '04',
    platform: '哔哩哔哩',
    value: 'Muzi 的视频主页',
    href: 'https://space.bilibili.com/3707054824884325',
    external: true,
    iconKey: 'bilibili',
  },
  {
    id: '05',
    platform: '小红书',
    value: 'Muzi 的图文主页',
    href: 'https://www.xiaohongshu.com/user/profile/62bc705f00000000150176c6',
    external: true,
    iconKey: 'xiaohongshu',
  },
  {
    id: '06',
    platform: '抖音',
    value: 'Muzi 的短视频主页',
    href: 'https://www.douyin.com/user/MS4wLjABAAAAGgRxKY0ytuL4W20ayHtF0aUsUH2Y9LnjFRoL-k_39ziswE91NJWSuFVTPPvyshhY',
    external: true,
    iconKey: 'douyin',
  },
];
