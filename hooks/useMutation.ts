import { QueryKey, useQueryClient } from "@tanstack/react-query"
import useToast from "./useToast"
import { useLoading } from "@toss/use-loading"
import { useRouter } from "next/navigation"

interface MutationsProps<T> {
  createFn?: (data: T) => Promise<any>
  updateFn?: (id: number, data: T) => Promise<any>
  deleteFn?: (id?: number) => Promise<any>
  queryKey: QueryKey
  redirectPath?: string
  successMessage: {
    create?: string
    update?: string
    delete?: string
  }
}

const useMutation = <T>({
  createFn,
  updateFn,
  deleteFn,
  queryKey,
  redirectPath,
  successMessage,
}: MutationsProps<T>) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, startTransition] = useLoading()
  const { successToast, errorToast } = useToast()

  const handleSubmit = async (data: T, id?: number) => {
    try {
      if (id && updateFn) {
        await startTransition(updateFn(id, data))
        successToast(successMessage?.update || "수정되었습니다.")
      } else if (createFn) {
        await startTransition(createFn(data))
        successToast(successMessage?.create || "등록되었습니다.")
      }
      if (redirectPath) router.push(redirectPath)
      queryClient.invalidateQueries({
        queryKey,
      })
    } catch (error: any) {
      errorToast(error.message)
      console.error(error)
    }
  }

  const handleDelete = async (id?: number) => {
    if (!deleteFn) return

    try {
      await startTransition(deleteFn(id))
      successToast(successMessage?.delete || "삭제되었습니다.")
      if (redirectPath) router.push(redirectPath)
      queryClient.invalidateQueries({
        queryKey,
      })
    } catch (error: any) {
      errorToast(error.message)
      console.error(error)
    }
  }

  return {
    handleSubmit,
    handleDelete,
    isLoading,
  }
}

export default useMutation
