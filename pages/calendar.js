import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleAddDemoEvent = () => {
    const newEvent = {
      id: Date.now(),
      title: '演示事件',
      date: new Date().toISOString(),
      color: '#3b82f6'
    };
    setEvents(prev => [...prev, newEvent]);
  };

  // 生成日历数据
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      calendarDays.push(date);
    }
    return calendarDays;
  };

  // 获取当天的事件
  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  // 月份名称
  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  // 星期名称
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">创意日历</h1>
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            上一月
          </button>
          <h2 className="text-xl font-medium text-gray-800">{currentYear}年 {monthNames[currentMonth]}</h2>
          <button 
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            下一月
          </button>
        </div>
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleAddDemoEvent}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            添加演示事件
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {dayNames.map(day => (
            <div key={day} className="py-3 text-center font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {generateCalendar().map((date, index) => {
            const dayEvents = getEventsForDay(date);
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div 
                key={index} 
                className={`min-h-[120px] p-2 border ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${isToday ? 'ring-2 ring-blue-500' : ''} hover:bg-gray-50`}
              >
                <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'font-bold' : ''}`}>
                  {date.getDate()}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.map((event, eventIndex) => (
                    <div 
                      key={eventIndex} 
                      className="text-xs p-1 rounded truncate" 
                      style={{ backgroundColor: event.color || '#e2e8f0' }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
