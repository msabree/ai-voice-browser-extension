import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
    restrictToWindowEdges, restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import Popover from '@mui/material/Popover/Popover';
import Button from '@mui/material/Button/Button';
import DragHandle from '../DragHandle/DragHandle';
import "./styles.css";
import CookiesTable, { Cookie } from '../CookiesTable/CookiesTable';

// THIS GETS INJECT INTO THE PAGE ITSELF
const ContentScript = () => {
    const [top, setTop] = useState(0);
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [aiCookiesJson, setAiCookiesJson] = useState<Cookie[] | null>(null)

    const handleDragEnd = (evt: DragEndEvent) => {
        setTop(top + evt.delta.y);
    }

    const deleteCookie = (name: string): void => {
        // Set the cookie with the same name and a past expiration date to delete it
        document.cookie = `${name}="VOIDED_BY_COOKIE_JAR"; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }

    const analyzeCookies = () => {
        if (document.cookie.trim() !== '') {
            const genAI = new GoogleGenerativeAI(process.env.REACT_APP_AI_API_KEY ?? '');
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Analyze the following cookies from a website. 
            Identify any potentially invasive cookies and return the data 
            in a JSON format with these properties: cookie_name (name of the cookie), 
            cookie_value (value of the cookie), message (explanation of its purpose), 
            should_delete (boolean indicating if the user should consider deleting it), 
            category (type of cookie, e.g., tracking, session), expiration 
            (expiration date/time of the cookie), and origin (source of the cookie, 
            e.g., first-party, third-party). Cookies data: ${document.cookie}. I need to parse this 
            so please return valid JSON only and nothing else.`

            model.generateContent(prompt).then((result) => {
                const rawJsonString = result.response.text();
                // this format is frustrating. Gemini adds extra text that i do not want
                const firstPart = rawJsonString.split("```json")[1]
                const jsonStringOnly = firstPart.split("```")[0]
                let jsonCookieData = null
                try {
                    jsonCookieData = JSON.parse(jsonStringOnly)
                }
                catch (e) {
                    console.log(e)
                }
                setAiCookiesJson(jsonCookieData)
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    useEffect(() => {
        analyzeCookies()
    }, [])

    return (
        <div>
            <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
                <div className='draggable-container' style={{ top }}>
                    <DragHandle />
                    <Button
                        size='small'
                        sx={{width: 10, margin: 0, padding: 0}}
                        onClick={(event) => {
                            setOpen(true)
                            setAnchorEl(event.currentTarget)
                        }}>
                        {open ? 'Hide' : 'View'}
                    </Button>
                </div>
            </DndContext>
            <Popover
                id={open ? 'simple-popover' : undefined}
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                    setOpen(false)
                    setAnchorEl(null)
                }}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
            >
                <CookiesTable data={aiCookiesJson ?? []} onDelete={(cookie) => {
                    deleteCookie(cookie)
                    analyzeCookies()
                }} />
            </Popover>
        </div>
    )
}

export default ContentScript; 