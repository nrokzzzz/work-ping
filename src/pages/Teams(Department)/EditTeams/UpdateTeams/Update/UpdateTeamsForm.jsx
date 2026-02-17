import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form, Card, CardBody, Row, Col } from 'react-bootstrap'



const schema = yup.object({
  teamName: yup.string().required('Team Name is required'),
  organizationId: yup.string().required('Organization ID is required'),
  description: yup.string().nullable(),
})

const UpdateTeamsForm = ({ onSave, defaultValues }) => {
  const [isEditMode, setIsEditMode] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })


  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
      setIsEditMode(false) 
    }
  }, [defaultValues, reset])

  const onSubmit = data => {
    onSave(data)
    setIsEditMode(false)
  }

  const handleCancel = () => {
    reset(defaultValues)
    setIsEditMode(false)
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="mb-0">Team Information</h4>
                {!isEditMode && (
              <Button onClick={() => setIsEditMode(true)}>
                    Edit
              </Button>
            )}
        </div>

              <Form className="row g-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="col-md-6">
                  <div className="row g-3">

                    <div className="col-12">
                      <Form.Label>Team Name*</Form.Label>
                      <Form.Control
                        disabled={!isEditMode}
                        {...register('teamName')}
                      />
                      <small className="text-danger">
                        {errors.teamName?.message}
                      </small>
                    </div>

                    <div className="col-12">
                      <Form.Label>Team Manager ID*</Form.Label>
                      <Form.Control
                        disabled={!isEditMode}
                        {...register('teamManagerId')}
                      />
                      <small className="text-danger">
                        {errors.teamManagerId?.message}
                      </small>
                    </div>

                    <div className="col-12">
                      <Form.Label>Organization ID*</Form.Label>
                      <Form.Control
                        disabled={!isEditMode}
                        {...register('organizationId')}
                      />
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
                        disabled={!isEditMode}
                        {...register('description')}
                      />
                    </div>

                  </div>
                </div>
                {isEditMode && (
                  <div className="col-12 d-flex justify-content-center gap-4">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>

                    <Button type="submit">
                      Save
                    </Button>
                  </div>
                )}

              </Form>
    </>
  )
}

export default UpdateTeamsForm
