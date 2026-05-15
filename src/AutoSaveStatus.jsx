import React from 'react';
import { Icon } from './IconSystem.jsx';

export const AutoSaveStatus = ({ palette, t, lastSave, isSaving }) => {
  const getTimeSince = (date) => {
    if (!date) return t('common.never');
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 10) return t('common.justNow');
    if (seconds < 60) return t('common.agoSeconds', { value: seconds });

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t('common.agoMinutes', { value: minutes });

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('common.agoHours', { value: hours });

    const days = Math.floor(hours / 24);
    return t('common.agoDays', { value: days });
  };

  return React.createElement('div', {
    'aria-live': 'polite',
    'aria-atomic': 'true',
    style: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '12px 16px',
      background: isSaving ? palette.gold : lastSave ? palette.sage : palette.mid,
      color: isSaving ? '#000' : lastSave ? '#000' : '#fff',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 100,
      animation: 'slideIn 0.3s'
    }
  },
    React.createElement('span', null,
      isSaving ? React.createElement(Icon, { name: 'recurring', size: 14 }) : lastSave ? React.createElement(Icon, { name: 'check', size: 14 }) : React.createElement(Icon, { name: 'info', size: 14 })
    ),
    React.createElement('span', null,
      isSaving ? t('common.saving') : lastSave ? t('common.saved') + ' ' + getTimeSince(lastSave) : t('common.notSaved')
    )
  );
};

export default AutoSaveStatus;
