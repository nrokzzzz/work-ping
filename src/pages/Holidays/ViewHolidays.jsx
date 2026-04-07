import { useState, useEffect } from 'react'
import { Card, CardBody, Row, Col } from 'react-bootstrap'
import axiosClient from '@/helpers/httpClient'

const ViewHolidays = () => {
  const [holidays, setHolidays] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [organizationId, setOrganizationId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOrganizations()
  }, [])

  useEffect(() => {
    if (organizationId) {
      fetchHolidays(organizationId)
    }
  }, [organizationId])

  const fetchOrganizations = async () => {
    try {
      const res = await axiosClient.get('/api/admin/organization/get-all-organization-ids', { silent: true })
      const orgs = res.data?.data || []
      setOrganizations(orgs)
      if (orgs.length > 0) {
        setOrganizationId(orgs[0].organizationId)
      }
    } catch {
      // interceptor handles error toast
    }
  }

  const fetchHolidays = async (orgId) => {
    if (!orgId) return

    setLoading(true)
    try {
      const res = await axiosClient.get('/api/admin/holiday/get-holidays', {
        params: { organizationId: orgId },
        silent: true,
      })
      setHolidays(res.data?.data || [])
    } catch {} finally {
      setLoading(false)
    }
  }

  return (
    <Row>
      <Col>
        <Card>
          <CardBody className="pb-0">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h5 className="mb-0">Holidays</h5>
              <div>
                <select
                  className="form-select form-select-sm"
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  style={{ minWidth: 220 }}
                >
                  {organizations.map((org) => (
                    <option key={org.organizationId} value={org.organizationId}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardBody>

          <div className="table-responsive">
            <table className="table text-nowrap mb-0">
              <thead className="bg-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : holidays.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      No holidays found
                    </td>
                  </tr>
                ) : (
                  holidays.map((h, i) => (
                    <tr key={h._id}>
                      <td>{i + 1}</td>
                      <td>{h.name || '--'}</td>
                      <td>
                        <span className={`badge bg-${h.type === 'public' ? 'primary' : 'info'}`}>
                          {h.type || '--'}
                        </span>
                      </td>
                      <td>{h.date ? new Date(h.date).toLocaleDateString() : '--'}</td>
                      <td>{h.description || '--'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default ViewHolidays
