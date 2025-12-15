import React from 'react'

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => {
  return <div className={`card-panel ${className}`}>{children}</div>
}

export default Card
