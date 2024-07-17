import { useQueryClient } from "@tanstack/react-query"
import useToast from "./useToast"
import { useLoading } from "@toss/use-loading"
import { useRouter } from "next/navigation"

interface MutationsProps<T> {
  createFn?: (data: T) => Promise<any>
  updateFn?: (id: number, data: T) => Promise<any>
  deleteFn?: (id: number) => Promise<any>
  queryKey: string[]
  redirectPath: string
  successMessage: string
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

  const handleForm = async (data: T, id?: number) => {
    try {
      if (id && updateFn) {
        await startTransition(updateFn(id, data))
        successToast(successMessage)
      } else if (createFn) {
        await startTransition(createFn(data))
        successToast(successMessage)
      }
      router.push(redirectPath)
      queryClient.invalidateQueries({
        queryKey,
      })
    } catch (error: any) {
      errorToast(error.message)
      console.error(error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!deleteFn) return

    try {
      await startTransition(deleteFn(id))
      successToast(successMessage)
      router.push(redirectPath)
      queryClient.invalidateQueries({
        queryKey,
      })
    } catch (error: any) {
      errorToast(error.message)
      console.error(error)
    }
  }

  return {
    handleForm,
    handleDelete,
    isLoading,
  }
}

export default useMutation
