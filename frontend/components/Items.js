import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';


const Center = styled.div`
    text-align: center;
`

const ItemsList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
`

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int=${perPage}) {
        items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
            id
            title,
            price,
            description,
            image,
            largeImage
        }
    }
`

class Items extends Component {
    render() {
        const { page } = this.props;
        return (
            <Center>
                <Pagination page={page} />
                <Query
                    query={ALL_ITEMS_QUERY}
                    variables={{
                        skip: page * perPage - perPage
                    }}
                >
                    {({ data, error, loading }) => {
                        if (loading) return <div>Loading...</div>
                        if (error) return <div>Error: {error}</div>
                        return <ItemsList>{data.items.map(item => <Item item={item} key={item.id} />)}</ItemsList>
                    }}
                </Query>
                <Pagination page={page} />
            </Center>
        )
    }
}


export default Items;

export { ALL_ITEMS_QUERY };
