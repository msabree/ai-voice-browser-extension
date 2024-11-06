import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
    restrictToWindowEdges, restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import Popover from '@mui/material/Popover/Popover';
import Button from '@mui/material/Button/Button';
import DragHandle from '../DragHandle/DragHandle';
import CookiesTable, { Cookie } from '../CookiesTable/CookiesTable';
import "./styles.css";
import { Box, Tabs, Tab } from '@mui/material';
import PrivacySummary from '../PrivacySummarizer/PrivacySummarizer';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// THIS GETS INJECT INTO THE PAGE ITSELF
const ContentScript = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [top, setTop] = useState(0);
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [aiCookiesJson, setAiCookiesJson] = useState<Cookie[] | null>(null)
    const [summaryError, setSummaryError] = useState('')
    const [summary, setSummary] = useState('')

    const handleDragEnd = (evt: DragEndEvent) => {
        setTop(top + evt.delta.y);
    }

    const getDomain = () => {
        try {
            return `${window.location.hostname.split("www")[1]}`
        } catch (e) {
            return `.${window.location.hostname}`
        }
    }

    const isPrivacyOrPolicyPage = (): boolean => {
        const regex = /(?:privacy|policy|terms|agreement|cookies?|gdpr?|security)(?:[\w/-]*)(?:\.html?)?$/i;
        const url = window.location.pathname.toLowerCase(); // Check only the path part of the URL
        return regex.test(url);
      };

    const getBadgeCount = () => {
        return (aiCookiesJson ?? [])?.filter((cookie) => cookie.should_delete).length
    }

    const deleteCookie = (name: string): void => {
        // Set the cookie with the same name and a past expiration date to delete it (domains MUST match)
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${getDomain()}`;
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
                console.log(rawJsonString)
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
                if (jsonCookieData?.cookies) {
                    setAiCookiesJson(jsonCookieData.cookies)
                }
                else {
                    setAiCookiesJson(jsonCookieData)
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const summarizePrivacyPolicy = () => {
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_AI_API_KEY ?? '');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const innerText = document.body.innerText;

        const prompt = `
                Review the following privacy policy or terms of service text. 
                Based on language clarity, transparency, and user protection measures, 
                provide a privacy and trust score. Consider factors such as data handling, 
                user rights, and security practices. Your assessment should reflect whether 
                the site is safe and prioritizes user privacy effectively. Return the result 
                as HTML for injection into my page. Here is the data: ${innerText}"
            `;

        model.generateContent(prompt).then((result) => {
            console.log(result.response.text())
            try{

                const aiResponseRawText = result.response.text();
                if(aiResponseRawText.includes('```html')){
                    // parse out the html
                    const firstPart = aiResponseRawText.split("```html")[1]
                    const htmlStringOnly = firstPart.split("```")[0]
                    setSummary(htmlStringOnly)
                } else{
                    setSummary(aiResponseRawText)
                }
            }
            catch(e){
                setSummary('Unable to provide an AI Privacy Summary for this site. Please try again later.')
                console.log(e)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        analyzeCookies()
    }, [])

    const CustomTabPanel = (props: TabPanelProps) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    }


    return (
        <div>
            <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
                <div className='draggable-container' style={{ top }}>
                    <DragHandle badgeCount={getBadgeCount()} />
                    <Button
                        size='small'
                        sx={{ width: 10, margin: 0, padding: 0, fontSize: 14 }}
                        onClick={(event) => {
                            setOpen(!open)
                            if (open) {
                                setAnchorEl(null)
                            }
                            else {
                                setAnchorEl(event.currentTarget)
                            }
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
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ width: 700 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={(_evt: any, index: number) => setTabIndex(index)} aria-label="Cookie Jar Tabs">
                            <Tab label="AI Cookie Manager" sx={{ textTransform: 'none', fontSize: 16 }} />
                            <Tab label="AI Privacy Summary" sx={{ textTransform: 'none', fontSize: 16 }} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabIndex} index={0}>
                        <CookiesTable data={aiCookiesJson ?? []} onDelete={(cookie) => {
                            deleteCookie(cookie)
                            analyzeCookies()
                        }} />
                    </CustomTabPanel>
                    <CustomTabPanel value={tabIndex} index={1}>
                        <PrivacySummary summary={summary} errorMessage={summaryError} summarize={() => {
                            if (isPrivacyOrPolicyPage()) {
                                setSummaryError('')
                                summarizePrivacyPolicy()
                            }
                            else{
                                setSummaryError('Privacy policy or terms page not detected. Please visit a valid privacy page and try again.')
                            }
                        }} />
                    </CustomTabPanel>
                </Box>
            </Popover>
        </div>
    )
}

export default ContentScript; 