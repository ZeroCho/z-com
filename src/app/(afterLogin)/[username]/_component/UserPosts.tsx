"use client";

import {InfiniteData, useInfiniteQuery, useQuery, useQueryClient} from "@tanstack/react-query";
import {getUserPosts} from "../_lib/getUserPosts";
import Post from "@/app/(afterLogin)/_component/Post";
import {Post as IPost} from "@/model/Post";
import {Fragment, useEffect} from "react";
import {useInView} from "react-intersection-observer";

type Props = {
  username: string;
}
export default function UserPosts({ username }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching
  } = useInfiniteQuery<IPost[], Object, InfiniteData<IPost[]>, [_1: string, _2: string, _3: string], number>({
    queryKey: ['posts', 'users', username],
    queryFn: getUserPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(['users', username]);
  console.log('user', user);
  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (user) {
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
  return null;
}