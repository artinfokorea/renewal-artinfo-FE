"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { useLoading } from "@toss/use-loading";
import * as yup from "yup";

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

const SignUpForm = () => {
  const [isLoading, startTransition] = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  return (
    <form className="max-w-screen-sm mx-auto border mt-20">
      <h2 className="text-2xl font-bold text-main text-center">회원가입</h2>
    </form>
  );
};

export default SignUpForm;
