
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { server } from '../../constants/config';

//import { Chat } from '@mui/icons-material';
const api= createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl:`${server}/api/v1/`}),
    tagTypes:["Chat","User"],


    endpoints:(builder)=>({
        myChats:builder.query({
            query:()=>({
                url:"chat/my",
                credentials:"include",
            }),
            providesTags:["Chat"],
        }),
        
        searchUser:builder.query({
            query:(name)=>({
                url:`user/search?name=${name}`,
                credentials:"include",
        }),
        providesTags:["User"],
    }),

    sendFriendRequest:builder.mutation({
        query:(data)=>({
            url:"user/sendrequest",
            method:"PUT",
            body:data,
            credentials:"include",
        }),
        invalidatesTags:["User"]
    }),

    getNotifications:builder.query({
        query:()=>({
            url:`user/notifications`,
            credentials:"include",
    }),
        keepUnusedDataFor:0,
}),

acceptFriendRequest:builder.mutation({
    query:(data)=>({
        url:"user/accept-request",
        method:"PUT",
        body:data,
        credentials:"include",
    }),
    invalidatesTags:["Chat"]
}),

chatDetails:builder.query({
    query:({chatId,populate=false})=>{
        let url=`chat/${chatId}`;
        if(populate) url+="?populate=true"
        

        return {
            url,
            credentials:"include",
    }
},
    providesTags:["Chats"],
}),

 }),
});

export default api;

export const  {useMyChatsQuery,useLazySearchUserQuery,useSendFriendRequestMutation,useGetNotificationsQuery,useAcceptFriendRequestMutation,useChatDetailsQuery} = api;