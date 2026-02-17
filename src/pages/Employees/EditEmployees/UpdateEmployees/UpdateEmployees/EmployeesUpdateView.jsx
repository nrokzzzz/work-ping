import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const ViewEmployees = () => {
  const navigate = useNavigate()
  const itemsPerPage = 10

  const [employees, setEmployees] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const [fieldType, setFieldType] = useState('')
  const [fieldValues, setFieldValues] = useState([])
  const [selectedValue, setSelectedValue] = useState('')

  const [appliedField, setAppliedField] = useState('')
  const [appliedValue, setAppliedValue] = useState('')

  const fetchEmployees = async (page) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
      })

      if (appliedField && appliedValue) {
        params.append('field', appliedField)
        params.append('value', appliedValue)
      }

      const res = await fetch(
        `http://192.168.29.97:5000/api/employees?${params.toString()}`
      )
      const result = await res.json()
      setEmployees(result.data || [])
      setTotalPages(result.totalPages || 0)
      setTotalRecords(result.totalRecords || 0)
    } catch (e) {
      console.error('Error fetching employees:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees(currentPage)
  }, [currentPage, appliedField, appliedValue])

  const handleApply = () => {
    setAppliedField(fieldType)
    setAppliedValue(selectedValue)
    setCurrentPage(1)
  }

  const handleFieldSelect = async (type) => {
    if (!type) {
      setFieldValues([])
      setSelectedValue('')
      return
    }

    try {
      const res = await fetch(
        `http://192.168.29.97:5000/api/employees/fields/${type}`
      )
      const data = await res.json()
      setFieldValues(data)
      setSelectedValue('')
    } catch (e) {
      console.error('Field fetch error:', e)
    }
  }

  const handleUpdate = (id) => {
    navigate(`/employees/update-employees/${id}`)
  }

  const handleDelete = (id) => {
    console.log('Delete clicked:', id)
  }

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
            <Row className="g-2">

              <Col xs={12} md={4}>
                <div className="position-relative">
                  <IconifyIcon
                    icon="bx:search-alt"
                    className="position-absolute"
                    style={{ left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}
                  />
                  <input
                    type="search"
                    className="form-control ps-5"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </Col>

              <Col xs={12} md={3}>
                <select
                  className="form-select"
                  value={fieldType}
                  onChange={(e) => {
                    const v = e.target.value
                    setFieldType(v)
                    handleFieldSelect(v)
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="organization">Organization</option>
                  <option value="department">Department</option>
                </select>
              </Col>

              <Col xs={12} md={3}>
                <select
                  className="form-select"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                >
                  <option value="">Select Value</option>
                  {fieldValues.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </Col>

              <Col xs={12} md={2}>
                <Button className="w-100" onClick={handleApply}>
                  Apply
                </Button>
              </Col>

            </Row>
          </CardBody>

          <div className="table-responsive">
            <table className="table text-nowrap mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Action</th>
                  <th>User_id</th>
                  <th>Name</th>
                  <th>Gmail</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Organization</th>
                  <th>Department</th>
                  <th>Dob</th>
                  <th>Gender</th>
                  <th>Date of Joining</th>
                  <th>Salary</th>
                  <th>AADHAAR</th>
                  <th>PAN</th>
                  <th>Passport</th>
                  <th>BANK</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan="16" className="text-center py-4">Loading...</td></tr>
                ) : employees.length === 0 ? (
                  <tr><td colSpan="16" className="text-center py-4">No records found</td></tr>
                ) : (
                  employees.map(emp => (
                    <tr key={emp.USER_ID}>
                      <td>
                        <Button
                          variant="soft-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() =>
                            navigate(`/employees/update-employee/${emp.USER_ID}`)
                          }
                        >
                          <IconifyIcon icon="bx:edit" />
                        </Button>

                        <Button variant="soft-danger" size="sm">
                          <IconifyIcon icon="bx:trash" />
                        </Button>
                      </td>

                      <td>{emp.USER_ID}</td>
                      <td>{emp.name}</td>
                      <td>{emp.gmail}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.role}</td>
                      <td>{emp.organization}</td>
                      <td>{emp.department}</td>
                      <td>{emp.dob}</td>
                      <td>{emp.gender}</td>
                      <td>{emp.dof}</td>
                      <td>{emp.salary}</td>
                      <td>{emp.aadhar}</td>
                      <td>{emp.pan}</td>
                      <td>{emp.passport}</td>
                      <td>{emp.bank}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="align-items-center justify-content-between row g-2 text-center text-sm-start p-3 border-top">

            <div className="col-12 col-sm">
              <div className="text-muted mb-2 mb-sm-0">
                Showing {start} to {end} of {totalRecords} records
              </div>
            </div>

            <Col xs={12} sm="auto">
              <ul className="pagination pagination-rounded m-0 justify-content-center justify-content-sm-end">

                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <Link to="#" className="page-link"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}>
                    <IconifyIcon icon="bx:left-arrow-alt" />
                  </Link>
                </li>

                {getPages().map((p, i) => (
                  <li key={i}
                    className={`page-item ${currentPage === p ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}>
                    <Link to="#" className="page-link"
                      onClick={(e) => {
                        e.preventDefault()
                        if (typeof p === 'number') setCurrentPage(p)
                      }}>
                      {p}
                    </Link>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <Link to="#" className="page-link"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}>
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

export default ViewEmployees
