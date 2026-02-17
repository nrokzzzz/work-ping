import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const ResetPassForm = () => {

  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Please enter your email'),
    otp: yup.string().when([], {
      is: () => showOtp,
      then: (schema) => schema.required('Please enter OTP'),
      otherwise: (schema) => schema.notRequired()
    })
  });

  const { control, handleSubmit, setError } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    if (!showOtp) {
      setShowOtp(true);
      return;
    }

    // OTP verification
    if (data.otp === "1234") {
      navigate("/auth/change-password");
    } else {
      setError("otp", {
        type: "manual",
        message: "Invalid OTP"
      });
    }
  };

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>

      <TextFormInput
        control={control}
        name="email"
        containerClassName="mb-3"
        label="Email"
        id="email-id"
        placeholder="Enter your email"
      />

      {showOtp && (
        <TextFormInput
          control={control}
          name="otp"
          containerClassName="mb-3"
          label="OTP"
          id="otp-id"
          placeholder="Enter OTP"
        />
      )}

      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit">
          {showOtp ? "Verify OTP" : "Reset Password"}
        </Button>
      </div>

    </form>
  );
};

export default ResetPassForm;
