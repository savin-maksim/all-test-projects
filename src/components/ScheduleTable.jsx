// src/components/ScheduleTable.jsx
import React from 'react';

const ScheduleTable = ({ names, days, times }) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>День недели</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Время</th>
                        {names.map((name, index) => (
                            <th key={index} style={{ border: '1px solid black', padding: '8px', minWidth: '200px' }}>
                                {name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map((day, dayIndex) => (
                        <React.Fragment key={dayIndex}>
                            {times.map((time, timeIndex) => (
                                <tr key={timeIndex}>
                                    {timeIndex === 0 && (
                                        <td rowSpan={times.length} style={{ 
                                            border: '1px solid black', 
                                            padding: '8px', 
                                            fontWeight: 'bold', 
                                            textAlign: 'center', 
                                            writingMode: 'vertical-rl', 
                                            transform: 'rotate(-180deg)'
                                        }}>
                                            {day}
                                        </td>
                                    )}
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{time}</td>
                                    {names.map((name, nameIndex) => (
                                        <td key={nameIndex} style={{ border: '1px solid black', padding: '0', height: '80px' }}>
                                            <div style={{ display: 'flex', height: '25%', borderBottom: '1px solid black' }}>
                                                <div style={{ width: '50%', backgroundColor: 'white', borderRight: '1px solid black' }}></div>
                                                <div style={{ width: '50%', backgroundColor: 'white' }}></div>
                                            </div>
                                            <div style={{ height: '25%', backgroundColor: 'white' }}></div>
                                            <div style={{ display: 'flex', height: '25%', borderBottom: '1px solid black' }}>
                                                <div style={{ width: '50%', backgroundColor: 'green', borderRight: '1px solid black' }}></div>
                                                <div style={{ width: '50%', backgroundColor: 'green' }}></div>
                                            </div>
                                            <div style={{ height: '25%', backgroundColor: 'green' }}></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleTable;
