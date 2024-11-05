import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import CookieJarIcon from '../../icons/CookieJar';
import "./styles.css"

const DragHandle = (props: any) => {

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div className="drag-handle" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CookieJarIcon width={60} height={80} fill={'#ffffff'} />
    </div>
  )
}

export default DragHandle;