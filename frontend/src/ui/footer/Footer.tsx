'use client';

import { Typography, Tooltip } from 'antd';
import { useTheme } from 'next-themes';
import { tools, socials } from './footerConfig';
import './footer.css';
import './responsive.css';

const { Title } = Typography;

export const Footer = () => {
  const { resolvedTheme } = useTheme();

  return (
    <footer>
      <div className='footer_myinfo'>
        <Title
          level={5}
          className='footer_myinfo_title'
          style={{
            margin: '0px 0px 10px 0px',
            fontStyle: 'italic',
            textAlign: 'center',
            color: resolvedTheme === 'dark' ? '#A0C4FF' : '#5A8DFF',
          }}
        >
          Developer:
        </Title>
        <ul className='footer_list myinfo'>
          <li className='footer_list_item myinfo'>Darijman</li>
          <li className='footer_list_item myinfo'>2025</li>
        </ul>
      </div>

      <div className='footer_social_networks'>
        <Title
          level={5}
          className='footer_myinfo_title'
          style={{
            margin: '0px 0px 10px 0px',
            fontStyle: 'italic',
            textAlign: 'center',
            color: resolvedTheme === 'dark' ? '#A0C4FF' : '#5A8DFF',
          }}
        >
          Socials:
        </Title>
        <ul className='footer_list social_network'>
          {socials.map((social) => {
            const { id, tooltipText, href } = social;
            const Icon = social.icon;

            return (
              <li key={id} className='footer_list_item social_network'>
                <Tooltip title={tooltipText} placement='bottom' color='var(--foreground-color)' trigger='hover'>
                  <a className='footer_link social_network' href={href} target='_blank' rel='noopener noreferrer'>
                    <Icon />
                  </a>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </div>

      <div className='footer_tools'>
        <Title
          level={5}
          className='footer_myinfo_title'
          style={{
            margin: '0px 0px 10px 0px',
            fontStyle: 'italic',
            textAlign: 'center',
            color: resolvedTheme === 'dark' ? '#A0C4FF' : '#5A8DFF',
          }}
        >
          Tools:
        </Title>
        <ul className='footer_list tools'>
          {tools.map((tool) => {
            const { id, name, tooltipText, href } = tool;

            return (
              <li key={id} className='footer_list_item tools'>
                <Tooltip title={tooltipText} placement='bottom' color='var(--foreground-color)' trigger='hover'>
                  <a className='footer_link tools' href={href} target='_blank' rel='noopener noreferrer'>
                    {name}
                  </a>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
};
