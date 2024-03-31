import Loader from "@/components/shared/Loader";
import { Models } from "appwrite"
import GridPostList from "./GridPostList";


type SearchResultsProps = {
  isSEARCHFetching: boolean;
  searchedPosts: Models.Document[];
}


const SearchResults = ({ isSEARCHFetching, searchedPosts}: SearchResultsProps) => {
  if(isSEARCHFetching) return <Loader />

  if(searchedPosts && searchedPosts.documents.length > 0){
    return (
      <GridPostList posts={searchedPosts.documents} />
    )
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  )
}

export default SearchResults