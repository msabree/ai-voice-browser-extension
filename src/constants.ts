export const SUPPORTED_COMMANDS = [
    'NAVIGATE TO URL', 
    'SEARCH CURRENT PAGE',
    'SCROLL',
    'SCROLL UP',
    'SCROLL DOWN', 
    'REFRESH PAGE', 
    'CLICK LINK',
    'UNMUTE VIDEO',
    'MUTE VIDEO',
    'PLAY VIDEO',
    'PAUSE VIDEO',
] as const;

export type SUPPORTED_COMMANDS_TYPE = typeof SUPPORTED_COMMANDS[number];