import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGN_IN_MUTATION = gql`
    mutation SIGN_IN_MUTATION($email: String!, $password: String!){
        signin(email:$email, password: $password){
            id
            email
            name
        }
    }
`;

class Signin extends Component {
    state = {
        email: '',
        password: ''
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = async (e, signin) => {
        e.preventDefault();
        await signin();
        this.setState({ email: '', password: '' });
    }

    render() {
        return (
            <Mutation
                mutation={SIGN_IN_MUTATION}
                variables={this.state}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(signin, { error, loading }) => (
                    <Form
                        method="post"
                        onSubmit={e => this.handleSubmit(e, signin)}
                    >
                        <h2>Sign into your account</h2>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="email">
                                Email
                                <input type="email" name="email" id="email" value={this.state.email} onChange={this.handleChange} />
                            </label>
                            <label htmlFor="password">
                                Password
                                <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
                            </label>
                            <button type="submit">Sign In</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        )
    }
}


export default Signin
