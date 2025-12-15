import React from 'react'

export const DashboardIcon: React.FC<{className?:string}> = ({className}) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.85"/>
    <rect x="13" y="3" width="8" height="5" rx="2" fill="currentColor" opacity="0.6"/>
    <rect x="13" y="10" width="8" height="11" rx="2" fill="currentColor" opacity="0.4"/>
  </svg>
)

export const ExpensesIcon: React.FC<{className?:string}> = ({className}) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 7h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 11h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 15h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const AnalyticsIcon: React.FC<{className?:string}> = ({className}) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 12h3v6H3zM10.5 8h3v10h-3zM18 4h3v14h-3z" fill="currentColor" />
  </svg>
)

export const SettingsIcon: React.FC<{className?:string}> = ({className}) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" fill="currentColor"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.28 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.65 0 1.19-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.31 6.28A2 2 0 1 1 7.14 3.45l.06.06a1.65 1.65 0 0 0 1.82.33h.08c.42-.24.9-.37 1.4-.37.5 0 .98.13 1.4.37h.08c.7.34 1.5-.10 1.82-.33l.06-.06A2 2 0 1 1 20 6.28l-.06.06c-.24.42-.37.9-.37 1.4 0 .5.13.98.37 1.4.22.5.7.94 1.4.33l.06-.06A2 2 0 1 1 19.4 15z" fill="currentColor" opacity="0.6"/>
  </svg>
)

export const EditIcon: React.FC<{className?:string}> = ({className}) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
    <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="currentColor" opacity="0.9"/>
  </svg>
)

export const DeleteIcon: React.FC<{className?:string}> = ({className}) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M6 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
)

export const LoginIcon: React.FC<{className?:string}> = ({className}) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 12H3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default {}
