export const getAllSearchInputs = () => {
    // Get all input and textarea fields on the page
    const allFields = document.querySelectorAll('input, textarea, faceplate-search-input');

    // Filter elements that might be used for search, excluding hidden ones
    const searchFields = Array.from(allFields).filter((field: any) => {
        // Check if the element is visible (not display: none)
        const isVisible = window.getComputedStyle(field).display !== 'none';

        // If the element is hidden, exclude it from the results
        if (!isVisible) return false;

        // Check if it's a text input or a textarea (common for search)
        const isTextInput = field.tagName.toLowerCase() === 'input' && field.type === 'text';
        const isTextArea = field.tagName.toLowerCase() === 'textarea';

        // Check if the placeholder contains 'search' (case-insensitive)
        const hasSearchPlaceholder = field.placeholder && field.placeholder.toLowerCase().includes('search');

        // Optionally check if the field has IDs or classes suggesting it's a search input
        const hasSearchIdOrClass = /search|query/i.test(field.id + field.className);

        // Return true if any of the conditions are met and the element is visible
        return (isTextInput || isTextArea) || hasSearchPlaceholder || hasSearchIdOrClass;
    }).map(field => {
        // Return the id if available, otherwise fallback to className (use the first class if there are multiple)
        return field.id || field.className.split(' ')[0]; // Get the first class name if id is not available
    });

    return searchFields
}