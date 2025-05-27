'use client';

import { Button, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { benefits } from './homeConfig';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Lenis from 'lenis';
import './home.css';
import './responsive.css';

const { Title, Paragraph } = Typography;

export default function Home() {
  const router = useRouter();
  const scrollWrapper = useRef(null);
  const scrollContent = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      wrapper: scrollWrapper.current || undefined,
      content: scrollContent.current || undefined,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      lerp: 0.05,
      wheelMultiplier: 1.5,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    container: scrollWrapper,
  });

  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Home
      </Title>

      <div className='home_main'>
        <div className='home_left'>
          <div style={{ width: '100%', height: 4, backgroundColor: 'grey', overflow: 'hidden', borderRadius: '5px' }}>
            <motion.div style={{ height: 4, backgroundColor: 'var(--primary-text-color)', width: progress }} />
          </div>

          <div ref={scrollWrapper} className='home_images_list_container'>
            <ul ref={scrollContent} className='home_benefits_list'>
              {benefits.map(({ id, title, text, imgSrc }) => (
                <li key={id} className='home_benefits_list_item'>
                  <Title level={3} style={{ margin: 0, color: 'var(--submit-button-color)', textTransform: 'capitalize' }}>
                    {title}
                  </Title>
                  <hr />
                  <Image className='home_productivity_image' src={imgSrc} alt={title} width={400} height={400} />
                  <Paragraph style={{ fontSize: '16px' }}>{text}</Paragraph>
                </li>
              ))}
              <div style={{ height: '20px' }}></div>
            </ul>
          </div>
        </div>

        <span className='blur'></span>
        <span className='blur'></span>

        <div className='home_right'>
          <Title level={3} style={{ margin: 0, color: 'var(--submit-button-color)', textAlign: 'center' }}>
            Finance-Tracking Benefits:
          </Title>
          <hr style={{ border: '2px solid var(--border-color)', borderRadius: '10px' }} />
          <ul className='home_right_benefits_list'>
            <li className='home_right_benefits_list_item'>
              {' '}
              Keep your <span style={{ color: 'var(--red-color)' }}>financial thoughts</span> organized with Finance-Tracking Notes.
            </li>
            <li className='home_right_benefits_list_item'>
              Jot down your budgeting <span style={{ color: 'var(--red-color)' }}>ideas</span>, savings{' '}
              <span style={{ color: 'var(--red-color)' }}>goals</span> all in one place.
            </li>
            <li className='home_right_benefits_list_item'>
              {' '}
              Stay on top of your financial planning by adding quick notes on your expenses, future{' '}
              <span style={{ color: 'var(--red-color)' }}>financial plans</span>, or just reflections on your money habits.
            </li>
          </ul>
          <hr style={{ border: '2px solid var(--border-color)', borderRadius: '10px' }} />
          <Paragraph style={{ fontSize: '18px', padding: '10px', textAlign: 'center' }}>
            Whether you’re tracking spending trends or brainstorming your next big investment, this app helps you keep everything organized
            and accessible — making financial planning simple and stress-free.
          </Paragraph>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type='primary' onClick={() => router.push(`/addNote`)}>
              Start Tracking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
