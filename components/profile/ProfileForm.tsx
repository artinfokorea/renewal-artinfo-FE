import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "@headlessui/react"
import CloseIcon from "../icons/CloseIcon"
import CameraIcon from "../icons/CameraIcon"
import CalendarIcon from "../icons/CalendarIcon"
import { ErrorMessage } from "@hookform/error-message"
import filters from "@/lib/filters"
import Image from "next/image"
import FileUploader from "../common/FileUploader"
import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form"
import { USER } from "@/types/users"
import { Badge } from "../ui/badge"
import { SchoolTypeValues } from "@/types/lessons"
import { Button } from "../ui/button"
import { MAJOR } from "@/types/majors"
import { ProfileFormData } from "./ProfileContainer"
import FallbackImage from "../common/FallbackImage"
import { Spinner } from "../common/Loading"
import InputField from "../common/InputField"

interface Props {
  user?: USER
  isUpdateForm: boolean
  isImageUploadLoading: boolean
  isUpdateProfileLoading: boolean
  isDirty: boolean
  handleUpdateForm: () => void
  handleUploadedFiles: (files: File[]) => void
  handlePhoneDialog: () => void
  handleMajorDialog: () => void
  handleSelectMajor: (major: MAJOR) => void
  handleSubmit: () => void
  handlePasswordDialog: () => void
  register: UseFormRegister<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  watch: UseFormWatch<ProfileFormData>
  setValue: UseFormSetValue<ProfileFormData>
}

const ProfileForm = ({
  user,
  register,
  watch,
  errors,
  setValue,
  isUpdateForm,
  isImageUploadLoading,
  handlePhoneDialog,
  isUpdateProfileLoading,
  isDirty,
  handleMajorDialog,
  handleUpdateForm,
  handleSubmit,
  handleSelectMajor,
  handleUploadedFiles,
  handlePasswordDialog,
}: Props) => {
  const pathname = usePathname()
  const fileUploader = useRef<HTMLInputElement>(null)
  const filter = filters()

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  return (
    <form className="mt-12 flex">
      <div className="hidden w-[300px] flex-col gap-4 whitespace-nowrap border-r-2 border-whitesmoke p-4 md:flex md:p-8">
        <ul>
          <li>
            <Link
              href="/my-profile"
              className={`my-4 text-lg font-semibold ${
                pathname === "/my-profile" && "text-main"
              }`}
            >
              프로필
            </Link>
          </li>
          <li className="my-4 text-lg font-semibold">내 활동</li>
        </ul>
      </div>
      <div className="flex-1 px-8 py-2 md:ml-12 md:py-6">
        <div className="flex flex-col md:flex-row md:gap-20">
          <div className="relative flex h-[150px] flex-col items-center">
            <div className="relative h-[150px]">
              {isImageUploadLoading ? (
                <div className="flex h-[150px] w-[150px] items-center justify-center">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : (
                <>
                  <Avatar className="h-[150px] w-[150px]">
                    <FallbackImage
                      src={watch("imageUrl") || ""}
                      alt="user_profile_image"
                      fill
                      sizes="150px"
                      quality={100}
                      priority
                      className="rounded-full"
                    />
                    <AvatarFallback>
                      <AvatarImage
                        src={"/img/placeholder-user.png"}
                        alt="user_profile_image"
                        className="h-[150px] w-[150px] rounded-full object-cover"
                      />
                    </AvatarFallback>
                  </Avatar>
                  {watch("imageUrl") && isUpdateForm && (
                    <Button
                      type="button"
                      onClick={() => setValue("imageUrl", "")}
                      className="absolute right-0 top-0 rounded-full bg-white p-2 text-lg font-semibold text-black opacity-55"
                    >
                      <CloseIcon className="h-6 w-6" />
                    </Button>
                  )}
                  {isUpdateForm && (
                    <button
                      type="button"
                      disabled={isImageUploadLoading}
                      className="absolute bottom-0 right-0 mt-12 rounded-full border border-white bg-blue-500 p-[5px]"
                      onClick={openFileUploader}
                    >
                      <CameraIcon className="h-6 w-6 text-white" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 text-base md:mt-0 md:gap-0 md:text-lg">
            <div className="mb-2 mt-8 flex items-center gap-4 font-medium">
              {isUpdateForm ? (
                <div className="flex flex-col">
                  <Input
                    {...register("name")}
                    className="mx-auto w-[150px] rounded-lg border px-2 py-1 focus:outline-none md:ml-10 md:w-[200px]"
                    placeholder="이름을 입력해주세요."
                  />
                  <ErrorMessage
                    errors={errors}
                    name="name"
                    render={({ message }) => (
                      <p className="text-xs font-semibold text-error">
                        {message}
                      </p>
                    )}
                  />
                </div>
              ) : (
                <h4 className="mx-auto text-xl font-bold md:ml-10">
                  {user?.name}
                </h4>
              )}
            </div>
            {isUpdateForm ? (
              <div className="my-8 flex justify-center gap-4 md:hidden">
                <Button
                  type="button"
                  onClick={handleUpdateForm}
                  className="w-[70px] rounded-full border font-semibold"
                >
                  취소
                </Button>
                <Button
                  disabled={isUpdateProfileLoading || !isDirty}
                  type="button"
                  onClick={handleSubmit}
                  className="w-[70px] rounded-full bg-main font-semibold text-white"
                >
                  확인
                </Button>
              </div>
            ) : (
              <div className="my-8 flex justify-center gap-4 md:hidden">
                <Button
                  type="button"
                  onClick={handlePasswordDialog}
                  className="rounded-full border font-semibold"
                >
                  비밀번호 변경
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateForm}
                  className="rounded-full bg-main px-6 font-semibold text-white"
                >
                  내정보 수정
                </Button>
              </div>
            )}
            <div className="mb-2 flex items-center gap-4 font-medium">
              <Image
                src="/icon/user-profile.png"
                alt="user_icon"
                width={24}
                height={24}
              />
              {isUpdateForm ? (
                <div className="flex flex-col">
                  <Input
                    {...register("nickname")}
                    className="w-full rounded-lg border px-2 py-1 focus:outline-none md:w-[200px]"
                    placeholder="닉네임을 입력해주세요."
                  />
                  <ErrorMessage
                    errors={errors}
                    name="nickname"
                    render={({ message }) => (
                      <p className="text-xs font-semibold text-error">
                        {message}
                      </p>
                    )}
                  />
                </div>
              ) : (
                <span>{user?.nickname}</span>
              )}
            </div>
            <div className="mb-2 flex items-center gap-4 font-medium">
              <Image
                src="/icon/email.png"
                alt="email_icon"
                width={24}
                height={24}
              />
              <span>{user?.email}</span>
            </div>
            <div className="mb-2 flex items-center gap-4 font-medium">
              <CalendarIcon className="h-6 w-6" />
              {isUpdateForm ? (
                <div className="flex flex-col">
                  <Input
                    {...register("birth")}
                    type="date"
                    className="w-full rounded-lg border px-2 py-1 focus:outline-none md:w-[200px]"
                    placeholder="1945.08.15"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="birth"
                    render={({ message }) => (
                      <p className="text-xs font-semibold text-error">
                        {message}
                      </p>
                    )}
                  />
                </div>
              ) : (
                <span>{filter.YYYYMMDD(user?.birth, "YYYY-MM-DD")}</span>
              )}
            </div>
            <div className="mb-2 flex items-center gap-4 font-medium">
              <Image
                src="/icon/phone.png"
                alt="phone_icon"
                width={24}
                height={24}
              />
              {watch("phone") ? (
                <span>{watch("phone")}</span>
              ) : (
                <Button
                  type="button"
                  onClick={handlePhoneDialog}
                  className="h-8 border text-base font-semibold text-main"
                >
                  휴대폰 번호 등록
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 text-base md:text-lg">
          <div className="flex items-center gap-6">
            <span className="whitespace-nowrap font-bold">전공</span>
            <div className="flex items-center gap-2">
              {isUpdateForm && (
                <button
                  type="button"
                  onClick={handleMajorDialog}
                  className="h-8 whitespace-nowrap rounded-lg border px-2 text-sm font-semibold text-main"
                >
                  전공 등록
                </button>
              )}
              <div className="flex flex-wrap gap-2">
                {watch("majors")?.map(major => (
                  <Badge
                    key={major.id}
                    className="mx-1 rounded-xl bg-main text-xs text-white md:text-sm"
                  >
                    <span>{major.koName}</span>
                    {isUpdateForm && (
                      <button
                        type="button"
                        onClick={() => handleSelectMajor(major)}
                      >
                        <CloseIcon className="ml-1 h-4 w-4 pb-[2px]" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              <ErrorMessage
                errors={errors}
                name="majors"
                render={({ message }) => (
                  <p className="font-semibold text-error">{message}</p>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">학력</span>
            {isUpdateForm ? (
              <div>
                <div className="my-2 flex items-center gap-6">
                  <Image
                    src="/icon/bachelor.png"
                    alt="bachelor_degree_icon"
                    width={28}
                    height={28}
                  />
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-sm">학사</span>
                    <Input
                      {...register("bachellor")}
                      placeholder="대학교 명을 입력해주세요."
                      className="w-full rounded-lg border px-2 py-1 focus:outline-none md:w-[350px]"
                    />
                  </div>
                </div>
                <div className="my-2 flex items-center gap-6">
                  <Image
                    src="/icon/master.png"
                    alt="master_degree_icon"
                    width={28}
                    height={28}
                  />
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-sm">석사</span>
                    <Input
                      {...register("master")}
                      placeholder="대학원 명을 입력해주세요."
                      className="w-full rounded-lg border px-2 py-1 focus:outline-none md:w-[350px]"
                    />
                  </div>
                </div>
                <div className="my-2 flex items-center gap-6">
                  <Image
                    src="/icon/doctor.png"
                    alt="doctor_degree_icon"
                    width={28}
                    height={28}
                  />
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-sm">박사</span>
                    <Input
                      {...register("doctor")}
                      placeholder="대학원 명을 입력해주세요."
                      className="w-full rounded-lg border px-2 py-1 focus:outline-none md:w-[350px]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[200px]">
                {watch("bachellor") && (
                  <div className="mb-2 flex items-center gap-6 md:gap-12">
                    <Image
                      src="/icon/bachelor.png"
                      alt="bachelor_degree_icon"
                      width={28}
                      height={28}
                    />
                    <div>
                      <h5 className="text-base font-semibold text-primary">
                        {watch("bachellor")}
                      </h5>
                      <p className="text-sm text-coolgray">
                        {SchoolTypeValues.UNDERGRADUATE}
                      </p>
                    </div>
                  </div>
                )}
                {watch("master") && (
                  <div className="mb-2 flex items-center gap-6 md:gap-12">
                    <Image
                      src="/icon/master.png"
                      alt="master_degree_icon"
                      width={28}
                      height={28}
                    />
                    <div>
                      <h5 className="text-base font-semibold text-primary">
                        {watch("master")}
                      </h5>
                      <p className="text-sm text-coolgray">
                        {SchoolTypeValues.MASTER}
                      </p>
                    </div>
                  </div>
                )}
                {watch("doctor") && (
                  <div className="mb-2 flex items-center gap-6 md:gap-12">
                    <Image
                      src="/icon/doctor.png"
                      alt="doctor_degree_icon"
                      width={28}
                      height={28}
                    />
                    <div>
                      <h5 className="text-base font-semibold text-primary">
                        {watch("doctor")}
                      </h5>
                      <p className="text-sm text-coolgray">
                        {SchoolTypeValues.DOCTOR}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {isUpdateForm ? (
          <div className="mt-8 hidden justify-end gap-4 md:flex">
            <Button
              type="button"
              onClick={handleUpdateForm}
              className="w-[70px] rounded-full border font-semibold"
            >
              취소
            </Button>
            <Button
              disabled={isUpdateProfileLoading || !isDirty}
              type="button"
              onClick={handleSubmit}
              className="w-[70px] rounded-full bg-main font-semibold text-white"
            >
              확인
            </Button>
          </div>
        ) : (
          <div className="hidden justify-end gap-4 md:flex">
            <Button
              onClick={handlePasswordDialog}
              type="button"
              className="rounded-full border font-semibold"
            >
              비밀번호 변경
            </Button>
            <Button
              type="button"
              onClick={handleUpdateForm}
              className="rounded-full bg-main px-6 font-semibold text-white"
            >
              내정보 수정
            </Button>
          </div>
        )}
      </div>
      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
    </form>
  )
}

export default ProfileForm
