"use client";

import React from "react";
import {useQuery} from "@tanstack/react-query";
import Room from "@/app/(afterLogin)/messages/_component/Room";
import {getRooms} from "@/app/(afterLogin)/messages/_lib/getRooms";

export default function Rooms({id}: { id: string }) {
  const {data: rooms, isPending} = useQuery({
    queryKey: ['rooms', id],
    queryFn: getRooms,
  })
  if (isPending) {
    return <div style={{display: 'flex', justifyContent: 'center'}}>
      로딩중...</div>;
  }
  if (!rooms?.length) {
    return <div style={{display: 'flex', justifyContent: 'center'}}>
      다른 사람의 프로필에서 쪽지를 보낼 수 있습니다.</div>;
  }
  return (
    rooms.map((room) => (
      <Room key={room.room} room={room}/>
    ))
  )
}