import { ErrorMessage } from '@hookform/error-message';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { Dialog, DialogPanel, Input } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import * as yup from 'yup';
import FileUploader from '../common/FileUploader';
import CloseIcon from '../icons/CloseIcon';
import { Button } from '../ui/button';
import PhotoIcon from '../icons/PhotoIcon';
import PlusIcon from '../icons/PlusIcon';
import Loading from '../common/Loading';
import MajorDialog from '../dialog/MajorDialog';
import { MAJOR } from '@/types';
import { Badge } from '../ui/badge';
import PostCodeDialog from '../dialog/PostCodeDialog';

const ToastEditor = dynamic(() => import('../editor/ToastEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center">
      <Loading className="w-8 h-8" />
    </div>
  ),
});

const schema = yup
  .object({
    title: yup
      .string()
      .min(3, '3자 이상 20자 이하로 입력해주세요.')
      .max(20, '3자 이상 20자 이하로 입력해주세요.')
      .required('제목을 입력해주세요.'),
    contents: yup.string().required('내용을 입력해주세요.'),
    companyName: yup
      .string()
      .min(2, '2자 이상 20자 이하로 입력해주세요.')
      .max(20, '2자 이상 20자 이하로 입력해주세요.')
      .required(),
    province: yup.string().required('지역을 선택해주세요.'),
    detailAddress: yup.string().required('상세 주소를 입력해주세요.'),
    imageFile: yup
      .mixed()
      .test('fileType', '이미지 파일만 등록할 수 있습니다.', (value) => {
        if (!value) return false; // 값이 없으면 유효성 검사 실패
        return value instanceof File;
      })
      .required('이미지를 등록해주세요.'),
    majors: yup
      .array()
      .min(1, '전공을 최소 1개 선택해야 합니다.')
      .max(10, '전공은 하나만 선택할 수 있습니다.')
      .required('전공을 선택해주세요.'),
  })
  .required();

export type CreateJobFormData = yup.InferType<typeof schema>;

interface Props {
  handleFullTimeJob: (payload: CreateJobFormData) => void;
  isLoading: boolean;
}

const OrganizationForm = ({ handleFullTimeJob, isLoading }: Props) => {
  const router = useRouter();
  const fileUploader = useRef<HTMLInputElement>(null);
  const [isMajorDialog, setIsMajorDialog] = useState(false);
  const [isPostDialog, setIsPostDialog] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CreateJobFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      majors: [],
    },
  });

  console.log('watch("contents")', watch('contents'));

  const openFileUploader = () => {
    fileUploader.current?.click();
  };

  const handleUploadedFiles = (files: File[]) => {
    setValue('imageFile', files[0]);
  };

  const imageUrl = useMemo(() => {
    const file = watch('imageFile') as File;
    if (file) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, [watch('imageFile')]);

  const handleSelectMajor = (selectedMajor: MAJOR) => {
    if (watch('majors').includes(selectedMajor)) {
      setValue(
        'majors',
        watch('majors').filter((major) => major !== selectedMajor)
      );
    } else {
      setValue('majors', [...watch('majors'), selectedMajor]);
    }
    clearErrors('majors');
  };

  return (
    <form
      className="max-w-screen-lg mx-auto py-4 px-2"
      onSubmit={handleSubmit(handleFullTimeJob)}
    >
      <h2 className="text-center md:text-2xl my-4 md:my-12 font-bold">
        채용 등록
      </h2>
      <div className="flex flex-col md:flex-row">
        {imageUrl ? (
          <div className="h-[190px] md:h-[244px] w-full md:w-[400px] rounded-md relative">
            <Image
              src={imageUrl}
              alt="job_create_image"
              fill
              quality={100}
              sizes="(max-width: 768px) 100px 190px, 198px 240px"
            />
            <Button
              className="absolute top-2 right-2 rounded-full opacity-40 bg-white p-2"
              onClick={() => setValue('imageFile', '')}
            >
              <CloseIcon className="w-6 h-6 text-primary" />
            </Button>
          </div>
        ) : (
          <div
            className="bg-whitesmoke h-[190px] md:h-[244px] w-full md:w-[400px] rounded-md
          flex flex-col items-center justify-center gap-6"
          >
            <div className="flex flex-col items-center gap-2">
              <PhotoIcon className="w-12 h-12 text-dimgray" />
              <h5 className="font-bold text-sm md:text-base">
                대표 이미지를 등록해주세요.
              </h5>
            </div>
            <Button
              className="bg-white text-silver font-medium h-8 px-6"
              onClick={openFileUploader}
            >
              이미지 선택
            </Button>
          </div>
        )}
        <div className="md:ml-16 md:my-4 flex flex-col text-dimgray flex-1">
          <div className="mt-4 md:mt:0 mb-2">
            <Input
              {...register('title')}
              className="border-b-2 border-whitesmoke focus:outline-none py-2 w-full"
              placeholder="제목을 입력해주세요."
            />
            <ErrorMessage
              errors={errors}
              name="title"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
          <div className="mb-2">
            <Input
              {...register('companyName')}
              className="border-b-2 border-whitesmoke focus:outline-none py-2 w-full"
              placeholder="단체 이름을 입력해주세요."
            />
            <ErrorMessage
              errors={errors}
              name="companyName"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
          <div className="my-2 flex md:items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMajorDialog(!isMajorDialog)}
              className="border-main rounded-2xl border px-3 h-8 flex items-center bg-main"
            >
              <PlusIcon className="w-4 h-4 text-white" />
              <span className="text-white">전공</span>
            </button>
            {watch('majors').map((major) => (
              <Badge key={major.id} className="bg-main text-white text-sm h-8">
                {major.koName}
                <button
                  onClick={() => handleSelectMajor(major)}
                  className="ml-1"
                >
                  <CloseIcon className="w-4 h-4 mb-[1px] text-white" />
                </button>
              </Badge>
            ))}
            <ErrorMessage
              errors={errors}
              name="majors"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
          <div className="flex gap-4 h-20">
            <Button
              type="button"
              onClick={() => setIsPostDialog(!isPostDialog)}
              className="border text-main h-[36px]"
            >
              주소검색
            </Button>
            {watch('province') && (
              <div className="w-full">
                <Input
                  defaultValue={watch('province')}
                  className="border-b-2 border-whitesmoke focus:outline-none py-2 w-full"
                />
                <ErrorMessage
                  errors={errors}
                  name="province"
                  render={({ message }) => (
                    <p className="text-error font-semibold">{message}</p>
                  )}
                />
                <Input
                  {...register('detailAddress')}
                  placeholder="상세 주소를 입력해주세요."
                  className="border-b-2 border-whitesmoke focus:outline-none py-2 w-full"
                />
                <ErrorMessage
                  errors={errors}
                  name="detailAddress"
                  render={({ message }) => (
                    <p className="text-error font-semibold">{message}</p>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="my-4 h-[300px] md:h-[500px]">
        <ToastEditor setValue={setValue} />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          className="border rounded-3xl text-sm h-9 px-6"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button
          disabled={isLoading}
          type="submit"
          className="rounded-3xl text-sm h-9 bg-main text-white px-6"
        >
          등록
        </Button>
      </div>
      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <MajorDialog
        open={isMajorDialog}
        close={() => setIsMajorDialog(!isMajorDialog)}
        selectedMajors={watch('majors')}
        handleSelectMajor={handleSelectMajor}
        multiple={false}
      />
      <PostCodeDialog
        isOpen={isPostDialog}
        close={() => setIsPostDialog(!isPostDialog)}
        setValue={(address) => {
          setValue('province', address);
          clearErrors('province');
        }}
      />
    </form>
  );
};

export default OrganizationForm;
