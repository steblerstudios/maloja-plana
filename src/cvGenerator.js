// CV/Resume Generator for Switzerland — i18n-aware
import { getFullName } from './config/constants.js';

export const generateCVTemplate = (data, t) => {
  return {
    header: {
      name: getFullName(data.basis) || (t ? t('cv.name') : 'Name'),
      phone: data.basis?.phone || '',
      email: data.basis?.email || '',
      address: data.wohnen?.address || '',
      city: (data.wohnen?.postalCode || '') + ' ' + (data.wohnen?.city || '')
    },
    personal: {
      dateOfBirth: data.basis?.dateOfBirth || '',
      nationality: data.basis?.nationality || '',
      maritalStatus: data.basis?.maritalStatus || ''
    },
    experience: {
      current: {
        title: data.ausbildung?.jobTitle || '',
        company: data.ausbildung?.employer || '',
        startDate: data.ausbildung?.employmentStart || '',
        description: t ? t('cv.taskDescription') : 'Tasks and responsibilities'
      },
      previous: (Array.isArray(data.additionalJobs) ? data.additionalJobs : []).map(j => ({
        title: j.jobTitle || '',
        company: j.employer || '',
        period: j.period || '',
        pensum: j.pensum || ''
      }))
    },
    education: {
      highest: data.ausbildung?.educationLevel || '',
      school: data.ausbildung?.schoolName || '',
      efz: data.ausbildung?.efzNumber || '',
      certifications: data.ausbildung?.certifications || ''
    },
    languages: {
      list: data.ausbildung?.languages || ''
    },
    skills: {
      technical: [],
      soft: []
    },
    references: {
      available: true,
      note: t ? t('cv.referencesNote') : 'References available on request'
    }
  };
};


export const generateCVHTML = (cvData, t) => {
  const labelPersonal = t ? t('cv.personalData') : 'PERSONAL DATA';
  const labelExperience = t ? t('cv.experience') : 'WORK EXPERIENCE';
  const labelEducation = t ? t('cv.education') : 'EDUCATION AND QUALIFICATIONS';
  const labelLanguages = t ? t('cv.languages') : 'LANGUAGES';
  const labelReferences = t ? t('cv.references') : 'REFERENCES';
  const labelNoJob = t ? t('cv.noCurrentJob') : 'No current employment';
  const labelDob = t ? t('cv.labelDob') : 'Date of birth';
  const labelNationality = t ? t('cv.labelNationality') : 'Nationality';
  const labelMaritalStatus = t ? t('cv.labelMaritalStatus') : 'Marital status';
  const labelHighest = t ? t('cv.labelHighest') : 'Highest qualification';
  const labelSchool = t ? t('cv.labelSchool') : 'School/University';
  const labelEfz = t ? t('cv.labelEfz') : 'EFZ/Designation';
  const labelCerts = t ? t('cv.labelCerts') : 'Other certificates';
  const labelSince = t ? t('cv.labelSince') : 'since';
  const createdWith = t ? t('cv.createdWith') : 'This document was created with Maloja Plana.';
  const cvTitle = t ? t('cv.cvTitle') : 'CV';

  return `
<!DOCTYPE html>
<html lang="de-CH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cvTitle} - ${cvData.header.name}</title>
  <style>
    body { font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: #fff; color: #333; line-height: 1.6; }
    .header { margin-bottom: 30px; }
    h1 { margin: 0; font-size: 24px; font-weight: bold; }
    .contact { margin-top: 8px; font-size: 13px; color: #666; }
    .contact-item { display: inline-block; margin-right: 20px; }
    h2 { margin-top: 25px; margin-bottom: 12px; font-size: 14px; font-weight: bold; border-bottom: 2px solid #2f6b3f; padding-bottom: 4px; }
    .section { margin-bottom: 20px; }
    .entry { margin-bottom: 15px; }
    .entry-title { font-weight: bold; margin-bottom: 4px; }
    .entry-subtitle { font-style: italic; color: #666; font-size: 13px; margin-bottom: 4px; }
    .entry-text { margin-top: 6px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${cvData.header.name}</h1>
    <div class="contact">
      <div class="contact-item">○ ${cvData.header.phone}</div>
      <div class="contact-item">○ ${cvData.header.email}</div>
    </div>
    <div class="contact" style="margin-top: 4px;">
      <div class="contact-item">○ ${cvData.header.address}</div>
      <div class="contact-item">${cvData.header.city}</div>
    </div>
  </div>

  <div class="section">
    <h2>${labelPersonal}</h2>
    <div class="entry-text">
      <strong>${labelDob}:</strong> ${cvData.personal.dateOfBirth}<br>
      <strong>${labelNationality}:</strong> ${cvData.personal.nationality}<br>
      <strong>${labelMaritalStatus}:</strong> ${cvData.personal.maritalStatus}
    </div>
  </div>

  <div class="section">
    <h2>${labelExperience}</h2>
    ${cvData.experience.current.title ? `
    <div class="entry">
      <div class="entry-title">${cvData.experience.current.title}</div>
      <div class="entry-subtitle">${cvData.experience.current.company} | ${labelSince} ${cvData.experience.current.startDate}</div>
      <div class="entry-text">${cvData.experience.current.description}</div>
    </div>
    ` : ''}
    ${(cvData.experience.previous || []).map(job => `
    <div class="entry">
      <div class="entry-title">${job.title || ''}</div>
      <div class="entry-subtitle">${job.company || ''}${job.period ? ' | ' + job.period : ''}${job.pensum ? ' · ' + job.pensum : ''}</div>
    </div>`).join('')}
    ${(!cvData.experience.current.title && (cvData.experience.previous || []).length === 0) ? '<p>' + labelNoJob + '</p>' : ''}
  </div>

  <div class="section">
    <h2>${labelEducation}</h2>
    <div class="entry-text">
      <strong>${labelHighest}:</strong> ${cvData.education.highest}<br>
      <strong>${labelSchool}:</strong> ${cvData.education.school}
      ${cvData.education.efz ? `<br><strong>${labelEfz}:</strong> ${cvData.education.efz}` : ''}
      ${cvData.education.certifications ? `<br><strong>${labelCerts}:</strong><br>${cvData.education.certifications}` : ''}
    </div>
  </div>

  <div class="section">
    <h2>${labelLanguages}</h2>
    <div class="entry-text">${cvData.languages.list}</div>
  </div>

  <div class="section">
    <h2>${labelReferences}</h2>
    <div class="entry-text">${cvData.references.note}</div>
  </div>

  <hr style="margin-top: 40px; border: none; border-top: 1px solid #ddd;">
  <p style="font-size: 11px; color: #999; margin-top: 20px;">
    ${createdWith} • ${new Date().toLocaleDateString('de-CH')}
  </p>
</body>
</html>
`;
};

export const downloadCVAsHTML = (cvData, t) => {
  const html = generateCVHTML(cvData, t);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const cvLabel = t ? t('cv.cvTitle') : 'CV';
  link.setAttribute('href', url);
  link.setAttribute('download', `${cvLabel}_${cvData.header.name.replace(/\s/g, '_')}.html`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// JSON Resume (jsonresume.org) — maschinenlesbarer, ATS-tauglicher Standard.
// Bewusst ohne Geburtsdatum/Zivilstand (Datensparsamkeit + anti-diskriminierend).
export const generateJSONResume = (data, t) => {
  const b = data.basis || {};
  const w = data.wohnen || {};
  const a = data.ausbildung || {};
  const languages = (a.languages || '')
    .split(/[,;\n]/).map(s => s.trim()).filter(Boolean)
    .map(language => ({ language }));
  const work = [];
  if (a.jobTitle || a.employer) {
    work.push({ name: a.employer || '', position: a.jobTitle || '', startDate: a.employmentStart || '' });
  }
  (Array.isArray(data.additionalJobs) ? data.additionalJobs : []).forEach(j => {
    if (j.employer || j.jobTitle) {
      work.push({ name: j.employer || '', position: j.jobTitle || '', summary: [j.pensum, j.period].filter(Boolean).join(' · ') });
    }
  });
  const education = (a.schoolName || a.educationLevel) ? [{
    institution: a.schoolName || '',
    studyType: a.educationLevel || '',
    area: a.certifications || '',
  }] : [];
  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: getFullName(b) || '',
      label: a.jobTitle || '',
      email: b.email || '',
      phone: b.phone || '',
      location: {
        address: w.address || '',
        postalCode: w.postalCode || '',
        city: w.city || '',
        region: b.canton || '',
        countryCode: 'CH',
      },
    },
    work,
    education,
    languages,
    meta: {
      generator: 'Maloja Plana',
      version: 'v1.0.0',
      lastModified: new Date().toISOString(),
    },
  };
};

export const downloadCVAsJSON = (data, t) => {
  const resume = generateJSONResume(data, t);
  const json = JSON.stringify(resume, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const cvLabel = t ? t('cv.cvTitle') : 'CV';
  const name = (resume.basics.name || 'CV').replace(/\s/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `${cvLabel}_${name}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
