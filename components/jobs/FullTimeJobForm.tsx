import { ErrorMessage } from "@hookform/error-message"
import React, { useRef, useState } from "react"
import { Input } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import dynamic from "next/dynamic"
import * as yup from "yup"
import FileUploader from "../common/FileUploader"
import { Button } from "../ui/button"
import PlusIcon from "../icons/PlusIcon"
import MajorDialog from "../dialog/MajorDialog"
import { Badge } from "../ui/badge"
import PostCodeDialog from "../dialog/PostCodeDialog"
import { MAJOR } from "@/types/majors"
import { JOB } from "@/types/jobs"
import useToast from "@/hooks/useToast"
import ImageField from "../common/ImageField"
import { Spinner } from "../common/Loading"
import { jobSchema } from "@/lib/schemas"
import { uploadImages } from "@/apis/system"
import { useLoading } from "@toss/use-loading"
import { UploadTarget } from "@/types"

const QuillEditor = dynamic(() => import("@/components/editor/QuillEditor"), {
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
  ssr: false,
})

const CKEditor = dynamic(() => import("@/components/CKEditor/CKEditor"), {
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
  ssr: false,
})

export type CreateFulltimeJobFormData = yup.InferType<typeof jobSchema>

interface Props {
  handleFullTimeJob: (payload: CreateFulltimeJobFormData) => void
  isLoading: boolean
  job?: JOB
  withImage?: boolean
}

const FullTimeJobForm = ({
  handleFullTimeJob,
  isLoading,
  job,
  withImage,
}: Props) => {
  const router = useRouter()
  const fileUploader = useRef<HTMLInputElement>(null)
  const [isMajorDialog, setIsMajorDialog] = useState(false)
  const [isPostDialog, setIsPostDialog] = useState(false)
  const { successToast, errorToast } = useToast()
  const [isUploadLoading, uploadTrasition] = useLoading()
  const quillRef = useRef()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<CreateFulltimeJobFormData>({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      majors: job?.majors?.majors || [],
      title: job?.title || "",
      companyName: job?.companyName || "",
      addressDetail: job?.addressDetail || "",
      contents: job?.contents || "",
      address: job?.address || "",
      imageUrl: job?.imageUrl || "",
      recruitSiteUrl: job?.recruitSiteUrl || "",
    },
  })

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const deleteImage = () => setValue("imageUrl", "")

  const handleUploadedFiles = async (files: File[]) => {
    try {
      const uploadResponse = await uploadTrasition(
        uploadImages(UploadTarget.JOB, files, true),
      )
      successToast("채용 이미지가 등록되었습니다.")
      setValue("imageUrl", uploadResponse.images[0].url as string)
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  const handleSelectMajor = (selectedMajor: MAJOR) => {
    const majorIds = watch("majors")?.map(major => major.id)

    if (majorIds?.includes(selectedMajor.id)) {
      setValue(
        "majors",
        watch("majors")?.filter(major => major.id !== selectedMajor.id),
      )
    } else {
      const mergedMajors = [...(watch("majors") || []), selectedMajor]

      setValue("majors", mergedMajors)
    }
  }

  return (
    <form
      className="mx-auto max-w-screen-lg px-2 py-4"
      onSubmit={handleSubmit(handleFullTimeJob)}
    >
      <h2 className="my-4 text-center font-bold md:my-12 md:text-2xl">
        채용 등록
      </h2>
      <div className="flex flex-col md:flex-row">
        {withImage && (
          <ImageField
            imageUrl={watch("imageUrl") || ""}
            isImageLoading={isUploadLoading}
            alt="job_company_image"
            deleteImage={deleteImage}
            openFileUploader={openFileUploader}
            className="h-[190px] w-full md:h-[244px] md:w-[400px]"
          />
        )}
        <div
          className={`flex flex-1 flex-col text-dimgray ${
            withImage ? "md:ml-16" : "w-full"
          }`}
        >
          <div className="md:mt:0 mb-2">
            <Input
              {...register("title")}
              className="w-full border-b-2 border-whitesmoke py-2 focus:outline-none"
              placeholder="제목을 입력해주세요."
            />
            <ErrorMessage
              errors={errors}
              name="title"
              render={({ message }) => (
                <p className="text-xs font-semibold text-error">{message}</p>
              )}
            />
          </div>
          <div className="mb-2">
            <Input
              {...register("companyName")}
              className="w-full border-b-2 border-whitesmoke py-2 focus:outline-none"
              placeholder="단체 이름을 입력해주세요."
            />
            <ErrorMessage
              errors={errors}
              name="companyName"
              render={({ message }) => (
                <p className="text-xs font-semibold text-error">{message}</p>
              )}
            />
          </div>
          <div className="mb-2">
            <Input
              {...register("recruitSiteUrl")}
              className="w-full border-b-2 border-whitesmoke py-2 focus:outline-none"
              placeholder="사이트 주소를 입력해주세요. 예): https://naver.com"
            />
            <ErrorMessage
              errors={errors}
              name="recruitSiteUrl"
              render={({ message }) => (
                <p className="text-xs font-semibold text-error">{message}</p>
              )}
            />
          </div>
          <div className="my-2 flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setIsMajorDialog(!isMajorDialog)}
              className="flex h-8 gap-1 rounded-full border text-sm text-main"
            >
              <PlusIcon className="h-4 w-4 text-main" />
              <span>전공</span>
            </Button>
            {!errors.majors && watch("majors").length == 0 && (
              <span className="text-sm text-silver">
                전공은 최대 3개까지 선택 가능합니다.
              </span>
            )}
            {watch("majors")
              ?.slice(0, 1)
              .map((major: MAJOR, index: number) => {
                return (
                  <Badge
                    key={major.id}
                    className="h-8 whitespace-nowrap bg-main text-xs text-white md:text-sm"
                  >
                    {watch("majors").length > 1 && index === 0
                      ? `${major.koName} 외 ${watch("majors").length - 1}`
                      : major.koName}
                  </Badge>
                )
              })}
            <ErrorMessage
              errors={errors}
              name="majors"
              render={({ message }) => (
                <p className="text-xs font-semibold text-error">{message}</p>
              )}
            />
          </div>
          <div className="flex h-20 gap-4">
            <Button
              type="button"
              onClick={() => setIsPostDialog(!isPostDialog)}
              className="h-8 border text-sm text-main"
            >
              주소검색
            </Button>
            <div className="w-full">
              <Input
                disabled
                value={watch("address")}
                placeholder="주소검색을 통해 주소를 입력해주세요."
                className="w-full border-b-2 border-whitesmoke py-2 focus:outline-none disabled:bg-white"
              />
              <ErrorMessage
                errors={errors}
                name="address"
                render={({ message }) => (
                  <p className="text-xs font-semibold text-error">{message}</p>
                )}
              />
              <Input
                {...register("addressDetail")}
                placeholder="상세 주소를 입력해주세요."
                className="w-full border-b-2 border-whitesmoke py-2 focus:outline-none"
              />
              <ErrorMessage
                errors={errors}
                name="addressDetail"
                render={({ message }) => (
                  <p className="text-xs font-semibold text-error">{message}</p>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="my-6 h-[300px] md:h-[500px]">
        {/* <QuillEditor
          quillRef={quillRef}
          htmlContent={watch("contents")}
          handleContent={(html: string) => setValue("contents", html)}
        /> */}
        <CKEditor
          value={watch("contents")}
          onChange={(value: string) => setValue("contents", value)}
        />
        <ErrorMessage
          errors={errors}
          name="contents"
          render={({ message }) => (
            <p className="text-xs font-semibold text-error">{message}</p>
          )}
        />
      </div>
      <div className="mt-64 flex justify-end gap-2 md:mt-16">
        <Button
          type="button"
          className="h-9 rounded-3xl border px-6 text-sm"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button
          disabled={isLoading}
          type="submit"
          className="h-9 rounded-3xl bg-main px-6 text-sm text-white"
        >
          {isLoading ? <Spinner className="h-6 w-6" /> : job ? "수정" : "등록"}
        </Button>
      </div>
      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <MajorDialog
        open={isMajorDialog}
        close={() => setIsMajorDialog(!isMajorDialog)}
        selectedMajors={watch("majors")}
        handleSelectMajor={handleSelectMajor}
        multiple={true}
      />
      <PostCodeDialog
        isOpen={isPostDialog}
        close={() => setIsPostDialog(!isPostDialog)}
        setValue={address => {
          setValue("address", address)
          clearErrors("address")
        }}
      />
    </form>
  )
}

export default FullTimeJobForm
