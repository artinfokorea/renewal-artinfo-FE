"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { useLoading } from "@toss/use-loading";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ConfirmDialog from "../common/ConfirmDialog";
import Link from "next/link";

const schema = yup
  .object({
    email: yup
      .string()
      .email("이메일 형식이 아닙니다.")
      .required("이메일을 입력해주세요."),
    password: yup
      .string()
      .min(8, "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.")
      .max(12, "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.")
      .required()
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/,
        "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요."
      ),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const SignInForm = () => {
  const [isLoading, startTransition] = useLoading();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleDialog = () => setIsConfirmDialogOpen(!isConfirmDialogOpen);

  const handleSignIn = async (payload: FormData) => {
    //

    try {
      // startTransition
      //   const { error } = await supabase.auth.signInWithPassword({
      //     ...payload,
      //   });
      //   if (error) {
      //     throw error;
      //   }
      //   router.replace("/");
      setIsConfirmDialogOpen(true);
    } catch (error: any) {
      setIsConfirmDialogOpen(true);
    }
  };

  return (
    <form
      className="max-w-[500px] mx-auto mt-40 md:mt-60 px-4 "
      onSubmit={handleSubmit(handleSignIn)}
    >
      <h2 className="text-4xl font-bold text-main text-center">ARTINFO</h2>
      <div className="grid items-center gap-4 my-4 text-primary">
        <Label htmlFor="이메일">이메일</Label>
        <Input
          {...register("email")}
          type="email"
          placeholder="이메일"
          autoComplete="email"
        />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => (
            <p className="text-error font-semibold">{message}</p>
          )}
        />
      </div>
      <div className="grid items-center gap-4 my-4 text-primary">
        <Label htmlFor="비밀번호">비밀번호</Label>
        <Input
          {...register("password")}
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
      <Button
        type="submit"
        className="bg-main w-full my-4 hover:bg-main"
        disabled={isLoading}
      >
        로그인
      </Button>

      <p className="text-primary text-center">
        아직 회원이 아니신가요?
        <Link href="/auth/sign-up">
          <span className="text-main cursor-pointer"> 회원가입</span>
        </Link>
      </p>
      <Link href="/auth/sign-up">
        <p className="text-center text-main">아이디 또는 비밀번호 찾기</p>
      </Link>
      <div className="flex text-grey mt-2">
        <div className="border-b-2 w-full border-grey mb-3" />
        <span className="whitespace-nowrap mx-4 font-semibold">간편로그인</span>
        <div className="border-b-2 w-full border-grey mb-3" />
      </div>

      <div className="flex justify-between w-[200px] mx-auto mt-4">
        <Button
          type="button"
          className="p-1 bg-white w-[48px] h-[48px] rounded-lg transition ease-in-out duration-150 inline-flex items-center justify-center  text-white shadow-md  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 "
          disabled={isLoading}
          //   onClick={signInWithGoogle}
        >
          <img src="/google_logo.png" alt="google_logo" />
        </Button>
        <button
          type="button"
          className="w-[48px] h-[48px] rounded-lg transition ease-in-out duration-150 inline-flex items-center justify-center  text-white shadow-md  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 "
          disabled={isLoading}
          //   onClick={signInWithGoogle}
        >
          <img src="/naver_logo.png" alt="naver_logo" />
        </button>
        <button
          type="button"
          className="w-[48px] h-[48px] rounded-lg transition ease-in-out duration-150 inline-flex items-center justify-center bg-[#FEE500]  text-white shadow-md  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 "
          disabled={isLoading}
          //   onClick={signInWithGoogle}
        >
          <img src="/kakao_logo.png" alt="kakao_logo" />
        </button>
      </div>
      <ConfirmDialog
        title="로그인 실패"
        description="이메일 또는 비밀번호가 일치하지 않습니다."
        error
        isOpen={isConfirmDialogOpen}
        handleDialog={handleDialog}
      />
    </form>
  );
};

export default SignInForm;
