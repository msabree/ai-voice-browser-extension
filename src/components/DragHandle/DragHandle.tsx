import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import "./styles.css"
import CookieJarIcon from '../../icons/CookieJar';

const DragHandle = (props: any) => {

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div className="drag-handle" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CookieJarIcon width={100} height={100} fill={'#ffffff'} />
    </div>
  )
}

export default DragHandle;