import React from 'react';
import { Impfausweis } from './impfausweis.jsx';
import { Karteikarten } from './karteikarten.jsx';
import { Wochenblister } from './wochenblister.jsx';
import { Fiebertagebuch } from './fiebertagebuch.jsx';

// Ein Baustein für die vier Fächer des Arztkoffers, damit main.jsx nur EINEN nachgeladenen Teil und eine
// Zeile braucht statt vier (Predeploy 23.11.2026: Startbündel lag mit der Gesundheits-Kette 49 B über 65 kB).
// `fach` ist der Name der Ansicht im Router (view): impfausweis · karteikarten · blister · fieber.
export const FAECHER = { impfausweis: Impfausweis, karteikarten: Karteikarten, blister: Wochenblister, fieber: Fiebertagebuch };

export const NotfallFach = ({ fach, ...props }) => {
  const Fach = FAECHER[fach];
  return Fach ? React.createElement(Fach, props) : null;
};
