import Home from "@/app/(afterLogin)/home/page";
import PhotoModal from "@/app/(afterLogin)/@modal/(.)[username]/status/[id]/photo/[photoId]/page";

type Props = {
  params: { username: string, id: string, photoId: string }
}
export default function Page({params}: Props) {
  params.username // elonmusk
  params.id // 1
  params.photoId // 1
  return (
    <>
      <Home/>
      <PhotoModal params={params}/>
    </>
  )
}