import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import CookiesTable, { Cookie } from './components/CookiesTable/CookiesTable';
import './App.css'

interface Message {
  event: string
  cookies?: string
}

const App = () => {
  // todo: move to a config file
  const API_KEY = window.localStorage.getItem('AI_API_KEY') ?? ''
  const [aiCookiesJson, setAiCookiesJson] = useState<Cookie[]|null>(null)

  useEffect(() => {
    (window as any).chrome?.runtime?.onMessage?.addListener((message: Message, sender: any, sendResponse: any) => {
      console.log(message)
      console.log(sender)
      console.log(sendResponse)

      if(message.cookies){
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
        const prompt = `Analyze the following cookies from a website. 
        Identify any potentially invasive cookies and return the data 
        in a JSON format with these properties: cookie_name (name of the cookie), 
        cookie_value (value of the cookie), message (explanation of its purpose), 
        should_delete (boolean indicating if the user should consider deleting it), 
        category (type of cookie, e.g., tracking, session), expiration 
        (expiration date/time of the cookie), and origin (source of the cookie, 
        e.g., first-party, third-party). Cookies data: ${message.cookies}. I need to parse this 
        so please return valid JSON only and nothing else.`
    
        model.generateContent(prompt).then((result) => {
          const rawJsonString = result.response.text();
          // this format is frustrating. Gemini adds extra text that i do not want
          const firstPart = rawJsonString.split("```json")[1]
          const jsonStringOnly = firstPart.split("```")[0]
          let jsonCookieData = null
          try{
            jsonCookieData = JSON.parse(jsonStringOnly)
          }
          catch(e){
            console.log(e)
          }
          setAiCookiesJson(jsonCookieData)
        }).catch((err) => {
          console.log(err)
        })

      }
    })
  }, [API_KEY])

  return (
    <div className="App">
      <header className="App-header">
        Cookie Jar Extenstion
      </header>
      <CookiesTable data={aiCookiesJson ?? []} />
    </div>
  );
}

export default App;
