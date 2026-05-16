# Data Model Relationships

## Purpose

This document describes how future entities may relate to each other.

These relationships support the Life Web / Spinnennetz concept.

## Person Relationships

A person can:
- belong to one or more households
- own documents
- have reminders
- have insurance policies
- receive income
- be linked to authorities
- be an emergency contact

## Household Relationships

A household can:
- contain multiple persons
- have one address
- belong to one canton and municipality
- have shared documents
- have shared budget logic
- have shared reminders
- have benefit eligibility questions

## Document Relationships

A document can:
- belong to a person
- belong to a household
- be linked to a reminder
- be required for an application
- have an expiry date
- have a sensitivity level
- depend on canton or municipality

## Reminder Relationships

A reminder can:
- be linked to a document
- be linked to a person
- be linked to a household
- be linked to a canton-specific rule
- recur over time
- trigger a checklist later

## Canton Relationships

A canton can influence:
- tax logic
- premium subsidy logic
- social assistance guidance
- rent support
- school systems
- municipality requirements
- document templates

## Cross-Domain Example

Change of address:
- updates municipality
- may update canton
- may affect tax canton
- may affect premium subsidy
- may affect social assistance guidance
- may affect school and childcare
- may create new reminders
- may require document updates

## Rule

Relationships should support calm guidance, not automatic legal conclusions.
