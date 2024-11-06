import React from 'react';
import Button from '@mui/material/Button/Button';

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
      {summary && <div className='info' dangerouslySetInnerHTML={{__html: summary}} />}
      {errorMessage && <div className='info'>{errorMessage}</div>}
    </div>
  );
}

export default PrivacySummary;
