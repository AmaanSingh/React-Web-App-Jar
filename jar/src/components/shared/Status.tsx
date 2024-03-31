import { useUserContext } from "@/context/AuthContext";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"


const Status = () => {
    const { user } = useUserContext();
  return (
    
        <TooltipProvider>
            <Tooltip>
            <TooltipTrigger>
                <img src={ user.statusUrl || "/assets/icons/face-meh.svg"} alt={user.Status} style={{aspectRatio: '1/1'
                }} width={30} height={30} className="rounded-md"/>
            </TooltipTrigger>
            <TooltipContent className="shad-dialogue">
                <p>{user.Status}</p>
            </TooltipContent>
            </Tooltip>
        </TooltipProvider>
  )
}

export default Status