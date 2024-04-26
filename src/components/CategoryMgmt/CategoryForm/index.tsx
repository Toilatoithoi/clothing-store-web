import CategoryPicker from '@/components/CategoryPicker';
import Combobox from '@/components/Combobox';
import Dropdown from '@/components/Dropdown';
import Loader from '@/components/Loader';
import TextInput from '@/components/TextInput'
import { METHOD } from '@/constants';
import { useMutation } from '@/store/custom';
import { isBlank, uuid } from '@/utils';
import { Formik } from 'formik'
import React, { useRef } from 'react';
import * as yup from 'yup';

type Props = {
  onClose(): void;
  onRefresh(): void;
  data?: any;
}
interface ICategoryValues {
  name?: string;
  level?: string;
  parent_id?: string;
}

const CategoryForm = (props: Props) => {
  const componentId = useRef(uuid())
  const { trigger } = useMutation('/api/category', {
    method: METHOD.POST,
    loading: true,
    url: '/api/category',
    notification: {
      title: 'Tạo danh mục',
      content: 'Tạo danh mục thành công'
    },
    componentId: componentId.current,
    onSuccess() {
      props.onClose();
      props.onRefresh();
    }
  })

  const { trigger: updateCategory } = useMutation(`/api/category/${props.data?.id}`, {
    method: METHOD.PUT,
    loading: true,
    url: `/api/category/${props.data?.id}`,
    notification: {
      title: 'Cập nhật danh mục',
      content: 'Cập nhật danh mục thành công'
    },
    componentId: componentId.current,
    onSuccess() {
      props.onClose();
      props.onRefresh();
    }
  })

  const submit = (values: ICategoryValues) => {
    if (props.data) {
      updateCategory({ ...values })
    } else {
      trigger({ ...values, level: Number(values.level) })
    }
  }

  const schema = yup.object().shape({
    name: yup.string().label('Tên').required(),
    level: yup.string().label('Cấp').required(),
  })

  return (
    <Loader id={componentId.current} className='w-screen max-w-screen-sm'>
      <div className='font-bold mb-[2.4rem]'>{props.data ? 'Chỉnh sửa danh mục' : 'Tạo danh mục'}</div>
      <Formik
        onSubmit={submit}
        validationSchema={schema}
        initialValues={props.data ?? { name: '' } as ICategoryValues}
      >
        {({ values, handleBlur, handleChange, errors, touched, setFieldValue, handleSubmit, isValid }) =>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextInput
              label='Tên danh mục'
              name='name'
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.name}
              hasError={touched && !isBlank(errors.name)}
            />
            <Dropdown
              label='Cấp'
              options={[
                {
                  label: 'cấp 1',
                  value: 1
                },
                {
                  label: 'cấp 2',
                  value: 2
                },
              ]}
              selected={values.level}
              onChange={(value) => setFieldValue('level', value)}
              errorMessage={errors.level}
              hasError={touched && !isBlank(errors.level)}
            />

            {String(values.level) === '2' && <CategoryPicker
              label='Danh mục cha'
              level='1'
              selected={values.parent_id}
              onChange={(value) => setFieldValue('parent_id', value)}
            />}

            <div className="flex gap-2">
              <button type="button" className='btn flex-1' onClick={props.onClose}>Hủy</button>
              <button disabled={!isValid} type="submit" className='btn-primary flex-1'>Xác nhận</button>
            </div>
          </form>}
      </Formik>
    </Loader>
  )
}

export default CategoryForm