import style from './message.module.css';
import Room from "@/app/(afterLogin)/messages/_component/Room";
import {Metadata} from "next";
import {getRooms} from "@/app/(afterLogin)/messages/_lib/getRooms";
import {auth} from "@/auth";
import WebSocketComponent from "@/app/(afterLogin)/messages/_component/WebSocketComponent";
import React from "react";
import {QueryClient} from "@tanstack/react-query";
import Rooms from "@/app/(afterLogin)/messages/_component/Rooms";
import {getRoomsServer} from "@/app/(afterLogin)/messages/_lib/getRoomsServer";

export const metadata: Metadata = {
  title: '쪽지 / Z',
  description: '쪽지를 보내보세요.',
}

export default async function Home() {
  const session = await auth();
  const queryClient = new QueryClient();
  if (!session?.user?.email) {
    return null;
  }
  await queryClient.prefetchQuery({
    queryKey: ['rooms', session?.user?.email],
    queryFn: getRoomsServer,
  })
  return (
    <main className={style.main}>
      <WebSocketComponent id={session.user.email}/>
      <div className={style.header}>
        <h3>쪽지</h3>
      </div>
      <Rooms id={session.user.email}/>
    </main>
  )
}
