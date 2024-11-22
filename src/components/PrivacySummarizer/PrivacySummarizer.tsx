import React from 'react';
import Button from '@mui/material/Button/Button';
import Markdown from 'react-markdown';

interface PrivacySummaryProps {
    summary?: string
    errorMessage?: string
    summarize: () => void
}

const PrivacySummary = ({ summary, errorMessage, summarize }: PrivacySummaryProps) => {
  return (
    <div>
      <Button color='info' variant='contained' sx={{ fontSize: 14 }} onClick={() => {
        summarize()
      }}>Summarize</Button>
      {summary && <Markdown>{summary}</Markdown>}
      {errorMessage && <div className='info'>{errorMessage}</div>}
    </div>
  );
}

export default PrivacySummary;
