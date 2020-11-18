import React from 'react';
import '../index.css';

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: ''
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      handleChange(event) {
        this.setState(
            {
                username: document.getElementById("username").value, 
                password: document.getElementById("password").value
            }, 
            () => {console.log(this.state)}
        );
        console.log(this.state)
        console.log(this.state.username)
      }
    
      handleSubmit(event) {
        alert('An essay was submitted: ' + this.state.value);
        event.preventDefault();
      }    
    render(){
        return(
            <div className="loginbox">
                <div id="app">Kat's Calendar<br/>
                    <form>
                        <input type="text" id="username" placeholder="Username" value={this.state.username} onChange={this.handleChange}/><br/>
                        <input type="text" id="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/><br/>
                    </form>
                    <button>Login</button>
                </div>
            </div>
        )
    }
}

export default Login;