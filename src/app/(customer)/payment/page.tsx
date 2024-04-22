
'use client'
import React, { useEffect, useRef, useState } from 'react';
import Right from "@/assets/svg/chevron-right.svg"
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import TextInput from '@/components/TextInput';
import { formatNumber, isBlank, uuid } from '@/utils';
import Combobox, { ComboboxOption } from '@/components/Combobox';
import { ProductCart, useBill, useCart, useUser } from '@/components/CartDropdown/hook';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

interface PaymentForm {
  name: string;
  email: string;
  phone: string;
  // ? là có hoặc không cũng được
  city?: string;
  district?: string;
  wards?: string;
  address?: string;
  note?: string;
  productCart: ProductCart[];
}

interface Wards {
  Id: string;
  Name: string;
}


interface Districts {
  Id: string;
  Name: string;
  Wards: Wards[]
}

interface AddressResponse {
  Name: string;
  Id: string;
  Districts: Districts[]
}

const Payment = () => {
  const componentId = useRef(uuid())
  // tạo ra 3 state đại diện cho city, district, wards
  // nếu [] sẽ là mảng kiểu never chưa xác định mảng kiểu gì
  //<Kiểu mảng>[]
  // khi có data trả về thì nó sẽ formRef setvalue cho formit
  const router = useRouter();
  const formRef = useRef<FormikProps<PaymentForm>>()
  // lí do phải cho data vào initialValues vì initialValues chỉ nhận data lần đầu tiên còn ví dụ truyền state vào khi state update nó cũng không ăn
  const { addToCart, data: getCart, isLoading, mutate, updateCart } = useCart()
  const { addToBill } = useBill({
    componentId: componentId.current,
    onCreateSuccess: (data: Record<string, string>) => {
      // TODO: redirect  qua màn bill detail
      router.push(`/list-bill/${data.id}`)
      // clear cart -> call api clear cart
      mutate() // -> muate key /api/cart  để useSWR query lại api/cart
    }
  })
  const [summary, setSummary] = useState({ totalPrice: 0, totalQuantity: 0 });

  const { data: getUser } = useUser({})

  useEffect(() => {
    // [] để chỉ chạy 1 lần đầu tiên 
    getAddressOptions();
  }, [])
  useEffect(() => {
    // [] để chỉ chạy 1 lần đầu tiên 
    if (getCart && getUser) {
      // reduce là một phương thức của JavaScript được sử dụng để tính toán một giá trị duy nhất từ các phần tử của mảng
      // acc tham số này là giá trị tích lũy, nghĩa là giá trị tạm tính tính đến thời điểm hiện tại trong quá trình duyệt qua mảng
      // item tham số này là phần tử hiện tại trong mảng, trong trường hợp này là một đối tượng sản phẩm
      const summaryQty = getCart.reduce((acc, item) => ({
        totalPrice: acc.totalPrice + item.quantity * item.price,
        totalQuantity: acc.totalQuantity + item.quantity,
      }), { totalPrice: 0, totalQuantity: 0 });
      setSummary(summaryQty)
      // setValue cho formik
      formRef.current?.setValues({
        ...formRef.current.values,
        productCart: getCart,
        email: getUser?.username,
        phone: getUser?.phoneNumber,
        name: getUser?.name
      })
    }
  }, [getCart, getUser])
  // giá trị
  // const [email, setEmail] = useState('')
  // lỗi
  // const [errorEmail, setErrorEmail] = useState('')
  // chạm vào thanh input kết thúc
  // không thể để touchEmail = true ban đầu do nếu làm thế thì khi vừa mới hiện lên đã báo lỗi người dùng chưa gõ xong thì không nên hển thị thông báo lỗi
  // const [touchEmail, setTouchEmail] = useState(false)
  // biến regEx kiểm tra phone
  // phải có / / ở đầu và cuối
  // const phone_check = /^\+(?:[0-9] ?){6,14}[0-9]$/
  // mảng len dependacies
  // nêu rỗng thì chỉ trả về 1 lần đầu tiên
  // còn không sẽ trả về các lần giá trị trong mảng thay đổi
  // khi email thay đổi sẽ gọi hàm console.log(email)
  const getAddressOptions = async () => {
    try {
      // public/address.json
      const res = await fetch('/address.json');
      const data: AddressResponse[] = await res.json();
      const cityOptions: ComboboxOption[] = [];
      const districtsOptions: Record<string, ComboboxOption[]> = {}
      const wardsOptions: Record<string, ComboboxOption[]> = {}

      // nếu không dùng map lại thì mỗi lần tìm kiếm sẽ là 1 vòng ỏ qua tất cả dữ liệu
      // khi map lại sẽ tìm thông qua value
      data.forEach((city) => {
        cityOptions.push({ label: city.Name, value: city.Id })
        city.Districts.forEach(district => {
          // nếu district null thì sẽ lấy [] 
          // concat để nối 2 array 
          districtsOptions[city.Id] = (districtsOptions[city.Id] ?? []).concat([{
            label: district.Name,
            value: district.Id,
          }])
          wardsOptions[district.Id] = district.Wards.map(ward => ({ label: ward.Name, value: ward.Id }))
        })
      })


      // setCityOptions(cityOptions);
      // setDistrictsOptions(districtsOptions);
      // setWardsOptions(wardsOptions);


    } catch (error) {
      console.log(error)
    }
  }

  const handlePayment = (values: PaymentForm) => {
    // clg viết tắt 
    addToBill(values)
    // call api với values
  }

  const schema = yup.object().shape({
    // thư viện yup 
    // check rỗng
    name: yup.string().label('Họ và tên').required(),
    // rỗng và email
    email: yup.string().label('Email').required().email('Email không hợp lệ'),
    // rỗng và khớp với kiểu sđt
    phone: yup.string().label('Số điện thoại').required().matches(/^(?:[0-9] ?){6,14}[0-9]$/, 'Số điện thoại không hợp lệ'),
    city: yup.string().label('Tỉnh/Thành phố').required(),
    district: yup.string().label('Quận/huyện').required(),
    wards: yup.string().label('Phường/xã').required(),
    address: yup.string().label('Địa chỉ').required(),
  })
  return (
    <Loader id={componentId.current} loading={isLoading} >
      <div className='flex items-center justify-center my-[3.2rem]'>
        <div>Giỏ hàng</div><Right />
        <div className='font-bold'>Thanh toán</div><Right />
        <div>Hoàn tất</div>
      </div>
      <Formik
        innerRef={(instance) => formRef.current = instance!}
        // giá trị khởi tạo ban đầu
        initialValues={{
          // chú ý cái tên trong initialValues phải giống kiểu và tên với values trong handlePayment do trong onSubmit
          name: getUser?.name || '',
          email: getUser?.username || '',
          phone: getUser?.phoneNumber || '',
          productCart: getCart || [],
        }}

        validationSchema={schema}
        // hàm sẽ được gọi khi submit
        onSubmit={handlePayment}
      >
        {({ values, touched, errors, handleSubmit, handleBlur, handleChange, isValid, setFieldValue }) => { // handleSubmit -> check isValid = true ? onSubmit(): null
          // children hàm số trả về jsx là 1 component
          // value sẽ là state tổng chứa giá trị của cả form name, email
          return <form className='w-full' onSubmit={handleSubmit}>
            <div className='flex w-full gap-[3.2rem]'>
              {/* dùng grid chia làm 5 cột */}
              {/* box-sizing là tổng chiều dài của phần tử có tính thêm border, padding hay không */}
              <div className='bg-[#f7f8fa] flex-1 p-[3rem]  h-fit gap-4'>
                <div className='font-bold mb-[1.6rem] text-[1.8rem]'>ĐỊA CHỈ GIAO HÀNG</div>
                <div className='list-input grid grid-cols-2 gap-x-[2.4rem] gap-y-[1.6rem]'>
                  {/* valuedate form */}
                  {/* value theo PaymentForm */}
                  <TextInput
                    name='name'
                    // gán giá trị có textInput
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={touched.name && !isBlank(errors.name)}
                    errorMessage={errors.name}
                    placeholder='Họ và tên của bạn'
                    className='col-span-2'
                    label="Họ và tên" />
                  <TextInput
                    name='phone'
                    // gán giá trị có textInput
                    value={values.phone}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={touched.phone && !isBlank(errors.phone)}
                    errorMessage={errors.phone}
                    placeholder='Số điện thoại của bạn'
                    label="Số điện thoại" />
                  <TextInput
                    // gán giá trị cho textInput
                    name='email'
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={touched.email && !isBlank(errors.email)}
                    errorMessage={errors.email}
                    placeholder='Email của bạn'
                    label="Email" />

                  <TextInput
                    name='city'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.city}
                    hasError={touched.city && !isBlank(errors.city)}
                    errorMessage={errors.city}
                    placeholder='Tỉnh/Thành phố'
                    label="Tỉnh/Thành phố" />
                  <TextInput
                    name='district'
                    value={values.district}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={touched.district && !isBlank(errors.district)}
                    errorMessage={errors.district}
                    placeholder='Quận/huyện'
                    label="Quận/huyện" />
                  <TextInput
                    name='wards'
                    onBlur={handleBlur}
                    value={values.wards}
                    onChange={handleChange}
                    hasError={touched.wards && !isBlank(errors.wards)}
                    errorMessage={errors.wards}
                    placeholder='Phường/xã'
                    label="Phường/xã" />
                  {/* <Combobox
                    options={cityOptions}
                    label='Tỉnh/thành phố'
                    selected={values.city}
                    onChange={(option) => {
                      setFieldValue('city', option.value);
                    }}
                    hasError={touched.city && !isBlank(errors.city)}
                    errorMessage={errors.city}
                  />
                  <Combobox
                    options={districtsOptions[values.city ?? ''] ?? []}
                    // ?? là nếu null thì sẽ truyền cái đường sau thay thế không phải boolean
                    // || sẽ lấy cả null và boolean nghĩa là cái dk1 false thì sẽ lấy cái phía sau
                    // ? : là if else
                    label='Quận/huyện'
                    selected={values.district}
                    onChange={(option) => {
                      setFieldValue('district', option?.value);
                    }}
                    hasError={touched.district && !isBlank(errors.district)}
                    errorMessage={errors.district}
                  />
                  <Combobox
                    options={wardsOptions[values.district ?? ''] ?? []}
                    label='Phường/xã'
                    selected={values.wards}
                    onChange={(option) => {
                      setFieldValue('wards', option?.value);
                    }}
                    hasError={touched.wards && !isBlank(errors.wards)}
                    errorMessage={errors.wards}
                  /> */}

                  <TextInput
                    name='address'
                    value={values.address}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={touched.address && !isBlank(errors.address)}
                    errorMessage={errors.address}
                    placeholder='Ví dụ Số 20, ngõ 20'
                    label="Địa chỉ" />
                  <TextInput
                    name='note'
                    value={values.note}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder='Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.'
                    className='col-span-2'
                    type='textarea'
                    rows={5}
                    label="Ghi chú đơn hàng (tuỳ chọn)" />
                </div>
              </div>
              <div className='bg-[#f7f8fa] w-[40rem]  p-[3rem] border border-gray-950'>
                <div className="font-bold text-[1.8rem]">ĐƠN HÀNG CỦA BẠN</div>
                <div className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                  <div className="font-bold uppercase">SẢN PHẨM</div>
                  <div className="font-bold uppercase">Tạm tính</div>
                </div>
                {/* <div className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                  <div>
                    <div className="font-bold">Áo nỉ nam ANHTK409  × 1</div>
                    <div>Màu sắc: Đen Cỡ:S</div>
                  </div>
                  <div>399.000 VND</div>
                </div> */}
                {/* <div className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                  <div className="font-bold">Tạm tính</div>
                  <div>399.000 VND</div>
                </div>
                <div className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                  <div className="font-bold">Tổng</div>
                  <div className="font-bold">399.000 VND</div>
                </div> */}
                {
                  values.productCart.map((item, idx) => (
                    <>
                      <div key={idx + values.productCart.length} className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                        <div>
                          <div className="font-bold">{item.product.name} X {item.quantity}</div>
                          <div>{item.color} : {item.size}</div>
                        </div>
                        <div className='text-[1.3rem] font-bold'>{formatNumber(item.price * item.quantity)} VND</div>
                      </div>
                    </>
                  ))
                }
                <div className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                  <div className="font-bold">Tạm tính</div>
                  <div>{formatNumber(summary.totalPrice)} VND</div>
                </div>
                <div className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                  <div className="font-bold">Tổng</div>
                  <div className="font-bold">{formatNumber(summary.totalPrice)} VND</div>
                </div>
                <div className='font-semibold text-[1.4rem] mt-[1.6rem]'>Trả tiền mặt khi nhận hàng</div>
                <div className='mb-[0.8rem] text-[1.4rem]'>Trả tiền mặt khi giao hàng</div>
                {/* Khi không valid thì nút đặt hàng sẽ bị làm mờ  */}
                {/* {JSON.stringify(errors)} */}
                <button disabled={!isValid || summary.totalPrice <=0} type="submit" className='bg-black disabled:opacity-[0.5] text-white uppercase px-[1.6rem] h-[4rem] flex items-center font-bold'>Đặt hàng</button>
              </div>
            </div>
          </form>
        }}
      </Formik>
    </Loader>
  )
}

export default Payment