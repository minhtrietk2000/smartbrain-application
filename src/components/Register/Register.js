import React, { useState } from 'react';

const Register = ({ onRouteChange, loadUser }) => {

  const [nameRegister, setNameRegister] = useState('');
  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');

  const onChangeNameRegister = (event) => {
    setNameRegister(event.target.value);
  } 

  const onChangeEmailRegister = (event) => {
    setEmailRegister(event.target.value);
  }

  const onChangePasswordRegister = (event) => {
    setPasswordRegister(event.target.value);
  }

  const onSubmitRegister = () => {
    fetch('http://localhost:3000/register', {
      method : 'post',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify({
        
        email : emailRegister,
        password : passwordRegister,
        name : nameRegister
      })
    })
      .then (response => response.json())
      .then (user => {
        console.log(user);
        if (user.id) {
          loadUser(user);
          onRouteChange('home');
        }
      })
    
  }
    return (
        <div>
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
            <div className="measure ">
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                <legend className="f1 fw6 ph0 mh0">Register</legend>
        
        <div className="mt3">
        <label className="db fw6 lh-copy f6" htmlfor="name">Name</label>
        <input 
          className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
          type="text" 
          name="name"  
          id="name" 
          onChange={onChangeNameRegister}/>
      </div>

      <div className="mt3">
        <label className="db fw6 lh-copy f6" htmlfor="email-address">Email</label>
        <input 
          className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
          type="email" 
          name="email-address"  
          id="email-address" 
          onChange={onChangeEmailRegister}/>
      </div>

      <div className="mv3">
        <label className="db fw6 lh-copy f6" htmlfor="password">Password</label>
        <input 
          className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
          type="password" 
          name="password"  
          id="password" 
          onChange={onChangePasswordRegister}/>
      </div>

    </fieldset>
    <div className="">
      <input 
        onClick={onSubmitRegister}
        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
        type="submit" 
        value="Register"/>
    </div>
  </div>
</main>
</article>
        </div>

    )
}

export default Register;