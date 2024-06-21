'use client';

import { createInquiry } from '@/apis/inquries';
import InquiryForm, { InquiryFormData } from '@/components/inquiry/InquiryForm';
import useToast from '@/hooks/useToast';
import { queries } from '@/lib/queries';
import { useQuery } from '@tanstack/react-query';
import { useLoading } from '@toss/use-loading';
import { useRouter } from 'next/navigation';
import React from 'react';

const page = () => {
  const { data: user } = useQuery(queries.users.detail());
  const [isHandleFormLoading, handleFormTransition] = useLoading();
  const router = useRouter();

  const { successToast, errorToast } = useToast();

  const handleInquiry = async (payload: InquiryFormData) => {
    try {
      await handleFormTransition(createInquiry(payload));
      successToast('문의가 성공적으로 등록되었습니다.');
      router.push('/');
    } catch (error: any) {
      errorToast(error.message);
      console.error(error);
    }
  };

  return (
    <section className="max-w-screen-sm mx-auto">
      <InquiryForm
        handleInquiry={handleInquiry}
        isLoading={isHandleFormLoading}
        user={user}
      />
    </section>
  );
};

export default page;
