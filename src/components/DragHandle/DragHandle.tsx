import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Badge } from '@mui/material';
import Logo from '../../icons/Logo';
import "./styles.css"

interface DragHandleProps {
  badgeCount: number
}

const DragHandle = ({ badgeCount }: DragHandleProps) => {

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div className="drag-handle" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Badge badgeContent={badgeCount} color='warning' anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
        <Logo width={30} height={50} fill={'#ffffff'} />
      </Badge>
    </div>
  )
}

export default DragHandle;