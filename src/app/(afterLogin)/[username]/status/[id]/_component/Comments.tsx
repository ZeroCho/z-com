"use client";

import {DefaultError, InfiniteData, useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {Post as IPost} from "@/model/Post";
import {getComments} from "@/app/(afterLogin)/[username]/status/[id]/_lib/getComments";
import Post from "@/app/(afterLogin)/_component/Post";
import {Fragment, useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {getPostRecommends} from "@/app/(afterLogin)/home/_lib/getPostRecommends";

type Props = {
  id: string;
}
export default function Comments({id}: Props) {
  const queryClient = useQueryClient();
  const post = queryClient.getQueryData(['posts', id]);
  console.log('postData', !!post);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery<IPost[], Object, InfiniteData<IPost[]>, [_1: string, _2: string, _3: string], number>({
    queryKey: ['posts', id, 'comments'],
    queryFn: getComments,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  })

  const {ref, inView} = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (post) {
    return <>
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.map((post) => <Post key={post.postId} post={post}/>)}
        </Fragment>))}
      <div ref={ref} style={{height: 50}}/>
    </>
  }
  return null;
}