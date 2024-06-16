'use client';

import { queries } from '@/lib/queries';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { Suspense } from 'react';
import Loading from '../common/Loading';

const LessonDetailContainer = () => {
  const params = useParams();

  const { data: lesson } = useQuery(queries.lessons.detail(Number(params.id)));
  return <Suspense fallback={<Loading />}>LessonDetailContainer</Suspense>;
};

export default LessonDetailContainer;
