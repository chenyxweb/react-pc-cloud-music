// 可拖拽的标题
import React, { FC, memo, useEffect, useRef } from 'react'
import styles from './index.module.scss'

interface IProps {
  /** 标题 */
  text?: string
  /**正在拖拽 */
  onDragging?: (p: { x: number; y: number }) => void // 拖拽ing
}

const DraggableTitle: FC<IProps> = (props) => {
  const { text, onDragging } = props
  const divRef = useRef<HTMLDivElement>(null)

  const d = useRef<{ dX: number; dY: number }>({ dX: 0, dY: 0 }) // 存储差值

  // 处理拖拽
  useEffect(() => {
    console.log(divRef.current?.getBoundingClientRect())
    const divEle = divRef.current

    const handleMousedown = (e: MouseEvent) => {
      if (!divEle) return
      const { left, top } = divEle.getBoundingClientRect()

      // 求差
      const dX = e.clientX - left
      const dY = e.clientY - top

      // 保存差值
      d.current.dX = dX
      d.current.dY = dY

      // 移动事件
      document.addEventListener('mousemove', handleMousemove)
    }

    const handleMousemove = (e: MouseEvent) => {
      if (d.current) {
        const x = e.clientX - d.current.dX
        const y = e.clientY - d.current.dY
        onDragging && onDragging({ x, y })
      }
    }

    const handleMouseup = () => {
      // 取消mousemove事件
      document.removeEventListener('mousemove', handleMousemove)
    }

    if (divEle) {
      // 鼠标按下事件
      divEle.addEventListener('mousedown', handleMousedown)

      divEle.addEventListener('mouseup', handleMouseup)
    }

    return () => {
      document.removeEventListener('mousemove', handleMousemove)
      divEle && divEle.removeEventListener('mousedown', handleMousedown)
      divEle && divEle.removeEventListener('mouseup', handleMouseup)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={divRef} className={styles.DraggableTitle}>
      {text}
    </div>
  )
}

DraggableTitle.defaultProps = {
  text: '标题',
}

export default memo(DraggableTitle)
