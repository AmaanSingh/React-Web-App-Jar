import { useGetCurrentUser, useLikePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"


type PostStatsProps = {
    post: Models.Document;
    userId: string;
}

const PostStats = ({post, userId}: PostStatsProps) => {
    const likesList = post?.support.map((user: Models.Document) => user.$id)

    const [likes, setLikes] = useState(likesList);
    const { mutate: likePost } = useLikePost();
   //const {data: currentUser } = useGetCurrentUser();

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        let newLikes = [...likes];

        const hasLiked = newLikes.includes(userId)

        if(hasLiked){
            newLikes = newLikes.filter((id) => id !== userId);
        } else {
            newLikes.push(userId);
        }
        setLikes(newLikes);
        likePost({ postId: post?.$id || '', likesArray: newLikes })

    }
  return (
    <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
        <img src={`${checkIsLiked(likes,userId) 
        ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}`} alt="like"
            width={20} height={20} onClick={handleLikePost} className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>
        <div className="flex gap-2">
        <TooltipProvider>
            <Tooltip>
            <TooltipTrigger>
                <img src={ post.statusUrl || "/assets/icons/face-meh.svg"} alt={post.Status} style={{aspectRatio: '1/1'
                }} height={30} width={30} className="rounded-md"/>
            </TooltipTrigger>
            <TooltipContent className="shad-dialogue">
                <p>{post.Status}</p>
            </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        </div>
        
    </div>
  )
}

export default PostStats