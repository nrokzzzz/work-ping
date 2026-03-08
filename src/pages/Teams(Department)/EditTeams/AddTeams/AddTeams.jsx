import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form, Dropdown } from 'react-bootstrap'
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

const CreateTeam = () => {

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
    defaultValues: {
      teamName: '',
      organizationId: '',
      teamManagerId: '',
      teamLeaderId: '',
      description: '',
    },
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

  const onSubmit = async (data) => {
    try {

      console.log('Payload ', data)

      const res = await axiosClient.post(
        '/api/admin/team/create-team',
        data
      )

      console.log('Response ', res.data)

      reset()
      setSelectedOrg('')
      toast.success('Team created successfully!')

    } catch (error) {
      console.error('SAVE TEAM ERROR ', error)
      toast.error('Failed to create team. Please try again.')
    }
  }

  return (
    <ComponentContainerCard id="basic" title="Add Teams">

      <Form className="row g-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Team Name */}
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

        {/* Organization Dropdown */}
        <div className="col-md-6">
          <Form.Label>
            Organization ID <span className="text-danger">*</span>
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

        {/* Team Manager */}
        <div className="col-md-6">
          <Form.Label>
            Team Manager ID <small className="text-muted">(Optional)</small>
          </Form.Label>
          <Form.Control
            placeholder="Enter Team Manager ID"
            {...register('teamManagerId')}
          />
        </div>

        {/* Team Leader */}
        <div className="col-md-6">
          <Form.Label>
            Team Leader ID <small className="text-muted">(Optional)</small>
          </Form.Label>
          <Form.Control
            placeholder="Enter Team Leader ID"
            {...register('teamLeaderId')}
          />
        </div>

        {/* Description */}
        <div className="col-12">
          <Form.Label>
            Description <small className="text-muted">(Optional)</small>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter Team Description"
            {...register('description')}
          />
        </div>

        {/* Buttons */}
        <div className="col-12 d-flex justify-content-center gap-4 mt-3">

          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              reset()
              setSelectedOrg('')
            }}
          >
            Clear
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>

        </div>

      </Form>

    </ComponentContainerCard>
  )
}

export default CreateTeam