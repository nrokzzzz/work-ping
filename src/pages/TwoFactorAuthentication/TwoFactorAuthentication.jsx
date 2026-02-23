import { useState } from 'react'
import { Button, Form, Card } from 'react-bootstrap'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import axiosClient from '@/helpers/httpClient'

const TwoFactorAuthModal = ({ onSuccess, onCancel }) => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async () => {
    if (code.length !== 6) return

    try {
      setLoading(true)
      setError('')

      const res = await axiosClient.post('/api/auth/verify-2fa', { code })

      if (res.data?.success) {
        onSuccess() 
      } else {
        setError('Invalid code')
      }
    } catch (err) {
      console.error(err)
      setError('Verification failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ComponentContainerCard>
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-body-secondary bg-opacity-75"
          style={{ backdropFilter: 'blur(0px)', zIndex: 99999 }}
        />
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 100000 }}
        >
          <Card className="text-center shadow-lg border-0 bg-body text-body" style={{ width: 420 }}>
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

              <p className="text-body-secondary small mb-4">
                Enter the 6-digit code from your authenticator app.
              </p>

              <Form.Control
                value={code}
                onChange={e =>
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="XXXXXX"
                autoFocus
                className="text-center mb-3 bg-body text-body border-secondary"
                style={{
                  height: 44,
                  fontSize: 18,
                  letterSpacing: 6,
                }}
              />

              {error && (
                <div className="text-danger small mb-3">{error}</div>
              )}

              <div className="d-flex justify-content-center gap-3">
                <Button
                  variant="secondary"
                  onClick={()=>window.history.back()}  
                  className="px-4"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={code.length !== 6 || loading}
                  onClick={handleVerify}
                  className="px-4"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </ComponentContainerCard>
    </>
  )
}

export default TwoFactorAuthModal