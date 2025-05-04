import { ComponentType } from 'react';
import { LinkedinOutlined, InstagramOutlined, GithubOutlined } from '@ant-design/icons';

interface Tool {
  id: number;
  name: string;
  tooltipText: string;
  href: string;
}

interface SocialNetwork {
  id: number;
  icon: ComponentType;
  tooltipText: string;
  href: string;
}

export const tools: Tool[] = [
  { id: 1, name: 'Antd', tooltipText: 'Ant Design', href: 'https://ant.design/' },
  { id: 2, name: 'Next.js', tooltipText: 'Next.js', href: 'https://nextjs.org/' },
  { id: 3, name: 'Nest.js', tooltipText: 'NestJS', href: 'https://nestjs.com/' },
  { id: 4, name: 'Redis', tooltipText: 'Redis', href: 'https://redis.io/' },
  { id: 5, name: 'MySQL', tooltipText: 'MySQL', href: 'https://www.mysql.com/' },
];

export const socials: SocialNetwork[] = [
  { id: 1, icon: LinkedinOutlined, tooltipText: 'LinkedIn', href: 'https://www.linkedin.com/in/дамир-аблиханов-72ba05326/' },
  { id: 2, icon: InstagramOutlined, tooltipText: 'Instagram', href: 'https://www.instagram.com/_dom1r/' },
  { id: 3, icon: GithubOutlined, tooltipText: 'Github', href: 'https://github.com/Darijman' },
];
