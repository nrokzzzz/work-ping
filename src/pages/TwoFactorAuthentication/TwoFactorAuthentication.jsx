import { useState, useEffect, useRef } from 'react'
import { Button, Form, Card, Spinner } from 'react-bootstrap'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import axiosClient from '@/helpers/httpClient'
import { use2FA } from '@/context/useVerification2FA'
const TwoFactorAuthModal = ({ onSuccess, onCancel }) => {
  const {setShowModal} = use2FA()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleVerify = async () => {
    if (code.length !== 6 || loading) return

    try {
      setLoading(true)
      setError('')

      const res = await axiosClient.post('/api/auth/verify-2fa', { code })

      if (!isMounted.current) return

      if (res?.data?.success === true) {
        onSuccess(true)
      } else {
        setError('Invalid verification code')
      }
    } catch (err) {
      if (!isMounted.current) return
      setError('Verification failed. Please try again.')
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    if (loading) return
    onCancel(false)
    
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleVerify()
    }
  }

  useEffect(() => {
    if (code.length === 6) {
      handleVerify()
    }
  }, [code])

  return (
    <ComponentContainerCard>
      {/* Background Overlay */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 99999 }}
        onClick={handleCancel}
      />

      {/* Modal */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ zIndex: 100000 }}
      >
        <Card
          className="text-center shadow-lg border-0"
          style={{ width: 420, borderRadius: 16 }}
        >
          <Card.Body className="p-4">
            <div className="mb-3">
              <div
                className="mx-auto d-flex align-items-center justify-content-center rounded-circle border border-primary"
                style={{ width: 60, height: 60 }}
              >
                <span style={{ fontSize: 26 }}>🔐</span>
              </div>
            </div>

            <h4 className="mb-2">Two-Factor Authentication</h4>

            <p className="text-muted small mb-4">
              Enter the 6-digit code from your authenticator app.
            </p>

            <Form.Control
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              onKeyDown={handleKeyDown}
              placeholder="XXXXXX"
              autoFocus
              className="text-center mb-3"
              style={{
                height: 48,
                fontSize: 20,
                letterSpacing: 8,
                fontWeight: 500
              }}
            />

            {error && (
              <div className="text-danger small mb-3">
                {error}
              </div>
            )}

            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="outline-secondary"
                onClick={handleCancel}
                disabled={loading}
                className="px-4"
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                disabled={code.length !== 6 || loading}
                onClick={handleVerify}
                className="px-4"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </ComponentContainerCard>
  )
}

export default TwoFactorAuthModal