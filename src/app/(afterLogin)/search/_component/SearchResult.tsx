"use client";

import Post from "@/app/(afterLogin)/_component/Post";
import { Post as IPost } from '@/model/Post';
import {getSearchResult} from "@/app/(afterLogin)/search/_lib/getSearchResult";
import {DefaultError, InfiniteData, useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {useInView} from "react-intersection-observer";
import {Fragment, useEffect} from "react";

type Props = {
  searchParams: { q: string, f?: string, pf?: string };
}
export default function SearchResult({ searchParams }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery<IPost[], DefaultError, InfiniteData<IPost[]>, [_1: string, _2: string, Props['searchParams']], number>({
    queryKey: ["posts", "search", searchParams],
    queryFn: getSearchResult,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);


  return (
    <>
      {data?.pages?.map((page, i) => (
        <Fragment key={i}>
          {page.map((post) => <Post key={post.postId} post={post}/>)}
        </Fragment>))}
      <div ref={ref} style={{ height: 50 }} />
    </>
  )
}