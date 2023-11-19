"use client";

import style from './modal.module.css';
import {ChangeEventHandler, FormEvent, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Post} from "@/model/Post";

export default function TweetModal() {
  const [content, setContent] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Array<{ dataUrl: string, file: File } | null>>([]);
  const {data: me} = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('content', content);
      preview.forEach((p) => {
        p && formData.append('images', p.file);
      })
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        method: 'post',
        credentials: 'include',
        body: formData,
      });
    },
    async onSuccess(response, variable) {
      const newPost = await response.json();
      setContent('');
      setPreview([]);
      if (queryClient.getQueryData(['posts', 'recommends'])) {
        queryClient.setQueryData(['posts', 'recommends'], (prevData: { pages: Post[][] }) => {
          const shallow = {
            ...prevData,
            pages: [...prevData.pages],
          };
          shallow.pages[0] = [...shallow.pages[0]];
          shallow.pages[0].unshift(newPost);
          return shallow;
        });
      }
      if (queryClient.getQueryData(['posts', 'followings'])) {
        queryClient.setQueryData(['posts', 'followings'], (prevData: { pages: Post[][] }) => {
          const shallow = {
            ...prevData,
            pages: [...prevData.pages],
          };
          shallow.pages[0] = [...shallow.pages[0]];
          shallow.pages[0].unshift(newPost);
          return shallow;
        })
      }
      await queryClient.invalidateQueries({
        queryKey: ["trends"]
      })
      router.back();
    },
    onError(error) {
      console.error(error);
      alert('업로드 중 에러가 발생했습니다.');
    }
  })

  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    if (e.target.files) {
      Array.from(e.target.files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview((prevPreview) => {
            const prev = [...prevPreview];
            prev[index] = {
              dataUrl: reader.result as string,
              file,
            };
            return prev;
          })
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const onClickClose = () => {
    router.back();
  }
  const onClickButton = () => {
    imageRef.current?.click();
  }
  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  }

  const onRemoveImage = (index: number) => () => {
    setPreview((prevPreview) => {
      const prev = [...prevPreview];
      prev[index] = null;
      return prev;
    })
  };

  return (
    <div className={style.modalBackground}>
      <div className={style.modal}>
        <button className={style.closeButton} onClick={onClickClose}>
          <svg width={24} viewBox="0 0 24 24" aria-hidden="true"
               className="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03">
            <g>
              <path
                d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
            </g>
          </svg>
        </button>
        <form className={style.modalForm} onSubmit={mutation.mutate}>
          <div className={style.modalBody}>
            <div className={style.postUserSection}>
              <div className={style.postUserImage}>
                <img src={me?.user?.image as string} alt={me?.user?.email as string}/>
              </div>
            </div>
            <div className={style.inputDiv}>
              <TextareaAutosize className={style.input} placeholder="무슨 일이 일어나고 있나요?"
                                value={content}
                                onChange={onChange}
              />
              <div style={{ display: 'flex' }}>
                {preview.map((v, index) => (
                  v && (<div key={index} style={{ flex: 1 }} onClick={onRemoveImage(index)}>
                    <img src={v.dataUrl} alt="미리보기" style={{ width: '100%', objectFit: 'contain', maxHeight: 100 }} />
                  </div>)
                ))}
              </div>
            </div>
          </div>
          <div className={style.modalFooter}>
            <div className={style.modalDivider}/>
            <div className={style.footerButtons}>
              <div className={style.footerButtonLeft}>
                <input type="file" name="imageFiles" multiple hidden ref={imageRef} onChange={onUpload} />
                <button className={style.uploadButton} type="button" onClick={onClickButton}>
                  <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path
                        d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                    </g>
                  </svg>
                </button>
              </div>
              <button className={style.actionButton} disabled={!content}>게시하기</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}