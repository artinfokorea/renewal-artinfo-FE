import { PostCategory } from "@/types/posts"
import * as yup from "yup"

interface StringSchemaOptions {
  minLength?: number
  maxLength?: number
  minErrorMessage?: string
  maxErrorMessage?: string
}

export const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\[\]{}|;:,.<>?])[a-zA-Z0-9!@#$%^&*()_+\[\]{}|;:,.<>?]{8,12}$/

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const nameRegex = /^[a-zA-Z0-9가-힣-_.]*$/

const passwordSchema = yup
  .string()
  .matches(
    passwordRegex,
    "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.",
  )
  .required()

const emailSchema = yup
  .string()
  .matches(emailRegex, "유효한 이메일 주소를 입력해주세요.")
  .required("이메일은 필수입력 사항입니다.")

const rePasswordSchema = yup
  .string()
  .required("재확인 비밀번호를 입력해주세요.")
  .oneOf([yup.ref("password")], "재확인 비밀번호가 일치 하지 않습니다.")

const booleanSchema = yup
  .boolean()
  .oneOf([true], "인증을 완료해주세요.")
  .default(false)

const nameSchema = yup
  .string()
  .min(2, "이름은 2글자 이상 입력해주세요.")
  .max(6, "이름은 6글자 이하로 입력해주세요.")
  .matches(
    nameRegex,
    "이름은 영문, 숫자, 특수문자 빼기(-), 밑줄(_), 마침표(.)를 포함하여 2~6자로 입력하세요.",
  )
  .required("이름을 입력해주세요.")

const nicknameSchema = yup
  .string()
  .min(2, "닉네임은 2글자 이상 입력해주세요.")
  .max(12, "닉네임은 12글자 이하로 입력해주세요.")
  .matches(
    nameRegex,
    "닉네임은 영문, 숫자, 특수문자 빼기(-), 밑줄(_), 마침표(.)를 포함하여 2~12자로 입력하세요.",
  )
  .required("닉네임을 입력해주세요.")

const verifyCodeSchema = yup
  .string()
  .length(6, "인증코드는 6글자만 입력이 가능합니다.")
  .required("이메일 인증코드를 입력해주세요.")

const stringNullSchema = yup.string().nullable()

const numberSchema = yup.number().required("1회당 금액을 입력해주세요.")

const createStringRequiredSchema = (
  requiredErrorMessage: string,
  options?: StringSchemaOptions,
) => {
  let schema = yup.string().required(requiredErrorMessage)

  if (options?.minLength !== undefined) {
    schema = schema.min(
      options.minLength,
      options.minErrorMessage ||
        `최소 ${options.minLength}자 이상 입력해주세요.`,
    )
  }

  if (options?.maxLength !== undefined) {
    schema = schema.max(
      options.maxLength,
      options.maxErrorMessage ||
        `최대 ${options.maxLength}자 이하로 입력해주세요.`,
    )
  }

  return schema
}

const linkUrlSchema = yup.string().url("유효한 URL을 입력해주세요.").nullable()

export const findPasswordSchema = yup.object().shape({
  email: emailSchema,
  isEmailVerified: booleanSchema,
  password: passwordSchema,
  rePassword: rePasswordSchema,
})

export const signInSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
})

export const signUpSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
  rePassword: rePasswordSchema,
  name: nameSchema,
  nickname: nicknameSchema,
  isEmailVerified: booleanSchema,
  emailVerifiedCode: verifyCodeSchema,
})

export const lessonSchema = yup.object().shape({
  introduction: createStringRequiredSchema("소개를 입력해주세요."),
  career: stringNullSchema,
  pay: numberSchema,
  areas: yup
    .array()
    .min(1, "지역을 최소 1개 이상 선택해주세요.")
    .required("지역을 선택해주세요."),
  imageUrl: createStringRequiredSchema("이미지를 등록해주세요."),
})

export const jobSchema = yup.object().shape({
  title: createStringRequiredSchema("제목을 입력해주세요.", {
    minLength: 3,
    maxLength: 50,
    minErrorMessage: "3자 이상 입력해주세요.",
    maxErrorMessage: "50자 이하로 입력해주세요.",
  }),
  recruitSiteUrl: linkUrlSchema,
  contents: createStringRequiredSchema("내용을 입력해주세요."),
  companyName: createStringRequiredSchema("회사명을 입력해주세요.", {
    minLength: 2,
    maxLength: 20,
    minErrorMessage: "2자 이상 입력해주세요.",
    maxErrorMessage: "20자 이하로 입력해주세요.",
  }),
  address: createStringRequiredSchema("지역을 선택해주세요."),
  addressDetail: createStringRequiredSchema("상세 주소를 입력해주세요."),
  imageUrl: stringNullSchema,
  majors: yup
    .array()
    .min(1, "전공을 최소 1개 이상 선택해주세요.")
    .required("전공을 선택해주세요."),
})

export const partTimeSchema = yup.object().shape({
  title: createStringRequiredSchema("제목을 입력해주세요."),
  companyName: createStringRequiredSchema("단체 이름을 입력해주세요."),
  fee: numberSchema,
  address: createStringRequiredSchema("지역을 선택해주세요."),
  addressDetail: createStringRequiredSchema("상세 주소를 입력해주세요."),
  contents: createStringRequiredSchema("내용을 입력해주세요."),
  majors: yup
    .array()
    .min(1, "전공을 최소 1개 이상 선택해주세요.")
    .required("전공을 선택해주세요."),
  schedules: yup
    .array()
    .of(
      yup.object().shape({
        date: yup.string().required("날짜를 선택해주세요."),
        startTime: yup.string().required("시작 시간을 선택해주세요."),
        endTime: yup.string().required("종료 시간을 선택해주세요."),
      }),
    )
    .min(1, "일정을 최소 1개 이상 선택해주세요.")
    .required("일정을 입력해주세요."),
})

export const profileSchema = yup.object().shape({
  name: nameSchema,
  birth: createStringRequiredSchema("생년월일을 입력해주세요."),
  nickname: nicknameSchema,
  majors: yup.array().max(2, "전공은 2개까지 입력이 가능합니다.").nullable(),
  bachellor: stringNullSchema,
  master: stringNullSchema,
  doctor: stringNullSchema,
  imageUrl: stringNullSchema,
  phone: stringNullSchema,
})

export const performanceSchema = yup.object().shape({
  title: createStringRequiredSchema("제목을 입력해주세요."),
  startAt: createStringRequiredSchema("시작일을 입력해주세요."),
  endAt: createStringRequiredSchema("종료일을 입력해주세요."),
  time: createStringRequiredSchema("공연 시간을 입력해주세요."),
  age: createStringRequiredSchema("관람 연령을 입력해주세요."),
  ticketPrice: createStringRequiredSchema("티켓 가격을 입력해주세요."),
  cast: createStringRequiredSchema("출연진을 입력해주세요."),
  host: createStringRequiredSchema("주관-주최를 입력해주세요."),
  customAreaName: yup
    .string()
    .test(
      "conditional-required",
      "지역을 선택해주세요.",
      function (value, context) {
        if (!context.parent.area && !value) {
          return false
        }
        return true
      },
    ),
  posterImageUrl: createStringRequiredSchema("포스터 이미지를 등록해주세요."),
  reservationUrl: linkUrlSchema,
  area: yup
    .object()
    .shape({
      id: yup
        .number()
        .test(
          "conditional-required",
          "지역을 선택해주세요.",
          function (value, context) {
            if (context.parent.customAreaName === undefined && !value) {
              return false
            }
            return true
          },
        ),
      name: yup.string(),
    })
    .nullable(),
  introduction: createStringRequiredSchema("소개를 입력해주세요."),
})

export const newsSchema = yup.object().shape({
  title: createStringRequiredSchema("제목을 입력해주세요."),
  summary: createStringRequiredSchema("생년월일을 입력해주세요."),
  contents: createStringRequiredSchema("내용을 입력해주세요."),
  thumbnailImageUrl: createStringRequiredSchema("이미지를 등록해주세요."),
})

export const commentSchema = yup.object().shape({
  contents: createStringRequiredSchema("내용을 입력해주세요."),
})

export const postSchema = yup.object().shape({
  title: createStringRequiredSchema("제목을 입력해주세요."),
  contents: createStringRequiredSchema("내용을 입력해주세요."),
  category: yup
    .string()
    .oneOf(
      [PostCategory.ETC, PostCategory.INQUIRY, PostCategory.REVIEW],
      "유효하지 않은 카테고리입니다.",
    )
    .required("카테고리를 선택해주세요."),
})
