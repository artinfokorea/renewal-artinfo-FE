"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { useState } from "react"
import InputField from "../common/InputField"
import InputWithButton from "../common/InputWithButton"
import Link from "next/link"

const schema = yup
  .object({
    email: yup
      .string()
      .email("이메일 형식이 아닙니다.")
      .required("이메일은 필수입력 사항입니다."),
    isEmailVerified: yup
      .boolean()
      .oneOf([true], "이메일 인증을 완료해주세요.")
      .default(false),
    password: yup
      .string()
      .min(8, "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.")
      .max(12, "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.")
      .required()
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/,
        "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.",
      ),
    rePassword: yup
      .string()
      .required("재확인 비밀번호를 입력해주세요.")
      .oneOf([yup.ref("password")], "재확인 비밀번호가 일치 하지 않습니다."),
  })
  .required()

export type PasswordFormData = yup.InferType<typeof schema>

interface Props {
  isLoading: boolean
  sendCode: (email: string) => void
  checkCode: (email: string, code: string) => void
  handlePassword: (payload: PasswordFormData) => void
}

const FindPasswordForm = ({
  isLoading,
  sendCode,
  checkCode,
  handlePassword,
}: Props) => {
  const [isSendEmail, setIsSendEmail] = useState(false)
  const [verifyCode, setVerifyCode] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(schema),
  })

  const sendEmail = async () => {
    try {
      sendCode(getValues("email") as string)
      setIsSendEmail(true)
    } catch (error) {
      console.error("이메일 인증 코드 전송 실패:", error)
    }
  }
  const checkEmail = () => {
    try {
      checkCode(getValues("email") as string, verifyCode)
      setValue("isEmailVerified", true)
    } catch (error) {
      console.error("이메일 인증 코드 확인 실패:", error)
    }
  }

  return (
    <form className="max-w-[500px] mx-auto mt-12 md:mt-20 px-4">
      <Link href="/">
        <h2 className="text-4xl font-bold text-main text-center mb-12 md:mb-16">
          ARTINFO
        </h2>
      </Link>
      <InputWithButton
        label="이메일"
        id="email"
        type="email"
        register={register}
        errors={errors.email}
        placeholder="이메일을 입력하세요."
        className="py-3"
      >
        <Button
          type="button"
          onClick={sendEmail}
          disabled={isSendEmail}
          className="absolute top-1 right-2 bg-main text-white rounded-lg h-8"
        >
          인증코드 전송
        </Button>
      </InputWithButton>
      <div className="flex flex-col gap-2 my-2">
        <Label
          htmlFor="이메일 인증 코드"
          className="block pb-1 text-sm font-semibold text-tertiary"
        >
          이메일 인증 코드
        </Label>
        <div className="flex gap-2">
          <input
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            type="text"
            placeholder="인증 코드를 입력해주세요."
            className="w-full rounded border px-2 py-1.5 text-xs leading-tight text-black"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={verifyCode.length !== 6}
              onClick={checkEmail}
              className="text-white bg-main"
            >
              인증
            </Button>
          </div>
        </div>
      </div>
      <InputField
        label="패스워드"
        id="password"
        type="password"
        register={register}
        errors={errors.password}
        placeholder="비밀번호를 입력해주세요."
        className="py-3"
      />
      <InputField
        label="패스워드 확인"
        id="rePassword"
        type="password"
        register={register}
        errors={errors.rePassword}
        placeholder="비밀번호를 입력해주세요."
        className="py-3"
      />
      <div className="flex justify-center gap-4 mt-4">
        <Button
          type="button"
          disabled={isLoading}
          onClick={handleSubmit(handlePassword)}
          className="text-white rounded-lg text-sm bg-main w-full"
        >
          비밀번호 변경
        </Button>
      </div>
    </form>
  )
}

export default FindPasswordForm
