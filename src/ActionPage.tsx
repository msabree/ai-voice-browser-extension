import React from 'react';
import './ActionPage.css'

const ActionPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        Welcome to AI Voice Browser
      </header>
      <div className="summary">
        <p>Things you can do... Just say it and we'll do it for you!</p>

        <ul>
          <li><strong>NAVIGATE TO URL:</strong> Browse to any website.</li>
          <li><strong>SEARCH CURRENT PAGE:</strong> Finds inputs on the current page and performs queries.</li>
          <li><strong>SCROLL:</strong> Scroll up and down the page.</li>
          <li><strong>REFRESH PAGE:</strong> Refresh the page.</li>
          <li><strong>CLICK LINK:</strong> Click on any link by describing the text.</li>
          <li><strong>VIDEO CONTROLS:</strong> Stop, play, pause, mute, and unmute a video.</li>
        </ul>

        <p>More commands coming soon!</p>
      </div>
      <div className='footer'>
        <a href="https://www.flaticon.com/free-icons/voice-recognition" title="voice recognition icons">Voice recognition icons created by HideMaru - Flaticon</a>
      </div>
    </div>
  );
}

export default ActionPage;
