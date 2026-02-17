import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const TwoFactorAuthPage = () => {
  const [code, setCode] = useState('')

  const handleVerify = () => {
    if (code.length === 6) {
      console.log('OTP:', code)
    }
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(62, 62, 62, 0.79)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 99999,
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
        }}
      >
        <div
          style={{
            width: 420,
            background: '#1f2933',
            borderRadius: 10,
            padding: 32,
            textAlign: 'center',
            color: '#e5e7eb',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '1px solid #22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <span style={{ fontSize: 26 }}>🔐</span>
            </div>
          </div>

          <h4>Two-factor authentication</h4>

          <p
            style={{
              fontSize: 14,
              color: '#9ca3af',
              marginBottom: 20,
            }}
          >
            Enter the code from your two-factor authentication app or browser
            extension.
          </p>

          <Form.Control
            value={code}
            onChange={e =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder="XXXXXX"
            autoFocus
            style={{
              height: 44,
              background: '#111827',
              border: '1px solid #374151',
              color: '#fff',
              fontSize: 18,
              letterSpacing: 6,
              textAlign: 'center',
              marginBottom: 22,
            }}
          />

          <div className="d-flex justify-content-center gap-3">
              <Button
              variant="secondary"
              onClick={() => window.history.back()}
              style={{ minWidth: 120 }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={code.length !== 6}
              onClick={handleVerify}
              style={{ minWidth: 120 }}
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default TwoFactorAuthPage
