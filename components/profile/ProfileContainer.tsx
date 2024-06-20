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
import ProfileForm from "./ProfileForm";

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

export type ProfileFormData = yup.InferType<typeof schema>;

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
      <ProfileForm
        user={data?.user}
        isUpdateForm={isUpdateForm}
        isUpdateProfileLoading={isUpdateProfileLoading}
        isImageUploadLoading={isImageUploadLoading}
        handleUploadedFiles={handleUploadedFiles}
        handleSelectMajor={handleSelectMajor}
        handleMajorDialog={() => setIsMajorDialog(!isMajorDialog)}
        handlePhoneDialog={() => setIsPhoneDialog(!isPhoneDialog)}
        handleUpdateForm={() => setIsUpdateForm(!isUpdateForm)}
        isDirty={isDirty}
        setValue={setValue}
        errors={errors}
        register={register}
        handleSubmit={handleSubmit(updateProfile)}
        watch={watch}
      />
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
