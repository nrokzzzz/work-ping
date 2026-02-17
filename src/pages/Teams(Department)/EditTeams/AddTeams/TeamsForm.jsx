import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form, Card, CardBody, Row, Col } from 'react-bootstrap'


const schema = yup.object({
  teamName: yup.string().required('Team Name is required'),
  organizationId: yup.string().required('Organization ID is required'),
  description: yup.string().nullable(),
})

const TeamsForm = ({ onSave, defaultValues }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {
      teamName: '',
      teamManagerId: '',
      organizationId: '',
      description: '',
    },
  })


  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const onSubmit = data => {
    onSave(data)
  }


  const handleClear = () => {
    if (defaultValues) {

      reset(defaultValues)
    } else {

      reset({
        teamName: '',
        teamManagerId: '',
        organizationId: '',
        description: '',
      })
    }
  }

  return (
            <Form className="row g-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="col-md-6">
                <div className="row g-3">

                  <div className="col-12">
                    <Form.Label>Team Name*</Form.Label>
                    <Form.Control {...register('teamName')} />
                    <small className="text-danger">
                      {errors.teamName?.message}
                    </small>
                  </div>

                  <div className="col-12">
                    <Form.Label>Team Manager ID</Form.Label>
                    <Form.Control {...register('teamManagerId')} />
                  </div>

                  <div className="col-12">
                    <Form.Label>Organization ID*</Form.Label>
                    <Form.Control {...register('organizationId')} />
                    <small className="text-danger">
                      {errors.organizationId?.message}
                    </small>
                  </div>

                </div>
              </div>
              <div className="col-md-6">
                <div className="row g-3">

                  <div className="col-12">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={9}
                      {...register('description')}
                    />
                  </div>

                </div>
              </div>

              <div className="col-12 d-flex justify-content-center gap-4">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleClear}
                >
                  {defaultValues ? 'Reset' : 'Clear'}
                </Button>

                <Button type="submit">
                  {defaultValues ? 'Update' : 'Save'}
                </Button>
              </div>

            </Form>
  )
}

export default TeamsForm
