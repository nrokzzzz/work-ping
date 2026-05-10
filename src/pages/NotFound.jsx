import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '80vh' }}>
      <h1 className="display-1 fw-bold text-primary mb-0" style={{ fontSize: '8rem' }}>
        404
      </h1>
      <h4 className="mb-2">Page Not Found</h4>
      <p className="text-muted mb-4" style={{ maxWidth: 400 }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/dashboard/analytics">
        <Button variant="primary" className="d-inline-flex align-items-center gap-1">
          <IconifyIcon icon="mdi:home" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
