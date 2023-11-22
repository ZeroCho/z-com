"use client";

import Link from "next/link";
import style from './trend.module.css';
import {Hashtag} from "@/model/Hashtag";
import {useSearchParams} from "next/navigation";

type Prop = { trend: Hashtag };
export default function Trend({ trend }: Prop) {
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set('q', trend.title);

  return (
    <Link href={`/search?${newSearchParams.toString()}`} className={style.container}>
      <div className={style.count}>실시간트렌드</div>
      <div className={style.title}>{trend.title}</div>
      <div className={style.count}>{trend.count.toLocaleString()} posts</div>
    </Link>
  )
}