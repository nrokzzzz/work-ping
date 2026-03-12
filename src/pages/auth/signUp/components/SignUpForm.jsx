import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormCheck } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axiosClient from '@/helpers/httpClient';
import { useAuthContext } from '@/context/useAuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuthContext();
  const signUpSchema = yup.object({
    name: yup.string().required('Please enter your name'),
    number: yup.string().required('Please enter your mobile number'),
    userEmail: yup
      .string()
      .email('Please enter a valid email')
      .required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password')
  });

  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    resolver: yupResolver(signUpSchema)
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        number: values.number,
        email: values.userEmail,
        password: values.password
      };

      const res = await axiosClient.post('/api/admin/auth/register', payload);

      if (res.status !== 201) {
        throw new Error(res.data?.error || 'Signup failed');
      }

      await signUp();
      toast.success('Signup successful!');

      await navigate('/2fa-authnticator', {
        state: {
          action: 'SIGN-UP',
          path: '/',
        },
      });

      reset();
    } catch (error) {
      // Error toast is handled by httpClient interceptor
    }
  };

  return (
    <form
      className="authentication-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextFormInput
        control={control}
        name="name"
        containerClassName="mb-3"
        label="Name"
        id="name"
        placeholder="Enter your name"
        required
      />

      <TextFormInput
        name="number"
        label="Mobile Number"
        placeholder="Enter your number"
        containerClassName="mb-3"
        control={control}
        required
      />

      <TextFormInput
        control={control}
        name="userEmail"
        containerClassName="mb-3"
        label="Email"
        id="email-id"
        placeholder="Enter your email"
        required
      />

      <PasswordFormInput
        control={control}
        name="password"
        containerClassName="mb-3"
        placeholder="Enter your password"
        id="password-id"
        label="Password"
        required
      />

      <PasswordFormInput
        control={control}
        name="confirmPassword"
        containerClassName="mb-3"
        placeholder="Enter your password"
        id="password-id-2"
        label="Confirm Password"
        required
      />

      <div className="mb-3">
        <FormCheck
          label="I accept Terms and Condition"
          id="termAndCondition"
          required
        />
      </div>

      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;