import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form, Dropdown } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import axiosClient from '@/helpers/httpClient'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { use2FA } from '@/context/TwoFAContext'
import { useAuthContext } from '@/context/useAuthContext'

const schema = yup.object({
  teamName: yup.string().required('Team Name is required'),
  organizationId: yup.string().required('Organization ID is required'),
  teamManagerId: yup.string().nullable(),
  teamLeaderId: yup.string().nullable(),
  description: yup.string().nullable(),
})

const UpdateTeam = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [organizations, setOrganizations] = useState([])
  const [employees, setEmployees] = useState([])

  const [search, setSearch] = useState('')
  const [managerSearch, setManagerSearch] = useState('')
  const [leaderSearch, setLeaderSearch] = useState('')

  const [selectedOrg, setSelectedOrg] = useState('')
  const [selectedManager, setSelectedManager] = useState('')
  const [selectedLeader, setSelectedLeader] = useState('')

  const { require2FA } = use2FA()
  const { is2FAAuthnticator } = useAuthContext()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {

    const fetchOrganizations = async () => {

      try {

        const res = await axiosClient.get(
          '/api/admin/get-all-employees/get-organization-info'
        )

        const formatted = Object.entries(res.data || {}).map(([name, obj]) => ({
          name,
          organizationId: obj.organizationId
        }))

        setOrganizations(formatted)

      } catch (error) {

        console.log(error)

      }

    }

    fetchOrganizations()

  }, [])

  const fetchEmployees = async (orgId) => {

    try {

      const res = await axiosClient.get(
        `/api/admin/get-all-employees/get-all-employees-by-page-number?organizationId=${orgId}`
      )

      setEmployees(res.data?.data || [])

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    const fetchTeam = async () => {

      try {

        const res = await axiosClient.get(`/api/admin/team/get-team/${id}`)

        const team = res.data

        reset({
          teamName: team.teamName,
          organizationId: team.organizationId,
          teamManagerId: team.managerId?._id || '',
          teamLeaderId: team.leaderIds?.[0]?._id || '',
          description: team.description || '',
        })

        const org = organizations.find(
          (o) => o.organizationId === team.organizationId
        )

        if (org) setSelectedOrg(org.name)

        fetchEmployees(team.organizationId)

        if (team.managerId) {
          setSelectedManager(team.managerId.employeeId)
          setValue('teamManagerId', team.managerId._id)
        }

        if (team.leaderIds?.length) {
          setSelectedLeader(team.leaderIds[0].employeeId)
          setValue('teamLeaderId', team.leaderIds[0]._id)
        }

      } catch (error) {

        console.error(error)

      }

    }

    if (id && organizations.length) fetchTeam()

  }, [id, organizations, reset, setValue])

  const updateTeamApi = async (payload) => {

    await axiosClient.post(
      "/api/admin/team/update-team",
      payload
    )

    toast.success("Team updated successfully!")
    navigate("/teams/update-teams-view")

  }

  const onSubmit = async (data) => {

    const payload = {
      teamId: id,
      teamName: data.teamName,
      description: data.description,
      organizationId: data.organizationId,
      managerId: data.teamManagerId || null,
      leaderIds: data.teamLeaderId ? [data.teamLeaderId] : []
    }

    if (is2FAAuthnticator) {

      try {

        await updateTeamApi(payload)

      } catch (error) {

        console.error(error)
        toast.error("Failed to update team")

      }

    } else {

      require2FA(async () => {

        try {

          await updateTeamApi(payload)

        } catch (error) {

          throw new Error(
            error?.response?.data?.message || "Failed to update team"
          )

        }

      })

    }

  }

  return (
    <ComponentContainerCard id="basic" title="Update Team">

      <Form className="row g-4" onSubmit={handleSubmit(onSubmit)}>

        <div className="col-md-6">
          <Form.Label>
            Team Name <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            placeholder="Enter Team Name"
            {...register('teamName')}
          />
          <small className="text-danger">
            {errors.teamName?.message}
          </small>
        </div>

        <div className="col-md-6">
          <Form.Label>
            Organization Name <span className="text-danger">*</span>
          </Form.Label>

          <Dropdown className="w-100">

            <Dropdown.Toggle
              as="div"
              className="form-control d-flex justify-content-between align-items-center arrow-none"
              style={{ cursor: "pointer" }}
            >
              <span>{selectedOrg || "Select Organization"}</span>
              <IconifyIcon icon="bx:chevron-down" className="fs-4" />
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="w-100 p-2"
              style={{
                maxHeight: '220px',
                overflowY: 'auto',
                overflowX: 'hidden'
              }}
            >

              <Form.Control
                placeholder="Search organization"
                className="mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {organizations
                .filter(o =>
                  o.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((o) => (
                  <Dropdown.Item
                    key={o.organizationId}
                    onClick={() => {

                      setSelectedOrg(o.name)
                      setValue('organizationId', o.organizationId)
                      setSearch('')
                      fetchEmployees(o.organizationId)

                    }}
                  >
                    {o.name}
                  </Dropdown.Item>
                ))}

            </Dropdown.Menu>

          </Dropdown>

          <input type="hidden" {...register('organizationId')} />

          <small className="text-danger">
            {errors.organizationId?.message}
          </small>
        </div>

        <div className="col-md-6">
          <Form.Label>
            Team Manager ID <small className="text-muted">(Optional)</small>
          </Form.Label>

          <Dropdown className="w-100">

            <Dropdown.Toggle
              as="div"
              className="form-control d-flex justify-content-between align-items-center arrow-none"
              style={{ cursor: "pointer" }}
            >
              <span>{selectedManager || "Select Manager"}</span>
              <IconifyIcon icon="bx:chevron-down" className="fs-4" />
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="w-100 p-2"
              style={{ maxHeight: '220px', overflowY: 'auto' }}
            >

              <Form.Control
                placeholder="Search manager"
                className="mb-2"
                value={managerSearch}
                onChange={(e) => setManagerSearch(e.target.value)}
              />

              {employees
                .filter(e =>
                  e.name.toLowerCase().includes(managerSearch.toLowerCase()) ||
                  e.employeeId.toLowerCase().includes(managerSearch.toLowerCase())
                )
                .map((emp) => (
                  <Dropdown.Item
                    key={emp._id}
                    onClick={() => {
                      setSelectedManager(emp.employeeId)
                      setValue('teamManagerId', emp._id)
                      setManagerSearch('')
                    }}
                  >
                    {emp.employeeId}
                  </Dropdown.Item>
                ))}

            </Dropdown.Menu>

          </Dropdown>

          <input type="hidden" {...register('teamManagerId')} />

        </div>

        <div className="col-md-6">
          <Form.Label>
            Team Leader ID <small className="text-muted">(Optional)</small>
          </Form.Label>

          <Dropdown className="w-100">

            <Dropdown.Toggle
              as="div"
              className="form-control d-flex justify-content-between align-items-center arrow-none"
              style={{ cursor: "pointer" }}
            >
              <span>{selectedLeader || "Select Leader"}</span>
              <IconifyIcon icon="bx:chevron-down" className="fs-4" />
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="w-100 p-2"
              style={{ maxHeight: '220px', overflowY: 'auto' }}
            >

              <Form.Control
                placeholder="Search leader"
                className="mb-2"
                value={leaderSearch}
                onChange={(e) => setLeaderSearch(e.target.value)}
              />

              {employees
                .filter(e =>
                  e.name.toLowerCase().includes(leaderSearch.toLowerCase()) ||
                  e.employeeId.toLowerCase().includes(leaderSearch.toLowerCase())
                )
                .map((emp) => (
                  <Dropdown.Item
                    key={emp._id}
                    onClick={() => {
                      setSelectedLeader(emp.employeeId)
                      setValue('teamLeaderId', emp._id)
                      setLeaderSearch('')
                    }}
                  >
                    {emp.employeeId}
                  </Dropdown.Item>
                ))}

            </Dropdown.Menu>

          </Dropdown>

          <input type="hidden" {...register('teamLeaderId')} />

        </div>

        <div className="col-12">
          <Form.Label>
            Description <small className="text-muted">(Optional)</small>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            {...register('description')}
          />
        </div>

        <div className="col-12 d-flex justify-content-center gap-4 mt-3">

          <Button
            variant="secondary"
            type="button"
            onClick={() => reset()}
          >
            Clear
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            Update
          </Button>

        </div>

      </Form>

    </ComponentContainerCard>
  )
}

export default UpdateTeam