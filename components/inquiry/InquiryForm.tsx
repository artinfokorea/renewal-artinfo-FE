import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { USER } from '@/types/users';
import { Input, Textarea } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import InputField from '../common/InputField';

const schema = yup
  .object({
    title: yup
      .string()
      .min(3, '제목은 3글자이상 입력해주세요.')
      .required('제목은 필수입력사항 입니다.'),
    email: yup
      .string()
      .email('이메일 형식이 아닙니다.')
      .required('이메일을 입력해주세요.'),
    contents: yup
      .string()
      .min(3, '내용은 10글자이상 입력해주세요.')
      .required('내용은 필수입력사항 입니다.'),
  })
  .required();

export type InquiryFormData = yup.InferType<typeof schema>;

interface Props {
  user?: USER;
  handleInquiry: (payload: InquiryFormData) => void;
  isLoading: boolean;
}

const InquiryForm = ({ user, handleInquiry, isLoading }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<InquiryFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: user?.email,
    },
  });

  const router = useRouter();

  return (
    <form className="p-6 md:p-12" onSubmit={handleSubmit(handleInquiry)}>
      <h2 className="text-xl font-bold ">문의하기</h2>
      <p className="mt-2 text-sm text-gray-500">
        문의사항이 있으시면 아래 양식을 작성해주세요.
      </p>
      <InputField
        label="제목"
        id="title"
        type="text"
        register={register}
        errors={errors.title}
        placeholder="제목 내용을 입력해주세요"
        className="py-3"
      />
      <InputField
        label="이메일"
        id="email"
        type="email"
        register={register}
        errors={errors.email}
        placeholder="답변받으실 이메일을 입력해주세요."
        className="py-3"
      />
      <div className="mt-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          문의 내용
        </label>
        <Textarea
          id="contents"
          {...register('contents')}
          placeholder="문의 내용을 입력해주세요."
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none resize-none h-[200px]"
        />
        <ErrorMessage
          errors={errors}
          name="contents"
          render={({ message }) => (
            <p className="text-error font-semibold">{message}</p>
          )}
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button
          onClick={() => router.push('/')}
          type="button"
          className="border-[3px] rounded-full font-semibold"
        >
          취소
        </Button>
        <Button
          disabled={isLoading}
          type="submit"
          className="bg-main text-white rounded-full font-semibold px-6"
        >
          등록
        </Button>
      </div>
    </form>
  );
};

export default InquiryForm;
