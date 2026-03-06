import { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, Col, Row, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import axiosClient from '@/helpers/httpClient'

const Viewprojects = () => {
  const itemsPerPage = 10
  const [projects, setProjects] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [orgData, setOrgData] = useState({})
  const [organization, setOrganization] = useState('')
  const [appliedOrganization, setAppliedOrganization] = useState('')

  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axiosClient.get(
          '/api/admin/get-all-employees/get-organization-info'
        )
        setOrgData(res.data || {})
        console.log(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchOrganizations()
  }, [])

  const organizationList = useMemo(() => Object.keys(orgData), [orgData])

  const departmentList = useMemo(
    () =>
      organization && orgData[organization]
        ? orgData[organization].teams || []
        : [],
    [organization, orgData]
  )

  const fetchprojects = async (page) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
      })

      if (appliedOrganization) {
        const organizationId =
          orgData[appliedOrganization]?.organizationId

        if (organizationId) {
          params.append('organizationId', organizationId)
        }
      }

      if (appliedSearch) {
        params.append('search', appliedSearch)
      }

      const result = await axiosClient.get(
        `/api/admin/project/list?${params.toString()}`
      )

      setProjects(result.data.projects || [])
      setTotalPages(result.data.totalPages || 0)
      setTotalRecords(result.data.totalRecords || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchprojects(currentPage)
  }, [currentPage, appliedOrganization, appliedSearch])

  const handleApply = () => {
    setAppliedSearch(search)
    setAppliedOrganization(organization)
    setCurrentPage(1)
  }

  const handleSelect = (id, checked) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)

      if (checked) newSet.add(id)
      else newSet.delete(id)

      return newSet
    })
  }

  const deleteProjects = async () => {
    try {
      await axiosClient.post('/api/admin/project/delete-projects', {
        data: [...selectedIds],
      })

      setSelectedIds(new Set())
      fetchprojects(currentPage)
    } catch (e) {
      console.error(e)
    }
  }

  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1)

    if (currentPage <= 2) return [1, 2, 3, '...', totalPages]

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
          <CardBody>
            <Row className="g-2">
              <Col xs={12} md={4}>
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
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </Col>

              <Col xs={12} md={3}>
                <select
                  className="form-select"
                  value={organization}
                  onChange={(e) => {
                    setOrganization(e.target.value)
                  }}
                >
                  <option value="">Select Organization</option>

                  {organizationList.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </Col>

              <Col xs={12} md={3}>
                <div className="d-flex gap-2">
                  <Button className="flex-fill" onClick={handleApply}>
                    Apply
                  </Button>

                  <Button
                    variant="secondary"
                    className="flex-fill"
                    onClick={() => {
                      if (selectMode) setSelectedIds(new Set())
                      setSelectMode(!selectMode)
                    }}
                  >
                    Select
                  </Button>

                  <Button
                    variant="danger"
                    className="flex-fill"
                    disabled={selectedIds.size === 0}
                    onClick={deleteProjects}
                  >
                    Delete
                  </Button>
                </div>
              </Col>
            </Row>
          </CardBody>

          <div className="table-responsive">
            <table className="table text-nowrap mb-0">
              <thead className="bg-light">
                <tr>
                  {selectMode && <th>Select</th>}
                  <th>Actions</th>
                  <th>Name</th>
                  <th>Assigned Date</th>
                  <th>Due Date</th>
                  <th>Contracted By</th>
                  <th>Organization Name</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="15" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan="15" className="text-center py-4">
                      No records found
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project._id}>
                      {selectMode && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(project._id)}
                            onChange={(e) =>
                              handleSelect(
                                project._id,
                                e.target.checked
                              )
                            }
                          />
                        </td>
                      )}

                      <td>
                        <Button
                          variant="soft-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() =>
                            navigate(
                              `/projects/update-projects-form/${project._id}`
                            )
                          }
                        >
                          <IconifyIcon icon="bx:edit" />
                        </Button>
                      </td>

                      <td>{project.name}</td>
                      <td>{project.assignedDate}</td>
                      <td>{project.dueDate}</td>
                      <td>{project.contractedBy}</td>
                      <td>{project.organization}</td>
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
                <li
                  className={`page-item ${
                    currentPage === 1 ? 'disabled' : ''
                  }`}
                >
                  <Link
                    to="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1)
                        setCurrentPage(currentPage - 1)
                    }}
                  >
                    <IconifyIcon icon="bx:left-arrow-alt" />
                  </Link>
                </li>

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

                <li
                  className={`page-item ${
                    currentPage === totalPages
                      ? 'disabled'
                      : ''
                  }`}
                >
                  <Link
                    to="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1)
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

export default Viewprojects