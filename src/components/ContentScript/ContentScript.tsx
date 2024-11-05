import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        (window as any).chrome?.runtime?.sendMessage({
            event: 'mount',
            cookies: document.cookie
        }, (response: any) => {
            console.log('response from background:')
        })
    }, [])

    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
            <div className='draggable-container' style={{ top }}>
                <DragHandle onClick={() => {
                    (window as any).chrome.runtime.sendMessage({
                        event: 'clicked handle'
                    }, (response: any) => {
                        console.log('response from background:')
                    })
                }} />
            </div>
        </DndContext>
    )
}

export default ContentScript; 