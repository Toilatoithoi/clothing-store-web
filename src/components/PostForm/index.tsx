import { isBlank, uuid } from '@/utils';
import React, { useRef, useState } from 'react';
import CategoryPicker from '../CategoryPicker';
import { Formik } from 'formik';
import TextInput from '../TextInput';
import Dropdown from '../Dropdown';
import Close from '@/assets/svg/x-circle.svg';
import * as yup from 'yup';
const Editor = dynamic(() => import('../Editor'), {ssr: false});
import FieldContainer from '../FieldContainer';
import dynamic from 'next/dynamic';
import ImageUploader from '../ImageUploader';
import { CreatePostReq, CreateProductReq, ProductModelReq } from '@/interfaces/request';
import { PostRes, ProductDetail, ProductModel } from '@/interfaces/model';
import { uploadFile } from '@/utils/fetcher';
import { METHOD } from '@/constants';
import { useMutation, useSWRWrapper } from '@/store/custom';
import Loader from '../Loader';
import { formatDateToString } from '@/utils/datetime';

type Props = {
  onClose(): void;
  onRefresh(): void;
  data?: Record<string, unknown>;
};

interface PostValues {
  title: string;
  content?: string;
  sapo?: string;
  createAt?: string;
  fileConfig?: Record<string, string>;
}

const PostForm = (props: Props) => {
  const componentId = useRef(uuid());
  const [loading, setLoading] = useState(false);
  const { data: post, isLoading } = useSWRWrapper<PostRes>(
    props.data ? `/api/post/${props.data?.id}` : null,
    {
      url: `/api/post/${props.data?.id}`,
    }
  );

  const { trigger: createPost } = useMutation('/api/post', {
    method: METHOD.POST,
    loading: true,
    url: '/api/post',
    notification: {
      title: 'Tạo bài viết',
      content: 'Tạo bài viết thành công',
    },
    componentId: componentId.current,
    onSuccess() {
      props.onClose();
      props.onRefresh();
      setLoading(false);
    },
    onError() {
      setLoading(false);
    },
  });

  const { trigger: updatePost } = useMutation(
    `/api/post/${props.data?.id}`,
    {
      method: METHOD.PUT,
      loading: true,
      url: `/api/post/${props.data?.id}`,
      notification: {
        title: 'Cập nhật bài viết',
        content: 'Cập nhật bài viết thành công',
      },
      componentId: componentId.current,
      onSuccess() {
        props.onClose();
        props.onRefresh();
        setLoading(false);
      },
      onError() {
        setLoading(false);
      },
    }
  );

  const submit = async (values: PostValues) => {
    if (values) {
      setLoading(true);
      let image = '';
      if (values.fileConfig) {
        const key = 'image'; // Sử dụng một key cố định cho ảnh
        const file = values.fileConfig[key];
        if (file && !(typeof file === 'string')) {
          try {
            const res = await uploadFile(file);
            image = res.url as string;
          } catch (error) {
            // Xử lý lỗi khi tải lên ảnh
          }
        } else if (typeof file === 'string') {
          image = file;
        }
      }


      const postload: CreatePostReq = {
        title: values.title,
        content: values.content,
        sapo: values.sapo,
        image: image,
      };

      if (props.data) {
        updatePost({ ...postload });
      } else {
        createPost({ ...postload });
      }
      console.log({ postload });
    }
    console.log({ values })
  };

  const schema = yup.object().shape({
    title: yup.string().label('Tiêu đề').required(),
  });

  const getInitialValues = (post?: PostRes): PostValues => {
    if (post) {
      const values: PostValues = {
        title: post.title,
        content: post.content,
        sapo: post.sapo,
        fileConfig: post.image ? { image: post.image } : undefined
      };

      return values;
    }

    return {
      title: '',
      content: '',
      createAt: '',
      sapo: '',
      fileConfig: {},
    };
  };

  return (
    <Loader loading={loading} className="w-screen max-w-screen-md product-form">
      <div className="font-bold mb-[2.4rem]"> {props.data ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}</div>
      <div className="max-h-[80vh] overflow-y-auto p-2">
        {props.data && isLoading ? (
          <div>Đang tải dữ liệu</div>
        ) : (
          <Formik
            onSubmit={submit}
            // validationSchema={schema}
            initialValues={getInitialValues(post)}
            validationSchema={schema}
          >
            {({
              values,
              handleBlur,
              handleChange,
              errors,
              touched,
              setFieldValue,
              handleSubmit,
              isValid
            }) => (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className='w-full'>
                  <ImageUploader
                    aspectRatio='16/9'
                    label="Ảnh bìa"
                    initImage={values.fileConfig && typeof values.fileConfig.image === 'string' ? values.fileConfig.image : null}
                    onChange={(file) => setFieldValue('fileConfig', { ...values.fileConfig, image: file })}
                  />
                </div>
                <div className='flex gap-4'>
                  <TextInput
                    label="Tiêu đề"
                    name="title"
                    className="flex-1"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errorMessage={errors.title}
                    hasError={touched && !isBlank(errors.title)}
                  />
                </div>
                <FieldContainer label="Tóm tắt" className="col-span-2">
                  <Editor data={values.sapo} onChange={(data) => setFieldValue('sapo', data)} />
                </FieldContainer>
                <FieldContainer label="Nội dung" className="col-span-2">
                  <Editor data={values.content} onChange={(data) => setFieldValue('content', data)} />
                </FieldContainer>
                <div className="flex gap-2 col-span-2 mt-[5rem]">
                  <button
                    type="button"
                    className="btn flex-1"
                    onClick={props.onClose}
                  >
                    Hủy
                  </button>
                  <button disabled={!isValid} type="submit" className="btn-primary flex-1">
                    Xác nhận
                  </button>
                </div>
              </form>
            )}
          </Formik>
        )}
      </div>
    </Loader>
  );
};

export default PostForm;
