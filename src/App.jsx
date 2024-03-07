// App.js
import React, { useState } from 'react';
import './App.css';
import WorkingHour from './component/WorkingHour';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <>
      {/* <Header /> */}
      <WorkingHour currentDate={currentDate} />

    </>
  );
}

export default App;
