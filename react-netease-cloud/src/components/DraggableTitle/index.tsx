// 可拖拽的标题
import React, { FC, useEffect, useRef } from 'react'
import styles from './index.module.scss'

interface IProps {
  /** 标题 */
  text?: string
  /**正在拖拽 */
  onDragging?: (p: { x: number; y: number }) => void // 拖拽ing
}

const DraggableTitle: FC<IProps> = props => {
  const { text, onDragging } = props
  const divRef = useRef<HTMLDivElement>(null)

  const d = useRef<{ dX: number; dY: number }>({ dX: 0, dY: 0 }) // 存储差值

  // 处理拖拽
  useEffect(() => {
    console.log(divRef.current?.getBoundingClientRect())
    const divEle = divRef.current

    if (divEle) {
      const handleMousemove = (e: MouseEvent) => {
        if (d.current) {
          const x = e.clientX - d.current.dX
          const y = e.clientY - d.current.dY
          onDragging && onDragging({ x, y })
        }
      }

      // 鼠标按下事件
      divEle.addEventListener('mousedown', e => {
        const { left, top } = divEle.getBoundingClientRect()

        // 求差
        const dX = e.clientX - left
        const dY = e.clientY - top

        // 保存差值
        d.current.dX = dX
        d.current.dY = dY

        // 移动事件
        document.addEventListener('mousemove', handleMousemove)
      })

      divEle.addEventListener('mouseup', () => {
        // 取消mousemove事件
        document.removeEventListener('mousemove', handleMousemove)
      })
    }
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

export default DraggableTitle
