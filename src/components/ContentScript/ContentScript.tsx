import React, { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractCommandFromText, extractTargetContent, extractURLFromText } from '../../utils/aiTweaker';
import { getAllSearchInputs, getClickableLinks } from '../../utils/pageHelper';
import {
    restrictToWindowEdges, restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import Popover from '@mui/material/Popover/Popover';
import DragHandle from '../DragHandle/DragHandle';
import { Box, Button, CircularProgress } from '@mui/material';
import { SUPPORTED_COMMANDS } from '../../constants';
import "./styles.css";

// THIS GETS INJECT INTO THE PAGE ITSELF
const ContentScript = () => {
    const [top, setTop] = useState(50);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const handleDragEnd = (evt: DragEndEvent) => {
        setTop(top + evt.delta.y);
    }

    const extractURL = async () => {
        const session = await getAISession("You are responsible to getting full URLs from voice commands.") as AILanguageModel;
        const result = await session.prompt(`User said: ${transcript}. What is the fully qualified https URL they'd like to navigate to?`);
        const url = extractURLFromText(result);
        console.log(result, "<-- result")
        console.log(url, "<-- url")

        // NAVIGATE !!
        if (url) {
            window.location.href = url
        }
        else {
            setError('Please state your command clearer.')
            console.log('Please state your command clearer.')
        }
    }

    const matchLinkToClick = async () => {
        const clickableLinks = getClickableLinks();
        const clickableLinksText = clickableLinks.map(link => link.text);
        console.log(clickableLinks)
        const session = await getAISession("You will take a user voice command and match it against a set of text values to see which one the user wants to access.") as AILanguageModel;
        const result = await session.prompt(`User said: ${transcript}. Which of the following text values matches best ${clickableLinksText}?`);
        const targetContent = extractTargetContent(result);

        // Find the link that matches the target content
        const matchedLink = clickableLinks.find(link => link.text.toLocaleLowerCase() === (targetContent ?? '').toLocaleLowerCase());

        console.log(result, "<-- result")
        console.log(matchedLink, "<-- url")

        // GO TO IT
        if (matchedLink) {
            window.location.href = matchedLink.url
        }
        else {
            setError('Please state your command clearer.')
            console.log('Please state your command clearer.')
        }
    }

    const extractCommand = async () => {
        setIsLoading(true)
        const session = await getAISession("You are responsible to converting voice commands to browser actions to support accessibility.") as AILanguageModel;

        try {
            const result = await session.prompt(`
                The user said: ${transcript}. 
                Out of the supported commands listed here: ${SUPPORTED_COMMANDS.join(",")}. 
                Which action do you think the use is attempting. 
                Only pick one action.
                All input/output will use the ENGLISH language.
            `);
            // ai please give me what i need only next time!
            const command = extractCommandFromText(result);

            console.log(result, "<-- result")
            console.log(command, "<-- command")

            // HANDLER FOR COMMANDS
            if (command === 'NAVIGATE TO URL') {
                extractURL();
            }
            else if (command === 'SCROLL DOWN' || command === 'SCROLL') {
                window.scrollBy(0, window.innerHeight);
            }
            else if (command === 'SCROLL UP') {
                window.scrollBy(0, -window.innerHeight);
            }
            else if (command === 'CLICK LINK') {
                matchLinkToClick();
            }
            else if (command === 'REFRESH PAGE') {
                window.location.reload();
            }
            else if (command === 'SEARCH CURRENT PAGE') {
                const searchInputIds = getAllSearchInputs();
                const searchInputID = searchInputIds[0];
                // Do the search 
                if (searchInputID) {
                    console.log(searchInputID, "<-- searchInputID")
                    // Find the search input field by its ID
                    const searchInput = document.getElementById(searchInputIds[0]) ?? document.getElementsByClassName(searchInputIds[0])[0];
                    if (searchInput) {
                        // Set a value for the search input (optional)
                        (searchInput as HTMLInputElement).value = transcript.toLocaleLowerCase().replace("search for", "").trim();

                        // Simulate the "Enter" key press
                        const enterEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',          
                            keyCode: 13,           
                            code: 'Enter',         
                            which: 13,             
                            bubbles: true,         
                        });

                        // Dispatch the event to the search input element
                        (searchInput as HTMLInputElement).focus();                        
                        setTimeout(() => {
                            searchInput.dispatchEvent(enterEvent);
                        }, 2000)
                    }
                }
                else {
                    setError('No search input found on the page.')
                }
            }
            else {
                setError('Unable to handle your request. Please try again later.')
            }

            setIsLoading(false)
        }
        catch (e: any) {
            setIsLoading(false)
            setError(e.message ?? 'Google AI Prompt API failed to return a response.')
        }

        // Start listening again
        SpeechRecognition.startListening();
    }

    const getAISession = async (systemPrompt: string) => {
        return new Promise((resolve, reject) => {
            const ai = (window as any).ai as AI;
            if (ai.languageModel) {
                ai.summarizer.capabilities().then((response: any) => {
                    const capabilities = response.available;
                    if (capabilities === 'readily') {
                        ai.languageModel.create({
                            systemPrompt,
                        }).then((session: any) => {
                            resolve(session)
                        }).catch((err: any) => {
                            reject(err)
                        })
                    }
                    else if (capabilities === 'after-download') {
                        // download the model
                        ai.languageModel.create({
                            monitor(m: any) {
                                m.addEventListener('downloadprogress', (e: any) => {
                                    console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                                });
                            }
                        })
                        // throw error in the meantime
                        reject(new Error('AI Prompt API is ready to use after downloading the model.'))
                    }
                    else {
                        reject(new Error('AI Prompt API not available to use. please check your flags in this browser.'))
                    }
                }).catch((err: any) => {
                    reject(err)
                })
            } else {
                reject(new Error('AI Prompt API not supported in this browser.'))
            }
        })
    }

    useEffect(() => {
        if (!listening && transcript.trim() !== '') {
            extractCommand();
        }
    }, [listening, transcript])

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }, [error])

    return (
        <div>
            <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
                <div className='draggable-container' style={{ top }}>
                    <DragHandle badgeCount={0} />
                    <Button
                        size='small'
                        sx={{
                            color: 'black',
                            width: 10,
                            margin: 0,
                            padding: 0,
                            fontSize: 14,
                            textTransform: 'none'
                        }}
                        onClick={(event) => {
                            setOpen(!open)
                            if (open) {
                                setAnchorEl(null)
                            }
                            else {
                                setAnchorEl(event.currentTarget)
                            }
                        }}>
                        {open ? 'HIDE' : 'VIEW'}
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
                <Box sx={{ width: 300 }}>
                    {!browserSupportsSpeechRecognition && <span>Browser doesn't support speech recognition.</span>}
                    {browserSupportsSpeechRecognition && (
                        <div>
                            <p>Microphone: {listening ? 'on' : 'off'}</p>
                            <Button
                                disabled={listening}
                                onClick={SpeechRecognition.startListening as any}>Start</Button>
                            <Button
                                disabled={!listening}
                                onClick={SpeechRecognition.stopListening}>Stop</Button>
                            <Button onClick={resetTranscript}>Reset</Button>
                            {isLoading && <CircularProgress size="18px" />}
                            <p>Text: {transcript}</p>
                            {error && <p>error: {error}</p>}
                        </div>
                    )}
                </Box>
            </Popover>
        </div>
    )
}

export default ContentScript; 