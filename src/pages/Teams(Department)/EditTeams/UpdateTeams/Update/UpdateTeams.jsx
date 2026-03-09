import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form, Dropdown } from 'react-bootstrap'
import { useParams,useNavigate } from 'react-router-dom'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import axiosClient from '@/helpers/httpClient'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

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
  const [search, setSearch] = useState('')
  const [selectedOrg, setSelectedOrg] = useState('')

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

        if (org) {
          setSelectedOrg(org.name)
        }

      } catch (error) {
        console.error(error)
      }
    }

    if (id) fetchTeam()

  }, [id, organizations])

  const onSubmit = async (data) => {
  try {

    const payload = {
      teamId: id,
      teamName: data.teamName,
      description: data.description,
      organizationId: data.organizationId,
      managerId: data.teamManagerId || null,
      leaderIds: data.teamLeaderId ? [data.teamLeaderId] : []
    }

    await axiosClient.post(
      "/api/admin/team/update-team",
      payload
    )

    toast.success("Team updated successfully!")

    navigate("/teams/update-teams-view")

  } catch (error) {
    console.error(error)
    toast.error("Failed to update team")
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
          <Form.Control
            {...register('teamManagerId')}
          />
        </div>

        <div className="col-md-6">
          <Form.Label>
            Team Leader ID <small className="text-muted">(Optional)</small>
          </Form.Label>
          <Form.Control
            {...register('teamLeaderId')}
          />
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