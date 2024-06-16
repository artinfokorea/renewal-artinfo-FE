'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { useController, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import * as yup from 'yup';
import { useHookFormMask } from 'use-mask-input';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import useToast from '@/hooks/useToast';
import {
  checkEmailVerificationCode,
  isDuplicateEmail,
  sendEmailVerificationCode,
  signUp,
} from '@/apis/auth';
import { useRouter } from 'next/navigation';
import { useLoading } from '@toss/use-loading';

const schema = yup
  .object({
    email: yup
      .string()
      .email('이메일 형식이 아닙니다.')
      .required('이메일을 입력해주세요.'),
    password: yup
      .string()
      .min(8, '8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.')
      .max(12, '8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.')
      .required()
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/,
        '8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.'
      ),
    rePassword: yup
      .string()
      .required('재확인 비밀번호를 입력해주세요.')
      .oneOf([yup.ref('password')], '재확인 비밀번호가 일치 하지 않습니다.'),
    name: yup
      .string()
      .min(2, '이름은 2글자 이상 입력해주세요.')
      .max(6, '이름은 6글자 이하로 입력해주세요.')
      .required('이름을 입력해주세요.'),
    isEmailVerified: yup
      .boolean()
      .oneOf([true], '이메일 중복검사를 완료해주세요.')
      .default(false),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const SignUpForm = () => {
  const [isPending, startTransition] = useLoading();
  const [isEmailDuplicateLoading, startEmailDuplicateTransition] = useLoading();
  const [isEmailVerifiedLoading, startEmailVerifiedTransition] = useLoading();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerifiedCode, setEmailVerifiedCode] = useState('');
  const { successToast, errorToast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getFieldState,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const router = useRouter();

  const handleSignUp = async (payload: FormData) => {
    try {
      await startTransition(
        signUp({
          name: payload.name,
          email: payload.email,
          password: payload.password,
        })
      );
      router.push('sign-in');
      successToast('회원가입이 완료되었습니다. 로그인 해주세요.');
    } catch (error: any) {
      errorToast(error.message);
      console.log(error.message);
    }
  };

  const isDuplicate = async () => {
    try {
      const response: { existence: boolean } =
        await startEmailDuplicateTransition(isDuplicateEmail(watch('email')));
      if (response.existence) {
        errorToast('이미 사용중인 이메일입니다.');
        return;
      }
      await startEmailDuplicateTransition(
        sendEmailVerificationCode(watch('email'))
      );
      successToast('사용 가능한 이메일입니다.');
      setIsEmailVerified(true);
    } catch (error: any) {
      errorToast(error.message);
      console.log(error.message);
    }
  };

  const checkEmailVerifiedCode = async () => {
    try {
      await startEmailVerifiedTransition(
        checkEmailVerificationCode(watch('email'), emailVerifiedCode)
      );
      successToast('이메일 인증이 완료되었습니다.');
      setValue('isEmailVerified', true);
    } catch (error: any) {
      errorToast(error.message);
      console.log(error.message);
    }
  };

  const emailIsValid = useMemo(() => {
    const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailRegex.test(watch('email'));
  }, [watch('email')]);

  return (
    <form
      className="max-w-[500px] mx-auto mt-20 md:mt-40 px-4"
      onSubmit={handleSubmit(handleSignUp)}
    >
      <h2 className="text-2xl font-bold text-main text-center mb-8">
        회원가입
      </h2>
      <div className="grid items-center gap-4 my-4 text-primary">
        <Label htmlFor="이름">이름</Label>
        <Input
          {...register('name')}
          type="text"
          placeholder="이름"
          autoComplete="name"
        />
        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => (
            <p className="text-error font-semibold">{message}</p>
          )}
        />
      </div>
      <div className="grid items-center gap-4 my-4 text-primary">
        <Label htmlFor="이메일">이메일</Label>
        <div className="relative">
          <Input
            {...register('email')}
            name="email"
            type="email"
            placeholder="이메일"
            autoComplete="email"
          />
          <Button
            type="button"
            onClick={isDuplicate}
            disabled={!emailIsValid || isEmailDuplicateLoading}
            className="absolute top-1 right-2 bg-main text-white rounded-lg h-8"
          >
            이메일 인증
          </Button>
        </div>
      </div>
      <div>
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => (
            <p className="text-error font-semibold">{message}</p>
          )}
        />
        <ErrorMessage
          errors={errors}
          name="isEmailVerified"
          render={({ message }) => (
            <p className="text-error font-semibold">{message}</p>
          )}
        />
      </div>
      {isEmailVerified && (
        <div className="grid items-center gap-4 my-4 text-primary">
          <Label htmlFor="이메일">이메일 인증코드</Label>
          <div className="relative">
            <Input
              value={emailVerifiedCode}
              onChange={(e) => setEmailVerifiedCode(e.target.value)}
              type="text"
              placeholder="이메일 인증코드"
            />
            <Button
              type="button"
              disabled={isEmailVerifiedLoading}
              onClick={checkEmailVerifiedCode}
              className="absolute top-1 right-2 bg-main text-white rounded-lg h-8"
            >
              인증번호 확인
            </Button>
          </div>
        </div>
      )}
      <div className="grid items-center gap-4 my-4 text-primary">
        <Label htmlFor="비밀번호">비밀번호</Label>
        <Input
          {...register('password')}
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
        />
        <ErrorMessage
          errors={errors}
          name="password"
          render={({ message }) => (
            <p className="text-error font-semibold">{message}</p>
          )}
        />
      </div>
      <div className="grid items-center gap-4 my-4 text-primary">
        <Label htmlFor="비밀번호">비밀번호 확인</Label>
        <Input
          {...register('rePassword')}
          type="password"
          placeholder="비밀번호 확인"
          autoComplete="current-password"
        />
        <ErrorMessage
          errors={errors}
          name="rePassword"
          render={({ message }) => (
            <p className="text-error font-semibold">{message}</p>
          )}
        />
      </div>

      {/* <div className="grid items-center gap-4 my-4 text-primary">
        <Label htmlFor="이름">휴대폰 번호</Label>
        <Input
          {...registerWithMask("phone", "010-9999-9999", {
            required: true,
          })}
          type="text"
          placeholder="010-0000-0000"
          autoComplete="phone"
        />
        <ErrorMessage
          errors={errors}
          name="phone"
          render={({ message }) => (
            <p className="text-error font-semibold">{message}</p>
          )}
        />
      </div> */}
      <Button
        type="submit"
        className="bg-main w-full my-4 hover:bg-main text-white"
        disabled={isPending}
      >
        회원가입
      </Button>
    </form>
  );
};

export default SignUpForm;
