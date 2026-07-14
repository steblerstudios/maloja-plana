import React from 'react';
import { text, weight, space, radius, fontFamily } from './config/tokens.js';

export const JobManager = ({ palette, t, jobs, onChange }) => {
  const list = Array.isArray(jobs) ? jobs : [];

  const addJob = () => onChange([...list, { employer: '', jobTitle: '', pensum: '', period: '' }]);
  const updateJob = (idx, patch) => onChange(list.map((d, i) => i === idx ? { ...d, ...patch } : d));
  const removeJob = (idx) => onChange(list.filter((_, i) => i !== idx));

  const inputStyle = {
    width: '100%', padding: (space.sm + 2) + 'px ' + space.sm + 'px',
    borderRadius: radius.sm, border: '1px solid ' + palette.border,
    background: palette.up, color: palette.text, boxSizing: 'border-box',
    fontSize: text.sm, fontFamily, cursor: 'text',
  };
  const labelStyle = {
    display: 'block', fontSize: text.xs, fontWeight: weight.medium,
    color: palette.mid, marginBottom: space.xs,
  };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.md } },
    list.length > 0 && list.map((job, idx) =>
      React.createElement('div', {
        key: idx,
        style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border }
      },
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm }
        },
          React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
            job.employer || t('jobs.label', { nr: idx + 1 })),
          React.createElement('button', {
            onClick: () => removeJob(idx),
            'aria-label': t('common.delete') || 'Entfernen',
            style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: text.sm, fontFamily, padding: '6px 8px', minHeight: '24px' }
          }, '✕')
        ),
        React.createElement('div', { style: { marginBottom: space.sm } },
          React.createElement('label', { style: labelStyle }, t('jobs.employer')),
          React.createElement('input', {
            type: 'text', value: job.employer || '',
            onChange: (e) => updateJob(idx, { employer: e.target.value }),
            placeholder: t('jobs.employerPlaceholder'),
            'aria-label': t('jobs.employer'),
            style: inputStyle,
          })
        ),
        React.createElement('div', { style: { marginBottom: space.sm } },
          React.createElement('label', { style: labelStyle }, t('jobs.jobTitle')),
          React.createElement('input', {
            type: 'text', value: job.jobTitle || '',
            onChange: (e) => updateJob(idx, { jobTitle: e.target.value }),
            placeholder: t('jobs.jobTitlePlaceholder'),
            'aria-label': t('jobs.jobTitle'),
            style: inputStyle,
          })
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '110px 1fr', gap: space.sm } },
          React.createElement('div', null,
            React.createElement('label', { style: labelStyle }, t('jobs.pensum')),
            React.createElement('input', {
              type: 'text', inputMode: 'numeric', value: job.pensum || '',
              onChange: (e) => updateJob(idx, { pensum: e.target.value }),
              placeholder: '80%',
              'aria-label': t('jobs.pensum'),
              style: inputStyle,
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { style: labelStyle }, t('jobs.period')),
            React.createElement('input', {
              type: 'text', value: job.period || '',
              onChange: (e) => updateJob(idx, { period: e.target.value }),
              placeholder: t('jobs.periodPlaceholder'),
              'aria-label': t('jobs.period'),
              style: inputStyle,
            })
          )
        )
      )
    ),
    React.createElement('button', {
      onClick: addJob,
      style: {
        padding: space.sm + 'px ' + space.md + 'px',
        background: 'transparent', color: palette.mid,
        border: '1px dashed ' + palette.border, borderRadius: radius.sm,
        cursor: 'pointer', fontSize: text.sm, fontFamily,
        fontWeight: weight.medium, alignSelf: 'flex-start',
      }
    }, '+ ' + t('jobs.add'))
  );
};

export default JobManager;
