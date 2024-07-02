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
    <form className="flex mt-12">
      <div className="hidden md:flex flex-col gap-4 p-4 md:p-8 whitespace-nowrap border-r-2 border-whitesmoke w-[300px]">
        <ul>
          <li>
            <Link
              href="/my-profile"
              className={`my-4 font-semibold text-lg ${
                pathname === "/my-profile" && "text-main"
              }`}
            >
              프로필
            </Link>
          </li>
          <li className="my-4 font-semibold text-lg">내 활동</li>
        </ul>
      </div>
      <div className="flex-1 md:ml-12 px-8 py-2 md:py-6">
        <div className="flex flex-col md:flex-row md:gap-20">
          <div className="flex flex-col items-center relative h-[150px]">
            <div className="relative h-[100px]">
              <Avatar className="w-[150px] h-[150px]">
                <AvatarImage
                  src={watch("imageUrl") || "/img/placeholder-user.png"}
                  alt="user_profile_image"
                  className="w-[150px] h-[150px] rounded-full object-cover"
                />
                <AvatarFallback>
                  <AvatarImage
                    src={"/img/placeholder-user.png"}
                    alt="user_profile_image"
                    className="w-[150px] h-[150px] rounded-full object-cover"
                  />
                </AvatarFallback>
              </Avatar>
              {watch("imageUrl") && isUpdateForm && (
                <Button
                  type="button"
                  onClick={() => setValue("imageUrl", "")}
                  className="bg-white opacity-55 text-lg text-black font-semibold
                absolute top-0 right-0 rounded-full p-2
                "
                >
                  <CloseIcon className="w-6 h-6" />
                </Button>
              )}
              {isUpdateForm && (
                <button
                  type="button"
                  disabled={isImageUploadLoading}
                  className="mt-12 bg-blue-500 -bottom-12 right-0 p-[5px] rounded-full absolute border-white border"
                  onClick={openFileUploader}
                >
                  <CameraIcon className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-col flex gap-2 md:gap-0 mt-4 md:mt-0 text-base md:text-lg">
            <div className="flex gap-4 items-center mb-2 font-medium mt-8">
              {isUpdateForm ? (
                <>
                  <Input
                    {...register("name")}
                    className="border px-2 py-1 rounded-lg focus:outline-none w-[100px] md:w-[200px] mx-auto md:ml-10"
                    placeholder="이름을 입력해주세요."
                  />
                  <ErrorMessage
                    errors={errors}
                    name="name"
                    render={({ message }) => (
                      <p className="text-error font-semibold">{message}</p>
                    )}
                  />
                </>
              ) : (
                <h4 className="mx-auto md:ml-10 text-xl font-bold">
                  {user?.name}
                </h4>
              )}
            </div>
            {isUpdateForm ? (
              <div className="flex md:hidden justify-center gap-4 my-8 ">
                <Button
                  type="button"
                  onClick={handleUpdateForm}
                  className="border rounded-full font-semibold w-[70px]"
                >
                  취소
                </Button>
                <Button
                  disabled={isUpdateProfileLoading || !isDirty}
                  type="button"
                  onClick={handleSubmit}
                  className="bg-main text-white rounded-full font-semibold w-[70px]"
                >
                  확인
                </Button>
              </div>
            ) : (
              <div className="flex md:hidden justify-center gap-4 my-8">
                <Button
                  type="button"
                  className="border rounded-full font-semibold"
                >
                  비밀번호 변경
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateForm}
                  className="bg-main text-white rounded-full font-semibold px-6"
                >
                  내정보 수정
                </Button>
              </div>
            )}
            <div className="flex gap-4 items-center mb-2 font-medium">
              <Image
                src="/icon/user-profile.png"
                alt="user_icon"
                width={24}
                height={24}
              />
              {isUpdateForm ? (
                <>
                  <Input
                    {...register("nickname")}
                    className="border px-2 py-1 rounded-lg focus:outline-none w-[120px] md:w-[200px]"
                    placeholder="닉네임을 입력해주세요."
                  />
                  <ErrorMessage
                    errors={errors}
                    name="nickname"
                    render={({ message }) => (
                      <p className="text-error font-semibold">{message}</p>
                    )}
                  />
                </>
              ) : (
                <span>{user?.nickname}</span>
              )}
            </div>
            <div className="flex gap-4 items-center mb-2 font-medium ">
              <Image
                src="/icon/email.png"
                alt="email_icon"
                width={24}
                height={24}
              />
              <span>{user?.email}</span>
            </div>
            <div className="flex gap-4 items-center mb-2 font-medium">
              <CalendarIcon className="w-6 h-6" />
              {isUpdateForm ? (
                <>
                  <Input
                    {...register("birth")}
                    type="date"
                    className="border px-2 py-1 rounded-lg focus:outline-none w-full md:w-[200px]"
                    placeholder="1945.08.15"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="birth"
                    render={({ message }) => (
                      <p className="text-error font-semibold">{message}</p>
                    )}
                  />
                </>
              ) : (
                <span>{filter.YYYYMMDD(user?.birth, "YYYY-MM-DD")}</span>
              )}
            </div>
            <div className="flex gap-4 items-center mb-2 font-medium">
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
                  className="text-main border text-base font-semibold h-8"
                >
                  휴대폰 번호 등록
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="text-base md:text-lg mt-8 flex flex-col gap-4">
          <div className="flex gap-6 items-center">
            <span className="font-bold whitespace-nowrap">전공</span>
            <div className="flex gap-2 items-center">
              {isUpdateForm && (
                <button
                  type="button"
                  onClick={handleMajorDialog}
                  className="text-main text-sm font-semibold border px-2 h-8 rounded-lg whitespace-nowrap"
                >
                  전공 등록
                </button>
              )}
              <div className="flex gap-2 flex-wrap">
                {watch("majors")?.map(major => (
                  <Badge
                    key={major.id}
                    className="text-xs md:text-sm bg-main text-white rounded-xl mx-1"
                  >
                    <span>{major.koName}</span>
                    {isUpdateForm && (
                      <button
                        type="button"
                        onClick={() => handleSelectMajor(major)}
                      >
                        <CloseIcon className="w-4 h-4 ml-1 pb-[2px]" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              <ErrorMessage
                errors={errors}
                name="majors"
                render={({ message }) => (
                  <p className="text-error font-semibold">{message}</p>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">학력</span>
            {isUpdateForm ? (
              <div>
                <div className="flex items-center gap-6 my-2">
                  <Image
                    src="/icon/bachelor.png"
                    alt="bachelor_degree_icon"
                    width={28}
                    height={28}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">학사</span>
                    <Input
                      {...register("bachellor")}
                      placeholder="대학교 명을 입력해주세요."
                      className="border px-2 py-1 rounded-lg focus:outline-none w-full md:w-[350px]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6 my-2">
                  <Image
                    src="/icon/master.png"
                    alt="master_degree_icon"
                    width={28}
                    height={28}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">석사</span>
                    <Input
                      {...register("master")}
                      placeholder="대학원 명을 입력해주세요."
                      className="border px-2 py-1 rounded-lg focus:outline-none w-full md:w-[350px]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6 my-2">
                  <Image
                    src="/icon/doctor.png"
                    alt="doctor_degree_icon"
                    width={28}
                    height={28}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">박사</span>
                    <Input
                      {...register("doctor")}
                      placeholder="대학원 명을 입력해주세요."
                      className="border px-2 py-1 rounded-lg focus:outline-none w-full md:w-[350px]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[200px]">
                {watch("bachellor") && (
                  <div className="flex items-center gap-6 md:gap-12 mb-2">
                    <Image
                      src="/icon/bachelor.png"
                      alt="bachelor_degree_icon"
                      width={28}
                      height={28}
                    />
                    <div>
                      <h5 className="font-semibold text-base text-primary">
                        {watch("bachellor")}
                      </h5>
                      <p className="text-coolgray text-sm">
                        {SchoolTypeValues.UNDERGRADUATE}
                      </p>
                    </div>
                  </div>
                )}
                {watch("master") && (
                  <div className="flex items-center gap-6 md:gap-12 mb-2">
                    <Image
                      src="/icon/master.png"
                      alt="master_degree_icon"
                      width={28}
                      height={28}
                    />
                    <div>
                      <h5 className="font-semibold text-base text-primary">
                        {watch("master")}
                      </h5>
                      <p className="text-coolgray text-sm">
                        {SchoolTypeValues.MASTER}
                      </p>
                    </div>
                  </div>
                )}
                {watch("doctor") && (
                  <div className="flex items-center gap-6 md:gap-12 mb-2">
                    <Image
                      src="/icon/doctor.png"
                      alt="doctor_degree_icon"
                      width={28}
                      height={28}
                    />
                    <div>
                      <h5 className="font-semibold text-base text-primary">
                        {watch("doctor")}
                      </h5>
                      <p className="text-coolgray text-sm">
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
          <div className="hidden md:flex justify-end gap-4 mt-8  ">
            <Button
              type="button"
              onClick={handleUpdateForm}
              className="border rounded-full font-semibold w-[70px]"
            >
              취소
            </Button>
            <Button
              disabled={isUpdateProfileLoading || !isDirty}
              type="button"
              onClick={handleSubmit}
              className="bg-main text-white rounded-full font-semibold w-[70px]"
            >
              확인
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex justify-end gap-4">
            <Button
              onClick={handlePasswordDialog}
              type="button"
              className="border rounded-full font-semibold"
            >
              비밀번호 변경
            </Button>
            <Button
              type="button"
              onClick={handleUpdateForm}
              className="bg-main text-white rounded-full font-semibold px-6"
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
