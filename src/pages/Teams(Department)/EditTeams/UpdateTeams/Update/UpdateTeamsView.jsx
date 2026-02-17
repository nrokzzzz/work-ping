import { useEffect, useState } from 'react'
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useNavigate } from 'react-router-dom'
const ViewTeams = () => {
 const navigate = useNavigate()
  const itemsPerPage = 10

  const [employees, setEmployees] = useState([])
  const [organizationList, setOrganizationList] = useState([])

  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const [organization, setOrganization] = useState('')
  const [appliedOrganization, setAppliedOrganization] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employees/fields/organization')
        const data = await res.json()
        setOrganizationList(data || [])
      } catch (err) {
        console.error('Organization fetch error:', err)
      }
    }
    fetchOrganizations()
  }, [])

  const fetchEmployees = async (page) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
      })

      if (appliedOrganization.trim() !== '')
        params.append('organization', appliedOrganization)

      if (appliedSearch.trim() !== '')
        params.append('search', appliedSearch)

      const res = await fetch(`http://localhost:5000/api/employees?${params.toString()}`)
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
  }, [currentPage, appliedOrganization, appliedSearch])

  const handleApply = () => {
    setAppliedOrganization(organization)
    setAppliedSearch(search)
    setCurrentPage(1)
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
    <>
      <PageBreadcrumb subName="Apps" title="Teams" />
      <PageMetaData title="Teams" />

      <Row>
        <Col>
          <Card>

            <CardBody>
              <Row className="g-2">

                {/* Search */}
                <Col md={4}>
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
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </Col>

                
                <Col md={4}>
                  <select
                    className="form-select"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  >
                    <option value="">Select Organization</option>
                    {organizationList.map((org) => (
                      <option key={org} value={org}>
                        {org}
                      </option>
                    ))}
                  </select>
                </Col>

                {/* Apply Button */}
                <Col md={2}>
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
                    <th>Team Name</th>
                    <th>Team Manager ID</th>
                    <th>Organization</th>
                    <th>Team Leader ID</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr key={emp.USER_ID}>

                        <td>
                          <Button
                            variant="soft-secondary"
                            size="sm"
                            className="me-2"
                            onClick={() => navigate(`/teams/edit-teams/update-teams/${emp.USER_ID}`)}
                          >
                            <IconifyIcon icon="bx:edit" />
                          </Button>

                          <Button
                            variant="soft-danger"
                            size="sm"
                          >
                            <IconifyIcon icon="bx:trash" />
                          </Button>
                        </td>

                        <td>{emp.name}</td>
                        <td>{emp.USER_ID}</td>
                        <td>{emp.organization}</td>
                        <td>{emp.department}</td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="align-items-center justify-content-between row g-2 text-center text-sm-start p-3 border-top">
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
                      }}>
                      <IconifyIcon icon="bx:left-arrow-alt" />
                    </Link>
                  </li>

                  {getPages().map((p, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === p ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}>
                      <Link
                        to="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault()
                          if (typeof p === 'number') setCurrentPage(p)
                        }}>
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
    </>
  )
}

export default ViewTeams
