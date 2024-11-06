import React from 'react';
import './App.css'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        Welcome to Cookie Jar
      </header>
      <div className='summary'>
        This extension uses Google Gemini AI to analyze the cookies set by your browser,
        helping you determine whether they are safe or potentially invasive. With this information,
        you can make informed decisions about which cookies to keep and which to delete.
        <br></br>
        Additionally, when you visit the privacy page of any site, Cookie Jar will summarize the site's
        terms and provide a score based on our AI's interpretation, giving you a quick, clear overview
        of the site's privacy practices.
        <br></br>
        To start managing your cookies, simply click the button on the right side of your browser.
      </div>
    </div>
  );
}

export default App;
