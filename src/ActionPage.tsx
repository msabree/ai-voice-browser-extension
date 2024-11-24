import React from 'react';
import './ActionPage.css'

const ActionPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        Welcome to AI Voice Browser
      </header>
      <div className='summary'>
        Things you can do... Just say it and we'll do it for you!

        1. Go to a website
        2. Refresh the page
        3. Scroll down
        4. Scroll up

      </div>
      <div className='footer'>
        <a href="https://www.flaticon.com/free-icons/voice-recognition" title="voice recognition icons">Voice recognition icons created by HideMaru - Flaticon</a>
      </div>
    </div>
  );
}

export default ActionPage;
