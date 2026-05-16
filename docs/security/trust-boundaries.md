# Trust Boundaries

## Purpose

This document defines where trust begins and ends inside Maloja Plana.

The application is designed as:
- local-first
- offline-first
- privacy-first
- calm by design

## Core Principle

User data belongs to the user.

The application should minimize:
- exposure
- synchronization
- duplication
- hidden processing
- background communication

## Primary Trust Boundary

The primary trust boundary is:

User Device ↔ Everything Outside

Inside the device:
- localStorage
- IndexedDB
- generated documents
- reminders
- cached assets

Outside the device:
- cloud systems
- analytics
- external APIs
- government systems
- third-party integrations

## Current Security Position

Current stable state:
- no accounts
- no server
- no cloud sync
- no telemetry
- no background uploads

This dramatically reduces attack surface.

## Sensitive Data Categories

### Highest Sensitivity
- AHV numbers
- medical information
- social assistance status
- migration/legal status
- financial hardship data
- insurance identifiers

### Medium Sensitivity
- addresses
- household structure
- employment data
- income information
- reminder timelines

### Lower Sensitivity
- language preference
- UI settings
- theme settings
- icon preferences

## Future Risk Areas

### Multi-Person Households
Risks:
- accidental visibility
- shared-device leakage
- cross-person exports

### Document Generation
Risks:
- unintended inclusion of hidden data
- metadata leakage
- export persistence

### QR Sharing
Risks:
- temporary exposure
- screenshot leakage
- stale transfer links

### PWA Features
Risks:
- notification previews
- background caching
- device persistence

## Security Philosophy

Maloja Plana should avoid:
- surveillance patterns
- addictive engagement
- opaque automation
- hidden AI decisions

The app should remain understandable.

## Important Principle

Security is not only encryption.

Security also means:
- predictability
- transparency
- reversibility
- user control
- low complexity
