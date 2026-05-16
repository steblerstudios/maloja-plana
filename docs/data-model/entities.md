# Data Model Entities

## Purpose

This document defines the conceptual entities of Maloja Plana before they become code.

The current app is local-first and does not use a backend.

These entities are planning concepts for future data structure, migrations and cross-domain logic.

## Core Entities

### Person
Represents an individual human being.

Possible fields:
- id
- fullName
- birthDate
- ahvNumber
- nationality
- residencePermit
- canton
- municipality
- residenceType
- languagePreference

### Household
Represents a living and financial unit.

Possible fields:
- id
- members
- numberOfAdults
- numberOfChildren
- address
- canton
- municipality
- residenceType
- weeklyResident

### Document
Represents a stored or tracked document.

Possible fields:
- id
- title
- category
- ownerPersonId
- householdId
- issueDate
- expiryDate
- canton
- municipality
- sensitivityLevel
- storageLocation

### Reminder
Represents a deadline, appointment or recurring task.

Possible fields:
- id
- title
- category
- date
- recurrence
- linkedDocumentId
- linkedPersonId
- linkedHouseholdId
- status

### Insurance
Represents a coverage relationship.

Possible fields:
- id
- type
- provider
- policyNumber
- insuredPersonId
- householdId
- startDate
- endDate
- premium
- canton
- notes

### Income
Represents income or benefit sources.

Possible fields:
- id
- personId
- householdId
- type
- amount
- frequency
- grossOrNet
- employer
- canton
- notes

### Authority
Represents a relevant public office or institutional contact.

Possible fields:
- id
- name
- type
- canton
- municipality
- contactDetails
- relatedDocuments
- relatedReminders

## Important Principle

Entities should not be duplicated unnecessarily.

Sensitive identifiers such as AHV number should have one clear source of truth.
