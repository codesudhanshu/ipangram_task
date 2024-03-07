import React, { useState } from 'react';
import "../App.css";
import jsonData from '../db/data.json';

const WorkingHour = () => {
  const [currentDay, setCurrentDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timezone, setTimezone] = useState('[UTC-5] Eastern Standard Time');
  const [appointments, setAppointments] = useState(jsonData);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startTime = 8;
  const endTime = 23;

  const generateTimeSlots = (day, currentDate) => {
    const slots = [];
    const currentDateString = currentDate.toLocaleDateString('en-US');
    const todayDateString = new Date().toLocaleDateString('en-US');
    const isNextWeek = currentDate > new Date();

    if (isNextWeek) {
      for (let hour = startTime; hour <= endTime; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const formattedHour = hour % 12 || 12;
          const amPm = hour < 12 ? 'AM' : 'PM';
          const time = `${formattedHour}:${minute === 0 ? '00' : '30'} ${amPm}`;
          slots.push(time);
        }
      }
    } else {
      if (days.indexOf(day) < days.indexOf(currentDay) || currentDateString !== todayDateString) {
        slots.push('Past Day');
      } else {
        for (let hour = startTime; hour <= endTime; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const formattedHour = hour % 12 || 12;
            const amPm = hour < 12 ? 'AM' : 'PM';
            const time = `${formattedHour}:${minute === 0 ? '00' : '30'} ${amPm}`;
            slots.push(time);
          }
        }
      }
    }

    return slots;
  };

  const handleCheckboxChange = (day, time, dayDate) => {
    const updatedAppointments = [...appointments];
    const index = updatedAppointments.findIndex(
      (appointment) => appointment.Day === day && appointment.Time === time
    );

    if (index !== -1) {
      updatedAppointments.splice(index, 1);
    } else {
      updatedAppointments.push({
        Id: Math.max(...appointments.map((appointment) => appointment.Id), 0) + 1,
        Name: 'New Appointment',
        Date: dayDate.toISOString().split('T')[0],
        Time: time,
      });
    }

    setAppointments(updatedAppointments);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
    setCurrentDay(newDate.toLocaleDateString('en-US', { weekday: 'long' }));
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
    setCurrentDay(newDate.toLocaleDateString('en-US', { weekday: 'long' }));
  };

  const handleTimezoneChange = (event) => {
    setTimezone(event.target.value);
  };

  const renderTimeSlots = () => {
    const today = new Date();
    const todayIndex = days.indexOf(currentDay);
    const daysFromToday = todayIndex !== -1 ? todayIndex : 0;

    return (
      <div className="time-slots">
        {days.map((day, index) => {
          const dayDate = new Date(currentDate);
          dayDate.setDate(dayDate.getDate() + index - daysFromToday);

          return (
            <div key={day} className='flex'>
              <div>
                <h3 style={{ color: dayDate.toDateString() === today.toDateString() ? 'green' : 'red' }}>
                  {day}
                </h3>
                <p>{dayDate.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric' })}</p>
              </div>
              <div className='day-column'>
                {generateTimeSlots(day, dayDate).map((item, timeIndex) => (
                  <div key={timeIndex}>
                    {item === 'Past Day' ? (
                      <span>Past Day</span>
                    ) : (
                      <label className='timeSlot'>
                        <input
                          type="checkbox"
                          checked={appointments.some(
                            (appt) => appt.Date === dayDate.toISOString().split('T')[0] && appt.Time === item
                          )}
                          onChange={() => handleCheckboxChange(day, item, dayDate)}
                        />
                        {item}
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className='flex'>
        <button onClick={handlePreviousWeek}>Previous</button>
        <p>{currentDate.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}</p>
        <button onClick={handleNextWeek}>Next</button>
      </div>
      <div className='timezone'>
        <select value={timezone} onChange={handleTimezoneChange}>
          {['[UTC-5] Eastern Standard Time', '[UTC-0] Coordinated Universal Time'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="calendar">
        {renderTimeSlots()}
      </div>
      <div>
        {appointments.map(({ Id, Date, Time }) => (
          <p key={Id}>{`Id: ${Id}, Date: ${Date}, Time: ${Time}`}</p>
        ))}
      </div>
    </div>
  );
};

export default WorkingHour;
