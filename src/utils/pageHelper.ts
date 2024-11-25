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

export const getClickableLinks = () => {
    const links = document.querySelectorAll('a');
    
    // Create an array to store the link details
    const clickableLinks:{
        text: string,
        url: string
    }[] = [];
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Check if the href is valid (non-empty and not just '#')
      if (href && href !== '#') {
        // Create a JSON object with the href and the link's text content
        clickableLinks.push({
          text: link.textContent?.trim() ?? '',
          url: href
        });
      }
    });
    
    return clickableLinks.filter(link => link.text && link.url);
  }

export const getFirstVideoInView = () => {
    // Get all video elements on the page
    const videos = document.querySelectorAll('video');
    
    // Loop through each video element
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        
        // Get the position of the video relative to the viewport
        const rect = video.getBoundingClientRect();

        // Check if the video is in the viewport (fully or partially)
        if (
            rect.top >= 0 &&                // Video is not above the viewport
            rect.left >= 0 &&               // Video is not off to the left of the viewport
            rect.bottom <= window.innerHeight &&  // Video is not below the viewport
            rect.right <= window.innerWidth    // Video is not off to the right of the viewport
        ) {
            return video;  // Return the first video that is in view
        }
    }
    
    // Return null if no video is in view
    return null;
}