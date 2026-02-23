import { useEffect, useState, useRef } from 'react'
import { Button, Card, Spinner } from 'react-bootstrap'
import axiosClient from '@/helpers/httpClient'

const QRAuthModal = () => {
  const [status, setStatus] = useState('Creating QR session...')
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const pollRef = useRef(null)
  const [qrCode,setQrCode]=useState(null)
  useEffect(() => {
    const qrPage = async()=>{
      try{
        const res=await axiosClient.post('/api/auth/2fa/setup');
        setQrCode(res.data.qrCode)
      }catch(error){
        console.log(error)
      }
    }
    qrPage()
    createQRSession()
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current)
    }
  }, [])

  const CREATE_QR_URL = 'http://localhost:3000/api/auth/qr-session'
  const CHECK_STATUS_URL = 'http://localhost:3000/api/auth/qr-status'

  const createQRSession = async () => {
    try {
      setLoading(true)
      setStatus('Creating QR session...')
      setqrCode(qrCode)

      const res = await fetch(CREATE_QR_URL)
      if (!res.ok) throw new Error('HTTP error ' + res.status)

      const data = await res.json()
      console.log('Response from backend:', data)
      setToken(data.token)

      setStatus('Waiting for scan...')
      setLoading(false)

      checkStatus(data.token)
    } catch (err) {
      console.error('Error creating QR session:', err)
      setStatus('Failed to create QR session')
      setLoading(false)
    }
  }

  const checkStatus = async (tk) => {
    try {
      const res = await fetch(`${CHECK_STATUS_URL}?token=${tk}`)
      const data = await res.json()
      console.log('Status:', data)

      if (data.status === 'pending') {
        pollRef.current = setTimeout(() => checkStatus(tk), 2000)
      } else if (data.status === 'approved') {
        setStatus('Logged in! User ID: ' + data.userId)
      } else if (data.status === 'expired') {
        setStatus('QR expired. Click Refresh.')
      } else {
        setStatus('Invalid QR session')
      }
    } catch (err) {
      console.error('Error checking status:', err)
      setStatus('Error checking status')
    }
  }

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-body-secondary bg-opacity-75"
        style={{ backdropFilter: 'blur(4px)', zIndex: 99999 }}
      />
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ zIndex: 100000 }}
      >
        <Card className="text-center shadow-lg border-0 bg-body text-body" style={{ width: 420 }}>
          <Card.Body className="p-4">
            <div className="mb-3">
              <div
                className="mx-auto d-flex align-items-center justify-content-center rounded-circle border border-secondary"
                style={{ width: 64, height: 64 }}
              >
                <span style={{ fontSize: 32 }}>🔐</span>
              </div>
            </div>

            <h4 className="mb-2">Scan QR to Login</h4>

            <p className="small mb-3 text-body-secondary">
              Open your mobile app and scan this QR code to continue.
            </p>

            <div
              className="d-flex align-items-center justify-content-center mb-3 bg-body-secondary rounded border"
              style={{ minHeight: 220 }}
            >
              {loading ? (
                <Spinner animation="border" />
              ) : qrCode ? (
                <img src={qrCode} alt="QR Code" />
              ) : (
                <span className="text-body">Failed to load QR</span>
              )}
            </div>

            <p className="small mb-4 text-body-secondary">{status}</p>

            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="secondary"
                onClick={() => window.history.back()}
                className="px-4"
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={createQRSession} className="px-4">
                Refresh QR
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default QRAuthModal