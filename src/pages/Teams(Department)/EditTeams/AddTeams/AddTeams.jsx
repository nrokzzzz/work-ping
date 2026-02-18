import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form } from 'react-bootstrap'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import axiosClient from '@/helpers/httpClient'

const schema = yup.object({
  teamName: yup.string().required('Team Name is required'),
  organizationId: yup.string().required('Organization ID is required'),
  teamManagerId: yup.string().nullable(),
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

      //  Reset form after success
      reset()

    } catch (error) {
      console.error('SAVE TEAM ERROR ', error)
    }
  }

  return (
    <ComponentContainerCard id="basic" title="Add Teams">

      <Form className="row g-4" onSubmit={handleSubmit(onSubmit)}>

        {/* LEFT SIDE */}
        <div className="col-md-6">
          <div className="row g-3">

            <div className="col-12">
              <Form.Label>Team Name</Form.Label>
              <Form.Control {...register('teamName')} />
              <small className="text-danger">
                {errors.teamName?.message}
              </small>
            </div>

            <div className="col-12">
              <Form.Label>Organization ID</Form.Label>
              <Form.Control {...register('organizationId')} />
              <small className="text-danger">
                {errors.organizationId?.message}
              </small>
            </div>

            <div className="col-12">
              <Form.Label>
                Team Manager ID <small className="text-muted">(Optional)</small>
              </Form.Label>
              <Form.Control {...register('teamManagerId')} />
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6">
          <Form.Label>
            Description <small className="text-muted">(Optional)</small>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={9}
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
