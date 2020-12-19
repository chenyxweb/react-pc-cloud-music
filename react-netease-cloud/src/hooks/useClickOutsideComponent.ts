// 点击传入的组件外时触发回调的hook
import { useEffect, RefObject } from 'react'

const useClickOutsideComponent = (ref: RefObject<HTMLElement>, callback: Function) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // console.log(e.target)
      // 如果 dom 中没有这个节点 或者这个节点包括了点击的这个元素 return
      if (!ref.current || ref.current.contains(e.target as HTMLElement)) return
      callback()
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [callback, ref])
}

export default useClickOutsideComponent
