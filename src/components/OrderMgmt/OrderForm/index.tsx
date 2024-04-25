import CategoryPicker from '@/components/CategoryPicker';
import Combobox from '@/components/Combobox';
import Dropdown from '@/components/Dropdown';
import Loader from '@/components/Loader';
import TextInput from '@/components/TextInput';
import { METHOD, ORDER_STATUS } from '@/constants';
import { useMutation } from '@/store/custom';
import { useUserInfo } from '@/store/globalSWR';
import { isBlank, uuid } from '@/utils';
import { Formik } from 'formik';
import React, { useRef } from 'react';
import * as yup from 'yup';
import { ROLES } from '@/constants';
type Props = {
  onClose(): void;
  onRefresh(): void;
  data?: any;
  isCusomer?: boolean;
};
interface IOrderValues {
  status?: string;
  reason?: string;
}

const OrderForm = (props: Props) => {
  const componentId = useRef(uuid());
  const { data: userInfo } = useUserInfo();
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
  });

  return (
    <Loader id={componentId.current} className="w-screen max-w-screen-sm">
      <div className="font-bold mb-[2.4rem]">
        {
          userInfo &&  userInfo.role == ROLES.ADMIN ?
          'Cập nhật đơn hàng'
          : 'Huỷ đơn hàng'
        }
      </div>
      <Formik
        onSubmit={submit}
        // validationSchema={schema}
        initialValues={
        props.isCusomer?({ status: ORDER_STATUS.CANCELED, reason: '' } as IOrderValues) :  props.data  
        }
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
          userInfo && <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {
            userInfo.role !== ROLES.ADMIN?
            <Dropdown
              label="Trạng thái"
              options={[ 
                {
                  label: 'Đã hủy',
                  value: ORDER_STATUS.CANCELED,
                },
              ]}
              selected={ ORDER_STATUS.CANCELED }
              onChange={() => setFieldValue('status', ORDER_STATUS.CANCELED,)}
              errorMessage={errors.status}
              hasError={touched && !isBlank(errors.status)}
            />:
            <Dropdown
              label="Trạng thái"
              options={[
                {
                  label: 'Chờ xác nhận',
                  value: ORDER_STATUS.NEW,
                  // disabled: true,
                },
                {
                  label: 'Đã xác nhận',
                  value: ORDER_STATUS.CONFIRM,
                },
                {
                  label: 'Từ chối',
                  value: ORDER_STATUS.REJECT,
                },
                {
                  label: 'Đang vận chuyển',
                  value: ORDER_STATUS.TRANSPORTED,
                },
                {
                  label: 'Giao hàng thành công',
                  value: ORDER_STATUS.SUCCESS,
                },
                {
                  label: 'Giao hàng thất bại',
                  value: ORDER_STATUS.FAILED,
                }, 
                {
                  label: 'Đã hủy',
                  value: ORDER_STATUS.CANCELED,
                },  
                {
                  label: 'Yêu cầu hủy',
                  value: ORDER_STATUS.REQUEST_CANCEL,
                  // disabled: true,
                },      
              ]}
              selected={values.status}
              onChange={(value) => setFieldValue('status', value)}
              errorMessage={errors.status}
              hasError={touched && !isBlank(errors.status)}
            />
            }
            
            <TextInput
              label="Lý do"
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
              <button disabled={!isValid} type="submit" className="btn-primary flex-1">
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
