"use client";

import useSocket from "@/app/(afterLogin)/messages/[room]/_lib/useSocket";
import {useEffect} from "react";
import {InfiniteData, useQueryClient} from "@tanstack/react-query";
import {Message} from "@/model/Message";
import {useSession} from "next-auth/react";
import {Room} from "@/model/Room";
import {da} from "@faker-js/faker";

export default function WebSocketComponent({id}: { id: string }) {
  const { data: session } = useSession();
  const [socket] = useSocket();
  const queryClient = useQueryClient();
  useEffect(() => {
    socket?.on('receiveMessage', (data) => {
      console.log('data', data);
      // 리액트 쿼리 데이터에 추가
      const exRooms = queryClient.getQueryData(['rooms', id]) as Room[];
      const index = exRooms.findIndex((room) => room.room === data.room);
      const newRooms = [...exRooms];
      if (index > -1) {
        newRooms[index] = {
          ...newRooms[index],
          createdAt: data.createdAt,
          content: data.content,
        }
      } else {
        newRooms.push(data);
      }
      queryClient.setQueryData(['rooms', id], newRooms);
    });
    return () => {
      socket?.off('receiveMessage');
    }
  }, [socket]);

  return null;
}