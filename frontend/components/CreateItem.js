import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

import formatMoney from '../lib/formatMoney';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!,
        $description: String!,
        $price: Int!,
        $image: String,
        $largeImage: String
    ){
        createItem(
            title: $title,
            description: $description,
            price: $price
            image: $image,
            largeImage: $largeImage
        ) {
            id
        }
    }

`

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        price: 0,
        image: '',
        largeImage: ''
    }

    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type === "number" ? parseFloat(value) : value;
        this.setState({ [name]: val })
    };

   uploadFile = async (e) => {
        const { files } = e.target;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');
        const res = await fetch('https://api.cloudinary.com/v1_1/lanamouse/image/upload', {
            method: 'POST',
            body: data
        });

        const file = await res.json();
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        });
    };


    render() {
        return (
            <Mutation
                mutation={CREATE_ITEM_MUTATION}
                variables={this.state}
            >{(createItem, { loading, error }) => (
                <Form onSubmit={async e => {
                    e.preventDefault();
                    const res = await createItem();
                    Router.push({
                        pathname: '/item',
                        query: {
                            id: res.data.createItem.id
                        }
                    })
                }}>
                    <Error error={error} />
                    <fieldset disabled={loading} aria-busy={loading}>
                        <label htmlFor="title">
                            Title
                        <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Title"
                                value={this.state.title}
                                onChange={this.handleChange}
                                required
                            />
                        </label>

                        <label htmlFor="price">
                            Price
                        <input
                                type="number"
                                id="price"
                                name="price"
                                placeholder="Price"
                                value={this.state.price}
                                onChange={this.handleChange}
                                required
                            />
                        </label>

                        <label htmlFor="description">
                            Description
                        <textarea
                                id="description"
                                name="description"
                                placeholder="Enter a description"
                                value={this.state.description}
                                onChange={this.handleChange}
                                required
                            />
                        </label>

                        <label htmlFor="file">
                            Price
                        <input
                                type="file"
                                id="file"
                                name="file"
                                placeholder="Upload image"
                                onChange={this.uploadFile}
                                required
                            />
                        </label>
                        <button type="submit">Submit</button>
                    </fieldset>
                </Form>)}
            </Mutation>
        )
    }
}

export default CreateItem;
