import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { useGetRecentPosts, useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { link } from "fs";
import { INavLink } from "@/types";
import Status from "./Status";
import {
    Dialog,
    DialogTrigger,
  } from "@/components/ui/dialog"
import UpdateStatus from "./UpdateStatus";
import Loader from "./Loader";



const LeftSidebar = () => {
    const { pathname } = useLocation();

  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user} = useUserContext();
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();

  useEffect(() => {
    if(isSuccess) navigate(0);
    }, [isSuccess])

  return (
    <nav className='leftsidebar'>
        <div className='flex flex-col gap-11'>
            <Link to="/" className="flex gap-3 items-center">
            <img 
            src="/assets/react.svg" width={50} height={50}
            alt="logo"
          />
          <h1>Jar of Thoughts</h1>
            </Link>
            <Link to={'/profile/${user.id}'} className="flex gap-3 items-center">
                
                
                {isPostLoading && !posts ? (
                    <Loader />
                ) : (
            <div className="flex gap-3 items-center">
                <img src={ user.imageUrl || '/assets/images/profile-placeholder.svg'} alt="profile" className="h-14 w-14 rounded-full"/>
                <div className="flex flex-col">
                    <p className="body-bold">
                        {user.name}
                    </p>
                    <p className="small-regular text-light-3">
                        @{user.username}
                    </p>
                </div>
                <div className="flex flex-end mb-4 ml-1">
                    <Status />
                </div>
                </div>
                )}
            </Link>
            <ul className="flex flex-col gap-6">
                {sidebarLinks.map((link: INavLink) => {
                    const isActive = pathname === link.route;
                    return (
                        <li key={link.label} className= {`leftsidebar-link group ${isActive ? 'bg-primary-500' : ''}`}>
                            <NavLink to={link.route} className="flex gap-4 items-center p-4">
                                <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive && 'invert-white'}`}/>
                                {link.label}
                            </NavLink>
                        </li>
                    )
                })}
                <Dialog>
                    <DialogTrigger>
                    <li key="Status" className= {`leftsidebar-link group`}>
                    <div className="flex gap-4 items-center p-4">
                        <img src="/assets/icons/bookmark.svg" alt="Saved" className={`group-hover:invert-white`} />
                        Status
                    </div>  
                    </li>
                    </DialogTrigger>
                    <UpdateStatus />
                </Dialog>
               
            </ul>

        </div>
        <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut}>
            <img src="/assets/icons/logout.svg" alt="logout" />
            <p className="small-medium lg:base-medium">Logout</p>
        </Button>
    </nav>
  )
}

export default LeftSidebar