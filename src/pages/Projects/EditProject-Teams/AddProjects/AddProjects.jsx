import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form, Card, CardBody, Row, Col } from 'react-bootstrap'

import axiosClient from '@/helpers/httpClient'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  assignedDate: yup.string().required('Assigned Date is required'),
  dueDate: yup.string().required('Due Date is required'),
  contractedBy: yup.string().required('Contracted By is required'),
  organizationId: yup.string().required('Organization ID is required'),
  description: yup.string().nullable(),
})

const AddProjects = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    console.log('FORM DATA:', data)
    try {
      const res = await axiosClient.post('/api/project/create-project', data)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ComponentContainerCard id="basic" title="Add Projects">
      <Form className="row g-4" onSubmit={handleSubmit(onSubmit)}>

        <div className="col-md-6">
          <div className="row g-3">

            <div className="col-12">
              <Form.Label>
                Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                placeholder="Enter Project Name"
                {...register('name')}
              />
              <small className="text-danger">{errors.name?.message}</small>
            </div>

            <div className="col-12">
              <Form.Label>
                Assigned Date <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                {...register('assignedDate')}
              />
              <small className="text-danger">{errors.assignedDate?.message}</small>
            </div>

            <div className="col-12">
              <Form.Label>
                Due Date <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                {...register('dueDate')}
              />
              <small className="text-danger">{errors.dueDate?.message}</small>
            </div>

            <div className="col-12">
              <Form.Label>
                Contracted By <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                placeholder="Enter Contracted By"
                {...register('contractedBy')}
              />
              <small className="text-danger">{errors.contractedBy?.message}</small>
            </div>

          </div>
        </div>

        <div className="col-md-6">
          <div className="row g-3">

            <div className="col-12">
              <Form.Label>
                Organization ID <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                placeholder="Enter Organization ID"
                {...register('organizationId')}
              />
              <small className="text-danger">{errors.organizationId?.message}</small>
            </div>

            <div className="col-12">
              <Form.Label>
                Description <small className="text-muted">(Optional)</small>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={9}
                placeholder="Enter Project Description"
                {...register('description')}
              />
            </div>

          </div>
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
            Submit
          </Button>
        </div>

      </Form>
    </ComponentContainerCard>
  )
}

export default AddProjects