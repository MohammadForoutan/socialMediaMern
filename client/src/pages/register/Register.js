import './register.css';
import { useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Container, Grid, TextField } from '@material-ui/core';
import { registerUser } from '../../servicesConfigure/auth';

export default function Register() {
  const history = useHistory();

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleSubmitRegisterForm = async (e) => {
    const email = emailRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    e.preventDefault();
    if (password !== confirmPassword) {
      confirmPasswordRef.current.setCustomValidity("passwords don't match");
      return;
    }
    if (password.length < 6) {
      passwordRef.current.setCustomValidity("passwords don't match");
      return;
    }
    if (confirmPassword.length < 6) {
      confirmPasswordRef.current.setCustomValidity("passwords don't match");
      return;
    }

    try {
      await registerUser({
        username,
        email,
        password,
        confirmPassword,
      });
      history.push('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='login'>
      <Container>
        <Grid container className='login__container'>
          <Grid item xs={12} sm={6}>
            <h3 className='login__logo'>LOGO </h3>
            <span className='login__desc'>
              Connect with friends and the world around you on LOGO.
            </span>
          </Grid>
          <Grid item xs={12} sm={6}>
            <form onSubmit={handleSubmitRegisterForm}>
              <div className='login__input'>
                <TextField
                  label='Username'
                  type='text'
                  placeholder='Enter your username'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant='outlined'
                  inputRef={usernameRef}
                  required={true}
                />
              </div>

              <div className='login__input'>
                <TextField
                  label='Email'
                  type='email'
                  placeholder='Enter your email'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant='outlined'
                  inputRef={emailRef}
                  required={true}
                />
              </div>

              <div className='login__input'>
                <TextField
                  label='Password'
                  type='password'
                  placeholder='Enter your password'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant='outlined'
                  inputRef={passwordRef}
                  required={true}
                />
              </div>

              <div className='login__input'>
                <TextField
                  label='Confim Password'
                  type='password'
                  placeholder='Enter your password again'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant='outlined'
                  inputRef={confirmPasswordRef}
                  required={true}
                />
              </div>

              <Button type='submit' variant='contained' color='primary'>
                Sign Up
              </Button>

              <br />
              <br />
              <Link to='/login'>
                <Button type='submit' variant='outlined' color='secondary'>
                  Log into Account
                </Button>
              </Link>
            </form>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
