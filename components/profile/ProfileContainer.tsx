"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MajorDialog from "../dialog/MajorDialog";
import { MAJOR } from "@/types";
import FileUploader from "../common/FileUploader";
import PhotoIcon from "../icons/PhotoIcon";
import { Button } from "../ui/button";
import { useLoading } from "@toss/use-loading";
import { uploadImages } from "@/apis/system";
import useToast from "@/hooks/useToast";
import CloseIcon from "../icons/CloseIcon";
import { Badge } from "../ui/badge";
import { Input } from "@headlessui/react";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup
  .object({
    birth: yup.string().required("이메일을 입력해주세요."),
    nickName: yup.string().required("닉네임을 입력해주세요."),
    phone: yup
      .string()
      .matches(phoneRegExp, "유효한 핸드폰 번호를 입력해주세요")
      .required("핸드폰 번호를 입력해주세요"),
    majors: yup.array(),
    bachellor: yup.string().nullable(),
    master: yup.string().nullable(),
    doctor: yup.string().nullable(),
    imageUrl: yup.string().nullable(),
  })

  .required();

type ProfileFormData = yup.InferType<typeof schema>;

const ProfileContainer = () => {
  const { data } = useSession();
  const pathname = usePathname();
  const [isMajorDialog, setIsMajorDialog] = useState(false);
  const fileUploader = useRef<HTMLInputElement>(null);
  const [isImageUploadLoading, imageStartTransition] = useLoading();
  const { successToast, errorToast } = useToast();
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      majors: [] as MAJOR[],
    },
  });

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

  const updateProfile = async (payload: ProfileFormData) => {};

  return (
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
      <div className="flex-1 px-8 py-6">
        <div className="flex flex-col md:flex-row md:gap-20">
          <div className="flex flex-col items-center">
            <div className="relative h-[100px]">
              <Avatar className="w-[100px] h-[100px]">
                <AvatarImage
                  src="/img/placeholder-user.png"
                  alt="user_profile_image"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <Button
              onClick={() => setValue("imageUrl", "")}
              className="bg-white text-lg mt-2 text-primary font-semibold h-8 px-6"
            >
              이미지 삭제
            </Button>
            <Button
              disabled={isImageUploadLoading}
              className="bg-white text-lg mt-2 text-silver font-medium h-8 px-6"
              onClick={openFileUploader}
            >
              이미지 등록
            </Button>
          </div>

          <div className="flex-col text-base md:text-lg">
            <h4 className="text-lg font-bold mb-3">{data?.user?.name}</h4>
            <div className="flex gap-4 items-center mb-2 font-semibold ">
              <img
                src="./icon/email.png"
                alt="email_icon"
                className="w-6 h-6"
              />
              {/* <span>{data?.user?.email}</span> */}
            </div>
            <div className="flex gap-4 items-center mb-2 font-semibold">
              <img
                src="./icon/user-profile.png"
                alt="user_profile_icon"
                className="w-6 h-6"
              />
              {/* <span>{data?.user?.email}</span> */}
              <Input
                {...register("birth")}
                className="border px-2 py-1 rounded-lg focus:outline-none w-full md:w-[200px]"
                placeholder="1945.08.15"
              />
            </div>
            <div className="flex gap-4 items-center mb-2 font-semibold">
              <img
                src="./icon/phone.png"
                alt="phone_icon"
                className="w-6 h-6"
              />
              {/* <span>{data?.user?.email}</span> */}
              <Input
                {...register("phone")}
                className="border px-2 py-1 rounded-lg focus:outline-none  w-full  md:w-[200px]"
                placeholder="010-0000-0000"
              />
            </div>
          </div>
        </div>
        <div className="text-base md:text-lg mt-8 flex flex-col gap-4">
          <div className="flex gap-6 items-center">
            <span className="font-bold whitespace-nowrap">전공</span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setIsMajorDialog(!isMajorDialog)}
                className="text-main border px-2 py-[2px] rounded-lg whitespace-nowrap"
              >
                전공 등록
              </button>
              <div className="flex gap-2 flex-wrap">
                {watch("majors")?.map((major) => (
                  <Badge
                    key={major.id}
                    className="text-main text-xs md:text-sm bg-aliceblue rounded-xl mx-1"
                  >
                    <span>{major.koName}</span>
                    <button onClick={() => handleSelectMajor(major)}>
                      <CloseIcon className="w-4 h-4 ml-1 pb-[2px]" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">학력</span>
            {isUpdateForm ? (
              <div>
                <div className="flex items-center gap-6 my-2">
                  <img
                    src="./icon/bachelor.png"
                    alt="bachelor_icon"
                    className="w-7 h-7"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">학사</span>
                    <Input
                      {...register("bachellor")}
                      className="border px-2 py-1 rounded-lg focus:outline-none w-full md:w-[350px]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6 my-2">
                  <img
                    src="./icon/master.png"
                    alt="master_icon"
                    className="w-7 h-7"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">석사</span>
                    <Input
                      {...register("master")}
                      className="border px-2 py-1 rounded-lg focus:outline-none w-full md:w-[350px]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6 my-2">
                  <img
                    src="./icon/doctor.png"
                    alt="doctor_icon"
                    className="w-7 h-7"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">박사</span>
                    <Input
                      {...register("doctor")}
                      className="border px-2 py-1 rounded-lg focus:outline-none w-full md:w-[350px]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[200px]">
                {/* {lesson?.schools?.map((school) => (
                  <div
                    key={school.id}
                    className="flex items-center gap-6 md:gap-12 mb-2"
                  >
                    <img
                      src={
                        school.type === SchoolType.UNDERGRADUATE
                          ? "/icon/bachelor.png"
                          : school.type === SchoolType.MASTER
                          ? "/icon/master.png"
                          : "/icon/doctor.png"
                      }
                      alt="school_image"
                      className="w-[30px] h-[30px]"
                    />
                    <div>
                      <h5 className="font-semibold text-base text-primary">
                        {school.name}
                      </h5>
                      <p className="text-coolgray text-sm">
                        {SchoolTypeValues[school.type]}
                      </p>
                    </div>
                  </div>
                ))} */}
              </div>
            )}
          </div>
        </div>
        {isUpdateForm ? (
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setIsUpdateForm(false)}
              className="border-[3px] rounded-full font-semibold w-[70px]"
            >
              취소
            </Button>
            <Button
              onClick={() => setIsUpdateForm(true)}
              className="bg-main text-white rounded-full font-semibold w-[70px]"
            >
              확인
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-4">
            <Button className="border-[3px] rounded-full font-semibold">
              비밀번호 변경
            </Button>
            <Button
              onClick={() => setIsUpdateForm(true)}
              className="bg-main text-white rounded-full font-semibold px-6"
            >
              내정보 수정
            </Button>
          </div>
        )}
      </div>
      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <MajorDialog
        open={isMajorDialog}
        close={() => setIsMajorDialog(!isMajorDialog)}
        selectedMajors={watch("majors") || []}
        handleSelectMajor={handleSelectMajor}
        multiple={true}
      />
    </form>
  );
};

export default ProfileContainer;
