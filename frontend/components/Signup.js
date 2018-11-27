import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGN_UP_MUTATION = gql`
    mutation SIGN_UP_MUTATION($email: String!, $password: String!, $name: String!){
        signup(email:$email, password: $password, name: $name){
            id
            email
            name
        }
    }
`;

class Signup extends Component {
    state = {
        name: '',
        email: '',
        password: ''
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = async (e, signup) => {
        e.preventDefault();
        const res = await signup();
        if (res.data.id) this.setState({ name: '', email: '', password: '' });
    }

    render() {
        return (
            <Mutation
                mutation={SIGN_UP_MUTATION}
                variables={this.state}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(signup, { error, loading }) => (
                    <Form
                        method="post"
                        onSubmit={e => this.handleSubmit(e, signup)}
                    >
                        <h2>Sign up</h2>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="name">
                                Name
                                <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleChange} />
                            </label>
                            <label htmlFor="email">
                                Email
                                <input type="email" name="email" id="email" value={this.state.email} onChange={this.handleChange} />
                            </label>
                            <label htmlFor="password">
                                Password
                                <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
                            </label>
                            <button type="submit">Sign Up</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        )
    }
}


export default Signup
