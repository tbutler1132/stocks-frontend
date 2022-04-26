import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const marketBuddyApi = createApi({
    reducerPath: 'marketBuddyApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:7000/' }),
    tagTypes: ['List'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: `users/signin`,
                method: 'POST',
                body: credentials,
            }),   
        }),
        getLists: builder.query({
            query: (id) => `users/${id}?fields=lists`,
            providesTags: ['List']
        }),
        createList: builder.mutation({
            query: ( { id, list } ) => ({
                url: `users/${id}/lists`,
                method: 'POST',
                body: list,
            }),   
            invalidatesTags: ['List', 'User']
        }),
        updatePosition: builder.mutation({
            query: ( { id, positionId, updatedPosition } ) => ({
                url: `users/${id}/transaction/${positionId}`,
                method: 'PATCH',
                body: updatedPosition,
            }),   
        }),
        demo: builder.mutation({
            query: () => ({
                url: `users/demo`,
                method: 'POST',
            }),   
        }),
        getUser: builder.query({
            query: (id) => `users/${id}?fields=cash%20username`,
        }),
        getCurrentPortfolioValue: builder.query({
            query: (id) => `users/${id}/currentPortfolioValue`,
        }),
        getHistoricalPortfolioValue: builder.query({
            query: (id) => `users/${id}/historicalPortfolioValue`,
        }),
        getPortfolioData: builder.query({
            query: (id) => `users/${id}/portfolioData`,
        }),
    })
})

export const {
    useLoginMutation,
    useDemoMutation,
    useGetCurrentPortfolioValueQuery,
    useGetHistoricalPortfolioValueQuery,
    useGetPortfolioDataQuery,
    useCreateListMutation,
    useGetListsQuery,
    useGetUserQuery,
    useUpdatePositionMutation
} = marketBuddyApi