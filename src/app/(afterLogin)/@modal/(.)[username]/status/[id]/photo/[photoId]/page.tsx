import CommentForm from "@/app/(afterLogin)/[username]/status/[id]/_component/CommentForm";
import style from './photoModal.module.css';
import PhotoModalCloseButton
  from "./_component/PhotoModalCloseButton";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import SinglePost from "@/app/(afterLogin)/[username]/status/[id]/_component/SinglePost";
import React from "react";
import Comments from "@/app/(afterLogin)/[username]/status/[id]/_component/Comments";
import ImageZone from "./_component/ImageZone";
import {getSinglePostServer} from "@/app/(afterLogin)/[username]/status/[id]/_lib/getSinglePostServer";

type Props = {
  params: { id: string }
}
export default async function PhotoModal({params}: Props) {
  const {id} = params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({queryKey: ['posts', id], queryFn: getSinglePostServer})
  const dehydratedState = dehydrate(queryClient)

  return (
    <div className={style.container}>
      <HydrationBoundary state={dehydratedState}>
        <PhotoModalCloseButton/>
        <ImageZone id={id} />
        <div className={style.commentZone}>
          <SinglePost id={id} noImage />
          <CommentForm id={id} />
          <Comments id={id} />
        </div>
      </HydrationBoundary>
    </div>
  );
}