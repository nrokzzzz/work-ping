import { useEffect, useState } from 'react'
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const TODO = () => {
  const navigate = useNavigate()
  const itemsPerPage = 10

  const [tasks, setTasks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchTasks = async (page, q) => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://192.168.29.97:5000/api/companies?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(q || '')}`
      )
      const result = await response.json()

      setTasks(result.data)
      setTotalPages(result.totalPages)
      setTotalRecords(result.totalRecords)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks(currentPage, search)
  }, [currentPage, search])

  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1)

    if (currentPage <= 2)
      return [1, 2, 3, '...', totalPages]

    if (currentPage >= totalPages - 1)
      return [1, '...', totalPages - 2, totalPages - 1, totalPages]

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  const start = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalRecords)

  return (
    <Row>
      <Col>
        <Card>

          
          <CardBody>
            <div className="d-flex justify-content-start">
              <div style={{ width: 300 }}>
                <div className="position-relative">
                  <IconifyIcon
                    icon="bx:search-alt"
                    className="position-absolute"
                    style={{
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 18,
                    }}
                  />
                  <input
                    type="search"
                    className="form-control ps-5"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => {
                      setCurrentPage(1)
                      setSearch(e.target.value)
                    }}
                  />
                </div>
              </div>
            </div>
          </CardBody>

          
          <div className="table-responsive table-centered">
            <table className="table text-nowrap mb-0">
              <thead className="bg-light bg-opacity-50">
                <tr>
                  <th>Name</th>
                  <th>Geo Fencing</th>
                  <th>CL Days</th>
                  <th>Type</th>
                  <th>IP Address</th>
                  <th>Founded At</th>
                  
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No records found
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.geoFencing}</td>
                      <td>{task.clDays}</td>
                      <td>{task.type}</td>
                      <td>{task.ipAddress}</td>
                      <td>{new Date(task.foundedAt).toDateString()}</td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          
          <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
            <div className="col-sm">
              <div className="text-muted">
                Showing {start} to {end} of {totalRecords} records
              </div>
            </div>

            <Col sm="auto">
              <ul className="pagination pagination-rounded m-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <Link
                    to="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                  >
                    <IconifyIcon icon="bx:left-arrow-alt" />
                  </Link>
                </li>

                {getPages().map((p, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === p ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}
                  >
                    <Link
                      to="#"
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault()
                        if (typeof p === 'number') setCurrentPage(p)
                      }}
                    >
                      {p}
                    </Link>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <Link
                    to="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                  >
                    <IconifyIcon icon="bx:right-arrow-alt" />
                  </Link>
                </li>
              </ul>
            </Col>
          </div>

        </Card>
      </Col>
    </Row>
  )
}

export default TODO
