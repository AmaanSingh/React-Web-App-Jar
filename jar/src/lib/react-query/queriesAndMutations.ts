import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query'
import { createCustomMedia, createPost, createUserAccount, deletePost, getCurrentUser, getCustomMedia, getInfinitePosts, getPostbyId, getRecentPosts, likePost, searchPosts, signInAccount, signOutAccount, updatePost, updateStatus } from '../appwrite/api'
import { ICustomMedia, INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { 
            email: string; 
            password: string;
        }) => signInAccount(user),
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    });
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    });
}

export const useCreateCustomMedia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (custom_media: ICustomMedia) => createCustomMedia(custom_media),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getRecentCustom_Media"]
            })
        }
    });
}

export const useUpdateStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (custom_media: ICustomMedia) => updateStatus(custom_media),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["UpdateStatus"]
            })
        }
    });
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    });
}

export const useGetCustomMedia = () => {
    return useQuery({
        queryKey: ["getCustomMedia"],
        queryFn: getCustomMedia,
    });
}


export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    })

}

export const useGetPostId = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostbyId(postId),
        enabled: !!postId
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => deletePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts as any,
        getNextPageParam: (lastPage: any) => {
            if(lastPage && lastPage.documents.length===0) return null;

            const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;

            return lastId;
        }
    })

    
}
  
export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })

    
}

