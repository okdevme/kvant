import type { ReactNode } from 'react'

interface GenerateProps {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  primaryColor?: string
  primaryTextColor?: string
  site?: ReactNode
  before?: ReactNode
}

export function generate({
  primaryColor = 'rgba(255,150,255,0.3)',
  primaryTextColor = 'rgb(255,150,255)',
  icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-book-icon lucide-book"
    >
      <circle cx="12" cy="12" r="11" stroke={primaryTextColor} strokeWidth="2" />
    </svg>
  ),
  ...props
}: GenerateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        padding: '4rem',
        backgroundColor: '#0c0c0c',
        borderBottom: `18px solid ${primaryColor}`,
      }}
    >
      {props.before && (
        <p
          style={{
            fontSize: '32px',
            fontWeight: 600,
            margin: 0,
            marginBottom: '12px',
          }}
        >
          {props.before}
        </p>
      )}
      <p
        style={{
          fontWeight: 800,
          fontSize: '82px',
          margin: 0,
        }}
      >
        {props.title}
      </p>
      <p
        style={{
          fontSize: '52px',
          color: 'rgba(240,240,240,0.8)',
          margin: 0,
          marginTop: '16px',
          paddingBottom: '28px',
          borderBottom: `8px dashed rgba(240,240,240,0.8)`,
        }}
      >
        {props.description}
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '20px',
          marginTop: 'auto',
          color: primaryTextColor,
        }}
      >
        {icon}
        {props.site && (
          <p
            style={{
              fontSize: '56px',
              fontWeight: 600,
              margin: 0,
            }}
          >
            {props.site}
          </p>
        )}
      </div>
    </div>
  )
}
