import { SUPPORTED_COMMANDS } from "../constants";

// The built in AI model does not like it when you instruct it on how to return data.
// So... insead of it JUST returning a command from the array it returns a bunch of garbage text as well.
// So.. here's a helper function to extract the command from the garbage text.
export const extractCommandFromText = (text: string) => {
    // Loop through actions and return the first one found in the text
    for (let action of SUPPORTED_COMMANDS) {
        if (text.toLocaleLowerCase().includes(action.toLocaleLowerCase())) {
            return action;
        }
    }

    // If no action is found, return null (or you can return an empty string)
    return null;
}

// Again, instead of getting what i ask for i get more garbage text.
// Extract out the fully qualified URL from the garbage text.
export const extractURLFromText = (text: string) => {

    // Google AI loves markdown stars, so we need to remove them.
    const cleanedText = text.replace(/\*/g, '');
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/i;

    // Match the URL in the text
    const match = cleanedText.match(urlPattern);

    // Return the first matched URL, or null if no match is found
    return match ? match[0] : null;
}