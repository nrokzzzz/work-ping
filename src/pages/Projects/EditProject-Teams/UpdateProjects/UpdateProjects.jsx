import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form, Dropdown } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '@/helpers/httpClient'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { use2FA } from '@/context/TwoFAContext'
import { useAuthContext } from '@/context/useAuthContext'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  assignedDate: yup.string().required('Assigned Date is required'),
  dueDate: yup.string().required('Due Date is required'),
  contractedBy: yup.string().required('Contracted By is required'),
  organizationId: yup.string().required('Organization ID is required'),
  projectManager: yup.string().required('Project Manager ID is required'),
  description: yup.string().nullable(),
})

const UpdateProjects = () => {

  const navigate = useNavigate()
  const { projectId } = useParams()

  const { require2FA } = use2FA()
  const { is2FAAuthnticator } = useAuthContext()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [organizations, setOrganizations] = useState([])
  const [search, setSearch] = useState('')
  const [selectedOrg, setSelectedOrg] = useState('')

  const [projectManagers, setProjectManagers] = useState([])
  const [pmSearch, setPmSearch] = useState('')
  const [selectedPM, setSelectedPM] = useState('')

  useEffect(() => {

    const fetchOrganizations = async () => {
      try {

        const res = await axiosClient.get(
          '/api/admin/get-all-employees/get-organization-info',
          { silent: true }
        )

        const formatted = Object.entries(res.data?.data || {}).map(([name, obj]) => ({
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

  const fetchProjectManagers = async (orgId) => {

    try {

      const res = await axiosClient.get(
        `/api/admin/get-all-employees/get-all-employees-by-page-number?organizationId=${orgId}`,
        { silent: true }
      )

      const formatted = (res.data?.data?.data || []).map((emp) => ({
        label: emp.employeeId ? `${emp.employeeId} (${emp.name})` : emp.name,
        employeeId: emp._id
      }))

      setProjectManagers(formatted)

    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {

    const fetchProject = async () => {

      try {

        const res = await axiosClient.get(
          `/api/admin/project/get-project?projectId=${projectId}`
        )

        const data = res.data?.data

        setValue('name', data.name)
        setValue('assignedDate', data.assignedDate?.slice(0,10))
        setValue('dueDate', data.dueDate?.slice(0,10))
        setValue('contractedBy', data.contractedBy)
        setValue('organizationId', data.organizationId)
        setValue('projectManager', data.projectManager?._id)
        setValue('description', data.description)

        setSelectedPM(data.projectManager?.name || '')

        const org = organizations.find(
          o => o.organizationId === data.organizationId
        )

        if (org) {
          setSelectedOrg(org.name)
        }

        fetchProjectManagers(data.organizationId)

      } catch (error) {

        console.log(error)

      }

    }

    if(projectId) fetchProject()

  }, [projectId, setValue, organizations])

  const updateProject = async (payload) => {

    try {

      await axiosClient.post(
        '/api/admin/project/update-project',
        payload
      )

      reset()
      navigate('/projects/update-projects')

    } catch (error) {

      console.log(error)

    }

  }

  const onSubmit = async (data) => {

    const payload = {
      id: projectId,
      name: data.name,
      description: data.description,
      projectManager: data.projectManager,
      organizationId: data.organizationId,
      dueDate: new Date(data.dueDate).toISOString(),
      contractedBy: data.contractedBy
    }

    if (is2FAAuthnticator) {

      await updateProject(payload)

    } else {

      require2FA(async () => {

        await updateProject(payload)

      })

    }

  }

  return (
    <ComponentContainerCard id="basic" title="Update Project">
      <Form className="row g-4" onSubmit={handleSubmit(onSubmit)}>

        <div className="col-md-6">
          <Form.Label>
            Name <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            placeholder="Enter Project Name"
            {...register('name')}
          />
          <small className="text-danger">{errors.name?.message}</small>
        </div>

        <div className="col-md-6">
          <Form.Label>
            Assigned Date <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="date"
            {...register('assignedDate')}
          />
          <small className="text-danger">{errors.assignedDate?.message}</small>
        </div>

        <div className="col-md-6">
          <Form.Label>
            Due Date <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="date"
            {...register('dueDate')}
          />
          <small className="text-danger">{errors.dueDate?.message}</small>
        </div>

        <div className="col-md-6">
          <Form.Label>
            Contracted By <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            placeholder="Enter Contracted By"
            {...register('contractedBy')}
          />
          <small className="text-danger">{errors.contractedBy?.message}</small>
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
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{selectedOrg || "Select Organization"}</span>
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
                      fetchProjectManagers(o.organizationId)
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
            Project Manager <span className="text-danger">*</span>
          </Form.Label>

          <Dropdown className="w-100">

            <Dropdown.Toggle
              as="div"
              className="form-control d-flex justify-content-between align-items-center arrow-none"
              style={{ cursor: "pointer" }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{selectedPM || "Select Project Manager"}</span>
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
                placeholder="Search Project Manager"
                className="mb-2"
                value={pmSearch}
                onChange={(e) => setPmSearch(e.target.value)}
              />

              {projectManagers
                .filter(p =>
                  p.label.toLowerCase().includes(pmSearch.toLowerCase())
                )
                .map((p) => (
                  <Dropdown.Item
                    key={p.employeeId}
                    onClick={() => {
                      setSelectedPM(p.label)
                      setValue('projectManager', p.employeeId)
                      setPmSearch('')
                    }}
                  >
                    {p.label}
                  </Dropdown.Item>
                ))}

            </Dropdown.Menu>

          </Dropdown>

          <input type="hidden" {...register('projectManager')} />

          <small className="text-danger">
            {errors.projectManager?.message}
          </small>
        </div>

        <div className="col-12">
          <Form.Label>
            Description <small className="text-muted">(Optional)</small>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Enter Project Description"
            {...register('description')}
          />
        </div>

        <div className="col-12 d-flex justify-content-center gap-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => reset()}
          >
            Clear
          </Button>

          <Button type="submit">
            Update
          </Button>
        </div>

      </Form>
    </ComponentContainerCard>
  )
}

export default UpdateProjects