import { ID, Query } from 'appwrite';

import { ICustomMedia, INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";


export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        })

        return newUser;
    } catch (error) {
        console.log
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try{
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )
        return newUser;
    } catch(error){
        console.log(error);
    }
    
}

export async function signInAccount(user: { email: string; password: string; }){
    try{
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    }catch(error){
        console.log(error);
    }

}

export async function getCurrentUser(){
    try{
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;
        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]

        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    }catch(error){
        console.log(error);
    }

}

/*
export async function getCurrentUserDocumentId(){
    try{
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;
        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]

        );

        if (!currentUser) throw Error;

        return currentUser.documents[0].$id;
    }catch(error){
        console.log(error);
    }

}
*/

export async function signOutAccount(){
    try{
        const session = await account.deleteSession("current");
        return session;
    }catch(error){
        console.log(error);
    }

}

export async function createPost(post: INewPost){
    try{

        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        const currentAccount = await getCurrentUser();

        const newPost = databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                Update: post.Update,
                Good: post.Good,
                Bad: post.Bad,
                tags: tags,
                Status: currentAccount.Status,
                statusUrl: currentAccount.statusUrl,
            }
        )
        if(!newPost) throw Error;
        return newPost;
    }catch(error){
        console.log(error);
    }

}
//add Emoji to account
export async function createCustomMedia(custom_media: ICustomMedia) {
    try{

    const uploadedFile = await uploadFile(custom_media.file[0]);

    if(!uploadFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);
    
    if(!fileUrl){
        deleteFile(uploadedFile.$id)
        throw Error;
    }

    const currentAccount = await account.get();

    if(!currentAccount) throw Error;
        
    const currentCustom_Media = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.custom_mediaCollectionId,
        [Query.equal('creator', currentAccount.$id)]
    );

    if (!currentCustom_Media) throw Error;

    currentCustom_Media.documents[0].Emoji_Urls.push(fileUrl);

    const newCustomMedia = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.custom_mediaCollectionId,
        currentCustom_Media.documents[0].$id,
        {
            creator: custom_media.userId,
            Emoji_Urls: currentCustom_Media.documents[0].Emoji_Urls,
        }
    )

    if(!newCustomMedia) {
        await deleteFile(uploadedFile.$id)
        throw Error;
    }
    return newCustomMedia;
    } catch(error){
        console.log(error);
    }

    
}

//Gets array of emojis
export async function getCustomMedia() {
    try{
    const currentAccount = await account.get();


    if(!currentAccount) throw Error;
    //console.log(currentAccount);
    //console.log(currentAccount.$id);

   
    const currentCustom_Media = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.custom_mediaCollectionId,
        [Query.equal("creatorId", currentAccount.$id)]
        
    );

    if (!currentCustom_Media) throw Error;
    //console.log(currentCustom_Media);

    return currentCustom_Media.documents[0];
    return null
    } catch(error){
        console.log(error);
    }
}

export async function updateStatus(custom_media: ICustomMedia) {
    try{
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;
        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]

        );

        if (!currentUser) throw Error;

   
    const updatedStatus = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        currentUser.documents[0].$id,
        {
            Status: custom_media.Status,
            statusUrl: custom_media.statusUrl

        }
    );
    
    if (!updatedStatus) throw Error;

    return updatedStatus;
    
    } catch(error){
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        ); 
        return uploadFile;
    } catch (error) {
        console.log(error);
        
    }
}

export async function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100,
        ); 
        return fileUrl;
    } catch (error) {
        console.log(error);
        
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return { status: 'ok' }
    } catch (error) {
        console.log(error);
    }
}




export async function getRecentPosts(){
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    if(!posts) throw Error;
    return posts;

}

export async function likePost(postId: string, likesArray: string[]){
    try{
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                support: likesArray
            }
        )

        if(!updatedPost) throw Error;

        return updatedPost
    }catch(error){
        console.log(error);
    }
}

export async function getPostbyId(postId: string){
    try{
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
        )

        return post;
    }catch(error){
        console.log(error);
    }
}

export async function updatePost(post: IUpdatePost){
    try{

        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        const currentAccount = await getCurrentUser();

        const updatedPost = databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                Update: post.Update,
                Good: post.Good,
                Bad: post.Bad,
                tags: tags,
                Status: currentAccount.Status,
                statusUrl: currentAccount.statusUrl,
            }
        )
        if(!updatedPost) throw Error;
        return updatedPost;
    }catch(error){
        console.log(error);
    }

}

export async function deletePost(postId: string){
    if(!postId) throw Error;

    try{
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return { status: 'ok' }
    }catch(error){
        console.log(error);
    }

}

export async function getInfinitePosts({pageParam }: {pageParam: number}){
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]

    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()));
    }
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )
        if(!posts) throw Error;

        return posts;
    }catch(error){
        console.log(error);
    }

}

export async function searchPosts(searchTerm: string){
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )
        if(!posts) throw Error;

        return posts;
    }catch(error){
        console.log(error);
    }

}