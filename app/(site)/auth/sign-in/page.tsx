import SignInForm from '@/components/sign/SignInForm';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
  title: '로그인-ARTINFO',
  description:
    '음악의 중심 아트인포! 클래식 채용, 레슨 등 모든 음악 정보를 아트인포에서 찾아보세요',
};

const page = async () => {
  const session = await getServerSession();

  if (session) {
    redirect('/');
  }

  return <SignInForm />;
};

export default page;
