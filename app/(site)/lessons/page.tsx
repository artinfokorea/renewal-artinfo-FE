import LessonListContainer from '@/components/lessons/LessonListContainer';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: `레슨 | 아트인포`,
  description: `레슨 | 아트인포`,
  openGraph: {
    title: `레슨 | 아트인포`,
    description: '아트인포 레슨',
    images: {
      url: 'https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg',
      alt: '아트인포-ARTINFO',
    },
  },
};

const page = () => {
  return <LessonListContainer />;
};

export default page;
