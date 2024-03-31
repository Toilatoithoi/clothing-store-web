import CategoryPicker from '@/components/CategoryPicker';
import Combobox from '@/components/Combobox';
import Dropdown from '@/components/Dropdown';
import Loader from '@/components/Loader';
import TextInput from '@/components/TextInput';
import { METHOD, ORDER_STATUS } from '@/constants';
import { useMutation } from '@/store/custom';
import { isBlank, uuid } from '@/utils';
import { Formik } from 'formik';
import React, { useRef } from 'react';
import * as yup from 'yup';

type Props = {
  onClose(): void;
  onRefresh(): void;
  data?: any;
};
interface IOrderValues {
  status?: string;
  reason?: string;
}

const OrderForm = (props: Props) => {
  const componentId = useRef(uuid());
  const { trigger } = useMutation(`/api/bill/${props.data.id}`, {
    method: METHOD.PUT,
    loading: true,
    url: `/api/bill/${props.data.id}`,
    notification: {
      title: 'Cập nhật đơn hàng',
      content: 'Cập nhật đơn hàng thành công',
    },
    componentId: componentId.current,
    onSuccess() {
      props.onClose();
      props.onRefresh();
    },
  });

  const submit = (values: IOrderValues) => {
    trigger({ ...values });
  };

  const schema = yup.object().shape({
    status: yup.string().label('Trạng thái').required(),
    reason: yup.string().label('Note').required(),
  });

  return (
    <Loader id={componentId.current} className="w-screen max-w-screen-sm">
      <div className="font-bold mb-[2.4rem]">Cập nhật đơn hàng</div>
      <Formik
        onSubmit={submit}
        validationSchema={schema}
        initialValues={
          props.data ?? ({ status: '', reason: '' } as IOrderValues)
        }
      >
        {({
          values,
          handleBlur,
          handleChange,
          errors,
          touched,
          setFieldValue,
          handleSubmit,
        }) => (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Dropdown
              label="Trạng thái"
              options={[
                {
                  label: 'Mơi tạo',
                  value: ORDER_STATUS.NEW,
                  disabled: true,
                },
                {
                  label: 'Đã hủy',
                  value: ORDER_STATUS.CANCELED,
                },
                {
                  label: 'Xác nhận',
                  value: ORDER_STATUS.CONFIRM,
                },
                {
                  label: 'Thất bại',
                  value: ORDER_STATUS.FAILED,
                },
                {
                  label: 'Từ chối',
                  value: ORDER_STATUS.REJECT,
                },
                {
                  label: 'Yêu cầu hủy',
                  value: ORDER_STATUS.REQUEST_CANCEL,
                  disabled: true,
                },
                {
                  label: 'Thành công',
                  value: ORDER_STATUS.SUCCESS,
                },
                {
                  label: 'Đang vận chuyển',
                  value: ORDER_STATUS.TRANSPORTED,
                },
              ]}
              selected={values.status}
              onChange={(value) => setFieldValue('status', value)}
              errorMessage={errors.status}
              hasError={touched && !isBlank(errors.status)}
            />
            <TextInput
              label="Ghi chú"
              name="reason"
              type="textarea"
              value={values.reason}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.reason}
              hasError={touched && !isBlank(errors.reason)}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="btn flex-1"
                onClick={props.onClose}
              >
                Hủy
              </button>
              <button type="submit" className="btn-primary flex-1">
                Xác nhận
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default OrderForm;
