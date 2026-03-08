import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form } from 'react-bootstrap'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import axiosClient from '@/helpers/httpClient'
import { toast } from 'react-toastify'

const schema = yup.object({
  teamName: yup.string().required('Team Name is required'),
  organizationId: yup.string().required('Organization ID is required'),
  teamManagerId: yup.string().nullable(),
  teamLeaderId: yup.string().nullable(),
  description: yup.string().nullable(),
})

const CreateTeam = () => {

  const {
    register,
    handleSubmit,
    reset,
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

  const onSubmit = async (data) => {
    try {
      console.log('Payload ', data)

      const res = await axiosClient.post(
        '/api/admin/team/create-team',
        data
      )

      console.log('Response ', res.data)

      reset()
      toast.success('Team created successfully!')

    } catch (error) {
      console.error('SAVE TEAM ERROR ', error)
      toast.error('Failed to create team. Please try again.')
    }
  }

  return (
    <ComponentContainerCard id="basic" title="Add Teams">

      <Form className="row g-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Team Name + Organization ID */}
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
            Organization ID <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            placeholder="Enter Organization ID"
            {...register('organizationId')}
          />
          <small className="text-danger">
            {errors.organizationId?.message}
          </small>
        </div>

        {/* Team Manager + Team Leader */}
        <div className="col-md-6">
          <Form.Label>
            Team Manager ID <small className="text-muted">(Optional)</small>
          </Form.Label>
          <Form.Control
            placeholder="Enter Team Manager ID"
            {...register('teamManagerId')}
          />
        </div>

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

        {/* BUTTONS */}
        <div className="col-12 d-flex justify-content-center gap-4 mt-3">

          <Button
            variant="secondary"
            type="button"
            onClick={() => reset()}
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