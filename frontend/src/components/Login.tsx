import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import logo from '../images/gamcologo.png';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };



  const handleLogin = (values: any) => {
    axios
      .post(`http://localhost:8081/login`, values)
      .then((response) => {
     

        // Extract the user_id and email from the response
        const { id, email } = response.data.user;

        // Store the user_id and email in localStorage for future use
        localStorage.setItem('user_id', id);
        localStorage.setItem('userEmail', email);

        Swal.fire({
          title: 'Login Success',
          text: 'Login Successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Use the navigate function here
          navigate('/dashboard');
        });
      })
      .catch((error) => {
        console.error('Error during login:', error);

        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid email or password.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password contains 6 characters!').required('Password is required'),
  });

  // Initial form values
  const initialValues = {
    email: '',
    password: '',
  };

  return (
    <>
      <section className="h-200 gradient-form" style={{ backgroundColor: '#eee' }}>
        <div className="container py-5 h-200">
          <div className="row d-flex justify-content-center align-items-center h-50">
            <div className="col-xl-10">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
                      <div className="text-center">
                        <img src={logo} style={{ width: '60%' }} alt="logo" />
                      </div>

                      {/* Use Formik for the login form */}
                      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleLogin}>
                        <Form>
                          {/* Form fields */}
                          <div className="form-outline mb-4">
                            <label htmlFor="email" className="form-label" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                              Email Address
                            </label>
                            <Field type="email" id="email" name="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="error" />
                          </div>

                          <div className="form-outline mb-3">
                            <label htmlFor="password" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '2%' }}>
                              Password
                            </label>
                            <div className="input-group position-relative">
                              <Field
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="form-control"
                              />
                              <div
                                className="position-absolute end-0 top-50 translate-middle-y ms-2"
                                onClick={handleTogglePassword}
                                style={{ cursor: 'pointer', marginRight: '7px' }}
                              >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                              </div>
                            </div>
                            <ErrorMessage name="password" component="div" className="error" />
                          </div>

                          <div className="text-center pt-1 mb-5 pb-1">
                            <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="submit">
                              Log in
                            </button>
                          </div>

                          <div className="d-flex align-items-center justify-content-center pb-4">
                            <p className="mb-0 me-2">Don't have an account?</p>
                            <Link className="btn btn-primary gradient-custom-2" to="/register">
                              Register
                            </Link>
                          </div>
                        </Form>
                      </Formik>
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div className="text-white px-3 py-5 p-md-5 mx-md-4">
                      <h4 className="mb-10" style={{ textAlign: 'center', fontSize: '30px' }}>
                        PERSONAL MONEY MANAGEMENT SYSTEM <br />
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      
    </>
  );
};

export default Login;
