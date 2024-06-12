"use client";

import React, {
  Suspense,
  createContext,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { JobType } from "@/types/jobs";
import MajorSelectCard from "./MajorSelectCard";
import FileUploader from "../common/FileUploader";
import DaumPostcode from "react-daum-postcode";
import { Dialog, DialogPanel, Input } from "@headlessui/react";
import useToast from "@/hooks/useToast";
import { createFullTimeJob } from "@/apis/jobs";
import { useRouter } from "next/navigation";
import OrganizationForm from "./OrganizationForm";
import ReligionForm from "./ReligionForm";
import MajorDialog from "../dialog/MajorDialog";
import { MAJOR } from "@/types";
import Loading from "../common/Loading";

const schema = yup
  .object({
    title: yup
      .string()
      .min(3, "3자 이상 20자 이하로 입력해주세요.")
      .max(20, "3자 이상 20자 이하로 입력해주세요.")
      .required("제목을 입력해주세요."),
    contents: yup.string().required("내용을 입력해주세요."),
    companyName: yup
      .string()
      .min(2, "2자 이상 20자 이하로 입력해주세요.")
      .max(20, "2자 이상 20자 이하로 입력해주세요.")
      .required(),
    province: yup.string().required("지역을 선택해주세요."),
    detailAddress: yup.string().required("상세 주소를 입력해주세요."),
    imageUrl: yup.string().required("이미지를 등록해주세요."),
    majorIds: yup.array().of(yup.number()).min(1, "전공을 선택해주세요."),
  })
  .required();

export type CreateJobFormData = yup.InferType<typeof schema>;

interface DefaultFormContextValue {
  register: UseFormRegister<CreateJobFormData>;
  handleSubmit: UseFormHandleSubmit<CreateJobFormData>;
  watch: UseFormWatch<CreateJobFormData>;
  errors: FieldErrors<CreateJobFormData>;
  openFileUploader: () => void;
  deleteImage: () => void;
  openPostDialog: () => void;
  isPending: boolean;
  uploadedImageUrl?: string;
  setValue: UseFormSetValue<CreateJobFormData>;
  handleJob: (payload: CreateJobFormData) => void;
}

const defaultValue: DefaultFormContextValue = {
  register: () => ({} as any),
  handleSubmit: () => ({} as any),
  watch: () => ({} as any),
  errors: {},
  openFileUploader: () => {},
  deleteImage: () => {},
  openPostDialog: () => {},
  isPending: false,
  uploadedImageUrl: "" || undefined,
  setValue: () => {},
  handleJob: () => {},
};

export const FormContext = createContext<DefaultFormContextValue>(defaultValue);

const CreateContainer = () => {
  const [createStep, setCreateStep] = useState(0);
  const [selectedJobType, setSelectedJobType] = useState<JobType>();
  const [selectedMajors, setSelectedMajors] = useState<MAJOR[]>([]);
  const fileUploader = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<File>();
  const [openPostcode, setOpenPostcode] = useState(false);
  const [isMajorDialog, setIsMajorDialog] = useState(false);
  const router = useRouter();
  const { errorToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreateJobFormData>({
    resolver: yupResolver(schema),
  });

  const handleSelectedJobType = (jobType: JobType) => {
    setCreateStep(createStep + 1);
    setSelectedJobType(jobType);
  };

  const openFileUploader = () => {
    fileUploader.current?.click();
  };

  const handleUploadedFiles = (files: File[]) => {
    setUploadedImage(files[0]);
  };

  const uploadedImageUrl = useMemo(() => {
    if (uploadedImage) {
      return URL.createObjectURL(uploadedImage);
    }
  }, [uploadedImage]);

  const completeHandler = (data: any) => {
    setValue("province", data.address);
    setOpenPostcode(false);
  };

  const style = {
    width: "350px",
    height: "500px",
    border: "1.4px solid #333333",
  };

  const handleJob = async (payload: CreateJobFormData) => {
    const {
      title,
      companyName,
      province,
      detailAddress,
      imageUrl,
      majorIds,
      contents,
    } = payload;
    try {
      startTransition(() => {
        createFullTimeJob({
          title,
          companyName,
          province: `${province} ${detailAddress}`,
          imageUrl,
          majorIds: majorIds?.map((id) => Number(id)),
          contents,
        });
      });
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  const openPostDialog = () => setOpenPostcode(!openPostcode);
  const onSubmit = handleSubmit(handleJob);
  const deleteImage = () => setUploadedImage(undefined);
  const handleSelectMajor = (selectedMajor: MAJOR) => {
    if (selectedMajors.includes(selectedMajor)) {
      setSelectedMajors(
        selectedMajors.filter((major) => major !== selectedMajor)
      );
    } else {
      setSelectedMajors([...selectedMajors, selectedMajor]);
    }
  };

  return (
    <FormContext.Provider
      value={{
        register,
        handleSubmit,
        watch,
        errors,
        openFileUploader,
        deleteImage,
        openPostDialog,
        isPending,
        uploadedImageUrl,
        setValue,
        handleJob,
      }}
    >
      {/* {createStep === 0 && (
        <JobTypeSelectCard handleSelectedJobType={handleSelectedJobType} />
      )}
      {createStep === 1 && <MajorSelectCard />} */}

      {/* <OrganizationForm /> */}
      <ReligionForm
        selectedMajors={selectedMajors}
        handleSelectMajor={handleSelectMajor}
        handleMajorDialog={() => setIsMajorDialog(!isMajorDialog)}
      />
      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <MajorDialog
        open={isMajorDialog}
        close={() => setIsMajorDialog(!isMajorDialog)}
        selectedMajors={selectedMajors}
        handleSelectMajor={handleSelectMajor}
      />
      <Dialog
        open={openPostcode}
        onClose={() => setOpenPostcode(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <DialogPanel>
          <DaumPostcode style={style} onComplete={completeHandler} />
        </DialogPanel>
      </Dialog>
    </FormContext.Provider>
  );
};

export default CreateContainer;
