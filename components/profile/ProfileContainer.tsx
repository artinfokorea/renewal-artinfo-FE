"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MajorDialog from "../dialog/MajorDialog";
import { MAJOR } from "@/types";
import FileUploader from "../common/FileUploader";
import { Button } from "../ui/button";
import { useLoading } from "@toss/use-loading";
import {
  sendPhoneVerificationCode,
  uploadImages,
  verifyPhoneCode,
} from "@/apis/system";
import useToast from "@/hooks/useToast";
import CloseIcon from "../icons/CloseIcon";
import { Badge } from "../ui/badge";
import { Input } from "@headlessui/react";
import { updateUser, updateUserPhone } from "@/apis/users";
import { SchoolType, SchoolTypeValues } from "@/types/lessons";
import CameraIcon from "../icons/CameraIcon";
import PhoneDialog from "../dialog/PhoneDialog";
import filters from "@/lib/filters";
import CalendarIcon from "../icons/CalendarIcon";

const schema = yup
  .object({
    birth: yup.string().required("생년월일을 입력해주세요."),
    nickname: yup.string().nullable().required("닉네임을 입력해주세요."),
    majors: yup.array().max(2, "최대 2개까지 선택 가능합니다.").nullable(),
    bachellor: yup.string().nullable(),
    master: yup.string().nullable(),
    doctor: yup.string().nullable(),
    imageUrl: yup.string().nullable(),
    phone: yup.string().nullable(),
  })

  .required();

type ProfileFormData = yup.InferType<typeof schema>;

const ProfileContainer = () => {
  const { data, update } = useSession();
  const pathname = usePathname();
  const [isMajorDialog, setIsMajorDialog] = useState(false);
  const fileUploader = useRef<HTMLInputElement>(null);
  const [isImageUploadLoading, imageStartTransition] = useLoading();
  const { successToast, errorToast } = useToast();
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [isUpdateProfileLoading, updateProfileStartTransition] = useLoading();
  const [isUpdatePhoneLoading, updatePhoneStartTransition] = useLoading();
  const [isPhoneDialog, setIsPhoneDialog] = useState(false);
  const filter = filters();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (data?.user) {
      setValue("majors", data?.user.majors);
      setValue(
        "bachellor",
        data?.user.schools?.filter(
          (item) => item.type === SchoolType.UNDERGRADUATE
        )[0]?.name
      );
      setValue(
        "master",
        data?.user.schools?.filter((item) => item.type === SchoolType.MASTER)[0]
          ?.name
      );
      setValue(
        "doctor",
        data?.user.schools?.filter((item) => item.type === SchoolType.DOCTOR)[0]
          ?.name
      );
      setValue("imageUrl", data?.user.iconImageUrl);
      setValue("nickname", data?.user.nickname);
      setValue("phone", data?.user.phone);
      setValue("birth", filter.YYYYMMDD(data?.user.birth) || "");
    }
  }, [data?.user]);

  const openFileUploader = () => {
    fileUploader.current?.click();
  };

  const handleUploadedFiles = async (files: File[]) => {
    try {
      const uploadResponse = await imageStartTransition(
        uploadImages(files as File[])
      );
      successToast("프로필 이미지가 등록되었습니다.");
      setValue("imageUrl", uploadResponse.images[0].url as string);
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  const handleSelectMajor = (selectedMajor: MAJOR) => {
    const majorIds = watch("majors")?.map((major) => major.id);

    if (majorIds?.includes(selectedMajor.id)) {
      setValue(
        "majors",
        watch("majors")?.filter((major) => major.id !== selectedMajor.id)
      );
    } else {
      const currentMajors = watch("majors") || [];
      setValue("majors", [...currentMajors, selectedMajor]);
    }
  };

  const updateProfile = async (payload: ProfileFormData) => {
    const { bachellor, master, doctor, birth, imageUrl, majors, nickname } =
      payload;

    const schools = [];
    if (bachellor)
      schools.push({ type: SchoolType.UNDERGRADUATE, name: payload.bachellor });
    if (master) schools.push({ type: SchoolType.MASTER, name: payload.master });
    if (doctor) schools.push({ type: SchoolType.DOCTOR, name: payload.doctor });

    const request = {
      birth,
      nickname,
      iconImageUrl: imageUrl || undefined,
      majorIds: majors?.map((major) => major.id),
      schools:
        schools.length > 0
          ? schools.map((school) => ({
              type: school.type,
              name: school.name || "",
            }))
          : undefined,
    };

    try {
      await updateProfileStartTransition(updateUser(request));
      successToast("프로필이 수정되었습니다.");
      update();
      setIsUpdateForm(false);
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  const sendPhoneCode = async (phone: string) => {
    try {
      await sendPhoneVerificationCode(phone);
      successToast("인증번호가 발송되었습니다.");
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  const checkPhoneVerificationCode = async (
    phone: string,
    verification: string
  ) => {
    try {
      await updatePhoneStartTransition(
        verifyPhoneCode({ phone, verification })
      );
      await updateUserPhone(phone);
      update();
      successToast("휴대폰 인증이 완료되었습니다.");
      setIsPhoneDialog(!isPhoneDialog);
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  return (
    <section>
      <form className="flex mt-12 md:gap-48">
        <div className="hidden md:flex flex-col gap-4 p-4 md:p-8 whitespace-nowrap">
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
          <span className="mt-4 font-semibold text-lg">로그아웃</span>
        </div>
        <div className="flex-1 px-4 py-2 md:px-8 md:py-6">
          <div className="flex flex-col md:flex-row md:gap-20">
            <div className="flex flex-col items-center relative h-[150px]">
              <div className="relative h-[100px]">
                <Avatar className="w-[150px] h-[150px]">
                  <AvatarImage
                    src={watch("imageUrl") || "/img/placeholder-user.png"}
                    alt="user_profile_image"
                    className="w-[150px] h-[150px] rounded-full object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
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
                  className="mt-12 bg-blue-500 p-[5px] rounded-full absolute bottom-0 right-4 border-white border"
                  onClick={openFileUploader}
                >
                  <CameraIcon className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            <div className="flex-col text-base md:text-lg">
              <h4 className="text-lg font-bold mb-3">{data?.user?.name}</h4>
              <div className="flex gap-4 items-center mb-2 font-semibold ">
                <Image
                  src="/icon/email.png"
                  alt="email_icon"
                  width={24}
                  height={24}
                />
                <span>{data?.user?.email}</span>
              </div>
              <div className="flex gap-4 items-center mb-2 font-semibold">
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
                  <span>{filter.YYYYMMDD(data?.user?.birth)}</span>
                )}
              </div>
              <div className="flex gap-4 items-center mb-2 font-semibold">
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
                      className="border px-2 py-1 rounded-lg focus:outline-none w-full md:w-[200px]"
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
                  <span>{data?.user.nickname}</span>
                )}
              </div>
              <div className="flex gap-4 items-center mb-2 font-semibold">
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
                    onClick={() => setIsPhoneDialog(!isPhoneDialog)}
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
                    onClick={() => setIsMajorDialog(!isMajorDialog)}
                    className="text-main font-semibold border px-2 h-8 rounded-lg whitespace-nowrap"
                  >
                    전공 등록
                  </button>
                )}
                <div className="flex gap-2 flex-wrap">
                  {watch("majors")?.map((major) => (
                    <Badge
                      key={major.id}
                      className="text-main text-xs md:text-sm bg-aliceblue rounded-xl mx-1"
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
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                onClick={() => setIsUpdateForm(!isUpdateForm)}
                className="border-[3px] rounded-full font-semibold w-[70px]"
              >
                취소
              </Button>
              <Button
                disabled={isUpdateProfileLoading || !isDirty}
                type="button"
                onClick={handleSubmit(updateProfile)}
                className="bg-main text-white rounded-full font-semibold w-[70px]"
              >
                확인
              </Button>
            </div>
          ) : (
            <div className="flex justify-end gap-4">
              <Button
                disabled
                type="button"
                className="border-[3px] rounded-full font-semibold"
              >
                비밀번호 변경
              </Button>
              <Button
                type="button"
                onClick={() => setIsUpdateForm(!isUpdateForm)}
                className="bg-main text-white rounded-full font-semibold px-6"
              >
                내정보 수정
              </Button>
            </div>
          )}
        </div>
      </form>
      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <MajorDialog
        open={isMajorDialog}
        close={() => setIsMajorDialog(!isMajorDialog)}
        selectedMajors={watch("majors") || []}
        handleSelectMajor={handleSelectMajor}
        multiple={true}
      />
      <PhoneDialog
        open={isPhoneDialog}
        close={() => setIsPhoneDialog(!isPhoneDialog)}
        sendCode={sendPhoneCode}
        checkCode={checkPhoneVerificationCode}
        isLoading={isUpdatePhoneLoading}
      />
    </section>
  );
};

export default ProfileContainer;
