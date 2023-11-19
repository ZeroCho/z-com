"use client";

import {ChangeEventHandler, FormEvent, useRef, useState} from "react";
import style from './commentForm.module.css';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import {Post} from "@/model/Post";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  id: string;
}
export default function CommentForm({ id }: Props) {
  const [content, setContent] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);
  const { data: me } = useSession();
  const [preview, setPreview] = useState<Array<{ dataUrl: string, file: File } | null>>([]);

  const mutation = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('content', content);
      preview.forEach((p) => {
        p && formData.append('images', p.file);
      })
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments`, {
        method: 'post',
        credentials: 'include',
        body: formData,
      });
    },
    async onSuccess(response, variable) {
      const newPost = await response.json();
      setContent('');
      setPreview([]);
      if (queryClient.getQueryData(['posts', id.toString(), "comments"])) {
        queryClient.setQueryData(['posts', id.toString(), "comments"], (prevData: { pages: Post[][] }) => {
          const shallow = {
            ...prevData,
            pages: [...prevData.pages],
          };
          shallow.pages[0] = [...shallow.pages[0]];
          shallow.pages[0].unshift(newPost);
          return shallow;
        });
      }
    },
    onError(error) {
      console.error(error);
      alert('업로드 중 에러가 발생했습니다.');
    }
  })

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  }

  const onClickButton = () => {
    imageRef.current?.click();
  }

  const onRemoveImage = (index: number) => () => {
    setPreview((prevPreview) => {
      const prev = [...prevPreview];
      prev[index] = null;
      return prev;
    })
  };

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

  const queryClient = useQueryClient();
  const post = queryClient.getQueryData(['posts', id]);
  console.log('post', id);
  if (!post) {
    return null;
  }
  return (
    <form className={style.postForm} onSubmit={mutation.mutate}>
      <div className={style.postUserSection}>
        <div className={style.postUserImage}>
          <img src={me?.user?.image as string} alt={me?.user?.email as string}/>
        </div>
      </div>
      <div className={style.postInputSection}>
        <TextareaAutosize value={content} onChange={onChange} placeholder="답글 게시하기"/>
        <div style={{ display: 'flex' }}>
          {preview.map((v, index) => (
            v && (<div key={index} style={{ flex: 1 }} onClick={onRemoveImage(index)}>
              <img src={v.dataUrl} alt="미리보기" style={{ width: '100%', objectFit: 'contain', maxHeight: 100 }} />
            </div>)
          ))}
        </div>
        <div className={style.postButtonSection}>
          <div className={style.footerButtons}>
            <div className={style.footerButtonLeft}>
              <input type="file" name="imageFiles" multiple hidden ref={imageRef} onChange={onUpload}/>
              <button className={style.uploadButton} type="button" onClick={onClickButton}>
                <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path
                      d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                  </g>
                </svg>
              </button>
            </div>
            <button className={style.actionButton} disabled={!content}>답글</button>
          </div>
        </div>
      </div>
    </form>
  );
}
