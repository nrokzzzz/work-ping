import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form } from 'react-bootstrap'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import axiosClient from '@/helpers/httpClient'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'

const schema = yup.object({
  teamName: yup.string().required('Team Name is required'),
  organizationId: yup.string().required('Organization ID is required'),
  teamManagerId: yup.string().nullable(),
  description: yup.string().nullable(),
})

const UpdateTeams = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

  // Fetch team details on load
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axiosClient.get(
          `/api/admin/team/get-team/${id}`
        )
        reset(res.data)
      } catch (error) {
        console.error('FETCH TEAM ERROR', error)
      }
    }

    if (id) fetchTeam()
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      await axiosClient.put(
        `/api/admin/team/update-team/${id}`,
        data
      )

      navigate('/teams/view-teams')

    } catch (error) {
      console.error('UPDATE TEAM ERROR', error)
    }
  }

  return (
    <ComponentContainerCard id="basic" title="Update Team">

      

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
            Save
          </Button>

        </div>

      </Form>

    </ComponentContainerCard>
  )
}

export default UpdateTeams
