import { useState } from 'react'
import { Button, Form, Card } from 'react-bootstrap'

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
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75"
        style={{ backdropFilter: 'blur(4px)', zIndex: 99999 }}
      />
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ zIndex: 100000 }}
      >
        <Card
          className="text-center shadow-lg border-0"
          style={{ width: 420, backgroundColor: '#1f2933', color: '#e5e7eb' }}
        >
          <Card.Body className="p-4">
            <div className="mb-3">
              <div
                className="mx-auto d-flex align-items-center justify-content-center rounded-circle border border-success"
                style={{ width: 60, height: 60 }}
              >
                <span style={{ fontSize: 26 }}>🔐</span>
              </div>
            </div>

            <h4 className="mb-2">Two-factor authentication</h4>

            <p className="text-secondary small mb-4">
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
              className="text-center mb-4"
              style={{
                height: 44,
                backgroundColor: '#111827',
                border: '1px solid #374151',
                color: '#fff',
                fontSize: 18,
                letterSpacing: 6,
              }}
            />

            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="secondary"
                onClick={() => window.history.back()}
                className="px-4"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={code.length !== 6}
                onClick={handleVerify}
                className="px-4"
              >
                Verify
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default TwoFactorAuthPage
