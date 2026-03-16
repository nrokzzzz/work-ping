import { useState, useEffect } from 'react'
import { Card, CardBody, Row, Col } from 'react-bootstrap'
import axiosClient from '@/helpers/httpClient'

const ViewHolidays = () => {
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchHolidays()
  }, [])

  const fetchHolidays = async () => {
    setLoading(true)
    try {
      const res = await axiosClient.get('/api/admin/holiday/get-holidays', { silent: true })
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
            <h5 className="mb-0">Holidays</h5>
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
