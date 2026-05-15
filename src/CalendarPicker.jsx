import React, { useState } from 'react';

export const CalendarPicker = ({ palette, value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(value || new Date()));

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSelectDay = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formatted = selected.toISOString().split('T')[0];
    onChange(formatted);
    setShowCalendar(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('de-CH', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return React.createElement('div', { style: { position: 'relative' } },
    React.createElement('div', { style: { display: 'flex', gap: '6px', alignItems: 'center' } },
      React.createElement('input', {
        type: 'text',
        value: formatDate(value),
        readOnly: true,
        onClick: () => setShowCalendar(!showCalendar),
        placeholder: 'TT.MM.YYYY',
        style: {
          flex: 1,
          padding: '10px 12px',
          borderRadius: '6px',
          border: '1px solid ' + palette.border,
          background: palette.up,
          color: palette.text,
          boxSizing: 'border-box',
          fontSize: '13px',
          cursor: 'pointer'
        }
      }),
      React.createElement('button', {
        onClick: () => setShowCalendar(!showCalendar),
        style: {
          padding: '10px 12px',
          background: palette.gold,
          color: '#000',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px'
        }
      }, '○')
    ),

    showCalendar && React.createElement('div', {
      style: {
        position: 'absolute',
        top: '100%',
        left: 0,
        marginTop: '8px',
        background: palette.surface,
        border: '1px solid ' + palette.border,
        borderRadius: '8px',
        padding: '12px',
        minWidth: '280px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000
      }
    },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' } },
        React.createElement('button', {
          onClick: handlePrevMonth,
          style: { background: 'none', border: 'none', color: palette.text, cursor: 'pointer', fontSize: '16px', fontWeight: '600' }
        }, '◀'),
        React.createElement('div', { style: { fontWeight: '600', fontSize: '13px' } },
          monthNames[currentMonth.getMonth()] + ' ' + currentMonth.getFullYear()
        ),
        React.createElement('button', {
          onClick: handleNextMonth,
          style: { background: 'none', border: 'none', color: palette.text, cursor: 'pointer', fontSize: '16px', fontWeight: '600' }
        }, '▶')
      ),

      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' } },
        dayNames.map(day => React.createElement('div', {
          key: day,
          style: { textAlign: 'center', fontSize: '11px', fontWeight: '600', color: palette.mid, padding: '4px' }
        }, day))
      ),

      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' } },
        days.map((day, idx) => {
          const isToday = day && new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString() === new Date().toDateString();
          const isSelected = day && value === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];

          return React.createElement('button', {
            key: idx,
            onClick: () => day && handleSelectDay(day),
            disabled: !day,
            style: {
              padding: '6px 0',
              background: isSelected ? palette.gold : isToday ? palette.up : 'transparent',
              color: isSelected ? '#000' : isToday ? palette.text : palette.mid,
              border: 'none',
              borderRadius: '4px',
              cursor: day ? 'pointer' : 'default',
              fontSize: '12px',
              fontWeight: isSelected ? '600' : '400',
              opacity: day ? 1 : 0.3
            }
          }, day);
        })
      )
    )
  );
};

export default CalendarPicker;
