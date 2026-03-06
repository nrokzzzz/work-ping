import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
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

  // ✅ Fetch Organizations (YOUR ROUTE)
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axiosClient.get(
          'api/admin/organization/get-all-organization-ids'
        )
        console.log(res.data)
        // backend returns { data: [...] }
        setOrganizations(res.data || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchOrganizations()
  }, [])

  // ✅ Fetch Teams (YOUR ROUTE)
  const fetchTeams = async (page) => {
    setLoading(true)
    console.log("calling teams")
    try {
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
      })

      if (appliedSearch) {
        params.append('search', appliedSearch)
      }

      if (appliedOrganization) {
        params.append('organizationId', appliedOrganization)
      }

      const res = await axiosClient.get(
        `api/admin/team/get-teams-filter?${params.toString()}`
      )
      console.log(res)
      setTeams(res.data?.teamList || [])
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
  }, [currentPage, appliedSearch, appliedOrganization])

  const handleApply = () => {
    setAppliedSearch(search.trim())
    setAppliedOrganization(organization)
    setCurrentPage(1)
  }

  // ✅ Convert organizationId → organization name
  const getOrganizationName = (orgId) => {
    const org = organizations.find(
      (o) => o.organizationId === orgId
    )
    return org?.name || '-'
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
              {/* Search */}
              <Col xs={12} md={4}>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>

              {/* Organization Dropdown */}
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

          {/* Table */ console.log("teams: "+teams) }
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
                      <td>{team.teamName}</td>
                      <td>{team.teamManagerId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-top d-flex justify-content-between align-items-center">
            <div>
              Showing {start} to {end} of {totalRecords} records
            </div>

            <ul className="pagination m-0">
              {getPages().map((p, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === p ? 'active' : ''
                  } ${p === '...' ? 'disabled' : ''}`}
                >
                  <Link
                    to="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault()
                      if (typeof p === 'number')
                        setCurrentPage(p)
                    }}
                  >
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default ViewTeams