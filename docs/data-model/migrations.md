# Data Model Migrations

## Purpose

Maloja Plana is local-first.

Data migrations must protect user data and avoid destructive changes.

## Rules

- Never delete localStorage keys without migration.
- Never delete IndexedDB databases automatically.
- Every schema change needs a version number.
- Every migration should create a pre-migration snapshot.
- Migration failures must leave existing data usable.
- Users should never lose documents silently.
- High-risk migrations require alpha testing first.

## Migration Types

### Additive Migration
Adds new optional fields.

Risk:
Low

Example:
- add residenceType
- add householdId
- add sensitivityLevel

### Structural Migration
Moves data from one shape to another.

Risk:
Medium to high

Example:
- single person model to household model
- flat insurance fields to insurance entities

### Sensitive Migration
Changes how sensitive data is stored or encrypted.

Risk:
High

Example:
- moving AHV number
- encrypting medical data
- changing backup format

## Snapshot Strategy

Before migration:
- copy current data
- store timestamp
- store source version
- store target version

After migration:
- validate data shape
- preserve rollback possibility
- notify user only if intervention is needed

## Important Principle

Migrations must be boring, reversible where possible, and calm.
