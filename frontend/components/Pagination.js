import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PaginationStyles from './styles/PaginationStyles';
import Error from './ErrorMessage';

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`

const Pagination = () => (
    <Query
        query={PAGINATION_QUERY}
    >
        {({ data, loading, error }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <Error error={error} />
            return (
                <PaginationStyles>
                    <p>Hi, I'm the pagination {data.itemsConnection.aggregate.count}</p>
                </PaginationStyles>)
        }}
    </Query>
);

export default Pagination;
