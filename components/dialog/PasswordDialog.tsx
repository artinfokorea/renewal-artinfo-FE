import * as yup from "yup"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import CloseIcon from "../icons/CloseIcon"
import { Button } from "../ui/button"
import InputField from "../common/InputField"
import { Label } from "../ui/label"
import { useState } from "react"
import { passwordRegex } from "@/lib/schemas"

const schema = yup
  .object({
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
        passwordRegex,
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
  open: boolean
  close: () => void
  isLoading: boolean
  handlePassword: (payload: PasswordFormData) => void
  sendEmailVerifyCode: () => Promise<void>
  checkEmailVerifyCode: (verifyEmailCode: string) => Promise<void>
}

const PasswordDialog = ({
  open,
  close,
  isLoading,
  handlePassword,
  sendEmailVerifyCode,
  checkEmailVerifyCode,
}: Props) => {
  const [isSendEmail, setIsSendEmail] = useState(false)
  const [isVerifyEmail, setIsVerifyEmail] = useState(false)
  const [verifyCode, setVerifyCode] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(schema),
  })

  const sendEmail = async () => {
    try {
      setIsVerifyEmail(false)
      await sendEmailVerifyCode()
      setIsSendEmail(true)
    } catch (error) {
      console.error("이메일 전송 실패", error)
    }
  }
  const checkEmail = async () => {
    setIsSendEmail(false)
    try {
      await checkEmailVerifyCode(verifyCode)
      setValue("isEmailVerified", true)
      setIsVerifyEmail(true)
    } catch (error) {
      console.error("이메일 인증 실패", error)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      className="relative z-50 flex items-center justify-center rounded-lg"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <form className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="z-10 mx-auto h-[460px] w-full rounded-xl bg-white py-4 md:max-w-[450px]">
          <div className="relative mb-4">
            <DialogTitle className="flex-1 text-center font-semibold md:text-lg">
              비밀번호 변경
            </DialogTitle>
            <Button
              type="button"
              onClick={close}
              className="absolute -top-[8px] right-2"
            >
              <CloseIcon className="h-6 w-6 text-silver" />
            </Button>
          </div>
          <div className="border-b-2 border-whitesmoke" />

          <div className="p-4 md:p-6">
            <p className="text-sm font-medium text-silver">
              가입한 이메일로 인증번호를 보내드립니다.
            </p>
            <div className="my-2 flex flex-col gap-2">
              <Label
                htmlFor="이메일 인증 코드"
                className="text-tertiary block pb-1 text-sm font-semibold"
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
                    disabled={verifyCode.length !== 6 || isVerifyEmail}
                    className="bg-blue-800 text-white"
                    onClick={checkEmail}
                  >
                    인증
                  </Button>
                  <Button
                    type="button"
                    disabled={isSendEmail}
                    onClick={sendEmail}
                    className="bg-error text-white"
                  >
                    요청
                  </Button>
                </div>
              </div>
              {errors && (
                <p className="mt-1 pl-2 text-xs text-error">
                  {errors.isEmailVerified?.message}
                </p>
              )}
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
            <div className="mt-4 flex justify-center gap-4">
              <Button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit(handlePassword)}
                className="w-full rounded-lg bg-main text-sm text-white"
              >
                비밀번호 변경
              </Button>
            </div>
          </div>
        </DialogPanel>
      </form>
    </Dialog>
  )
}

export default PasswordDialog
