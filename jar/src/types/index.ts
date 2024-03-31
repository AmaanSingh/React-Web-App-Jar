export type IContextType = {
  user: IUser,
  isLoading: boolean,
  isAuthenticated: boolean,
  setUser: React.Dispatch<React.SetStateAction<IUser>>,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  checkAuthUser: () => Promise<boolean>,
}

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type INewPost = {
    userId: string;
    Update: string;
    Good?: string;
    Bad?: string;
    tags?: string;
    Status?: string;
    statusUrl?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    Update: string;
    Good?: string;
    Bad?: string;
    tags?: string;
    Status?: string;
    statusUrl?: string;
  };
  
  /*
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
  };
  */

  export type ICustomMedia = {
    userId: string;
    Status: string;
    statusUrl: URL;
    file?: File[];
  };

  export type INewUser = {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
  };

  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
    Status: string;
    statusUrl: string;
  };