import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  restrictToWindowEdges, restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import DragHandle from '../DragHandle/DragHandle';
import "./styles.css";

// IMPORTANT !!! ...
// ... THIS GETS INJECT INTO THE PAGE ITSELF
// ... IT DOES NOT LIVE IN THE EXTENSION ENVIRONMENT BUT THE ACTUAL PAGE ITSELF!!
const ContentScript = () => {

    const [top, setTop] = useState(0);

    const handleDragEnd = (evt: DragEndEvent) => {
        setTop(top + evt.delta.y);
    }

    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
            <div className='draggable-container' style={{ top }}>
                <DragHandle />
            </div>
        </DndContext>
    )
}

export default ContentScript; 