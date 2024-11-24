import React, { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractCommandFromText, extractURLFromText } from '../../utils/aiTweaker';
import {
    restrictToWindowEdges, restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import Popover from '@mui/material/Popover/Popover';
import DragHandle from '../DragHandle/DragHandle';
import { Box, Button } from '@mui/material';
import { SUPPORTED_COMMANDS } from '../../constants';
import "./styles.css";

// THIS GETS INJECT INTO THE PAGE ITSELF
const ContentScript = () => {
    const [top, setTop] = useState(50);
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(true)
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
        const ai = (window as any).ai as AI;
        if (ai.languageModel) {
            const capabilities = (await ai.summarizer.capabilities()).available;
            if (capabilities === 'readily') {
                console.log('extracting URL')
                const session = await ai.languageModel.create({
                    systemPrompt: "You are responsible to getting full URLs from voice commands.",
                });

                const result = await session.prompt(`User said: ${transcript}. What is the fully qualified https URL they'd like to navigate to?`);
                const url = extractURLFromText(result);
                console.log(result, "<-- result")
                console.log(url, "<-- url")

                // NAVIGATE !!
                if(url){
                    window.location.href = url
                }
                else {
                    console.log('Please state your command clearer.')    
                }
            }
            else if (capabilities === 'after-download') {
                console.log('AI Prompt API is ready to use after downloading the model.')
                await ai.languageModel.create({
                    monitor(m: any) {
                        m.addEventListener('downloadprogress', (e: any) => {
                            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                        });
                    }
                });
                return;
            }
            else {
                console.log('AI Prompt API not available to use. please check your flags in this browser.')
            }
        } else {
            console.log('AI Prompt API not supported in this browser.')
        }    
    }

    const extractCommand = async () => {
        const ai = (window as any).ai as AI;
        if (ai.languageModel) {
            const capabilities = (await ai.summarizer.capabilities()).available;
            if (capabilities === 'readily') {
                const session = await ai.languageModel.create({
                    systemPrompt: "You are responsible to converting voice commands to browser actions to support accessibility.",
                });

                const result = await session.prompt(`User said: ${transcript}. Here's you're index of commands: ${SUPPORTED_COMMANDS.join(",")}.`);
                // ai please give me what i need only next time!
                const command = extractCommandFromText(result);

                console.log(result, "<-- result")
                console.log(command, "<-- command")

                // HANDLER FOR COMMANDS
                if(command === 'NAVIGATE'){
                    extractURL();
                }
            
            }
            else if (capabilities === 'after-download') {
                console.log('AI Prompt API is ready to use after downloading the model.')
                await ai.languageModel.create({
                    monitor(m: any) {
                        m.addEventListener('downloadprogress', (e: any) => {
                            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                        });
                    }
                });
                return;
            }
            else {
                console.log('AI Prompt API not available to use. please check your flags in this browser.')
            }
        } else {
            console.log('AI Prompt API not supported in this browser.')
        }
    }


    useEffect(() => {
        if(!listening && transcript.trim() !== ''){
            extractCommand();
        }
    }, [listening, transcript])

    return (
        <div>
            <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
                <div className='draggable-container' style={{ top }}>
                    <DragHandle badgeCount={0} />
                    <Button
                        size='small'
                        color='info'
                        sx={{ width: 10, margin: 0, padding: 0, fontSize: 14, textTransform: 'none' }}
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
                            <p>Text: {transcript}</p>
                        </div>
                    )}
                </Box>
            </Popover>
        </div>
    )
}

export default ContentScript; 