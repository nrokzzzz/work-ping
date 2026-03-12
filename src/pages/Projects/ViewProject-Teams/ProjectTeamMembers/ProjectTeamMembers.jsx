import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import axiosClient from '@/helpers/httpClient'

const ViewTeams = () => {
  const itemsPerPage = 10

  const [teams, setTeams] = useState([])
  const [organizations, setOrganizations] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [organization, setOrganization] = useState('')
  const [appliedOrganization, setAppliedOrganization] = useState('')

  const [loading, setLoading] = useState(false)

  const { projectId } = useParams()

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axiosClient.get(
          'api/admin/organization/get-all-organization-ids'
        )
        console.log(res.data)
        setOrganizations(res.data || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchOrganizations()
  }, [])

  const fetchTeams = async (page) => {
    if (!projectId) return

    setLoading(true)

    try {
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
        projectId
      })

      if (appliedSearch) {
        params.append('search', appliedSearch)
      }

      if (appliedOrganization) {
        params.append('organizationId', appliedOrganization)
      }

      const res = await axiosClient.get(
        `/api/admin/team/get-team-members?${params.toString()}`
      )

      console.log(res)

      setTeams(res.data?.teamList || res.data?.members || [])
      setTotalPages(res.data?.totalPages || 0)
      setTotalRecords(res.data?.totalRecords || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams(currentPage)
  }, [currentPage, appliedSearch, appliedOrganization, projectId])

  const handleApply = () => {
    setAppliedSearch(search.trim())
    setAppliedOrganization(organization)
    setCurrentPage(1)
  }

  const getOrganizationName = (orgId) => {
    const org = organizations.find((o) => o.organizationId === orgId)
    return org?.name || '--'
  }

  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1)

    if (currentPage <= 2)
      return [1, 2, 3, '...', totalPages]

    if (currentPage >= totalPages - 1)
      return [1, '...', totalPages - 2, totalPages - 1, totalPages]

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ]
  }

  const start =
    totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalRecords)

  console.log("teams:", teams)

  return (
    <Row>
      <Col>
        <Card>

          <CardBody className="d-flex justify-content-end">
            <Button variant="primary" as={Link} to="/teams/create">
              + Add Member
            </Button>
          </CardBody>

          <CardBody>
            <Row className="g-2">

              <Col xs={12} md={4}>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>

              <Col xs={12} md={4}>
                <select
                  className="form-select"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                >
                  <option value="">Select Organization</option>

                  {organizations.map((org) => (
                    <option
                      key={org.organizationId}
                      value={org.organizationId}
                    >
                      {org.name}
                    </option>
                  ))}
                </select>
              </Col>

              <Col xs={12} md={4}>
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
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Work Type</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : teams.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No records found
                    </td>
                  </tr>
                ) : (
                  teams.map((team) => (
                    <tr key={team._id}>
                      <td>{team.teamName || '--'}</td>
                      <td>{team.teamManagerId || '--'}</td>
                      <td>{team.workType || '--'}</td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>

          <div className="align-items-center justify-content-between row g-2 text-center text-sm-start p-3 border-top">

            <div className="col-12 col-sm">
              <div className="text-muted">
                Showing {start} to {end} of {totalRecords} records
              </div>
            </div>

            <Col xs={12} sm="auto">

              <ul className="pagination pagination-rounded m-0 justify-content-center justify-content-sm-end">

                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <Link
                    to="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1)
                        setCurrentPage(currentPage - 1)
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
                        if (typeof p === 'number')
                          setCurrentPage(p)
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
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1)
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

export default ViewTeams