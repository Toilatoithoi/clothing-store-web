// tsrafce
'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import anh1 from '@/assets/png/info-bia.jpg'
import anh2 from '@/assets/png/info-giua.jpg'
import { isBlank } from '@/utils'
import Combobox, { ComboboxOption } from '@/components/Combobox';
import * as yup from 'yup'
import { Formik, Field, Form } from 'formik';
import { useMemo } from "react";
// import { GoogleMap, InfoWindow, useJsApiLoader, useLoadScript, Marker, LoadScript } from "@react-google-maps/api";
// import Map from '@/components/Map'

interface AboutShopForm {
  // ? là có hoặc không cũng được
  city?: string;
  district?: string;
}


interface Districts {
  Name: string;
  Id: string;
}

interface AddressRespone {
  Name: string;
  Id: string;
  Districts: Districts[];
}

const AboutShop = () => {
  useEffect(() => {
    getAddressOptions();
  }, [])

  const [cityOptions, setCityOptions] = useState<ComboboxOption[]>([])
  const [districtOptions, setDistrictOptions] = useState<Record<string, ComboboxOption[]>>({})

  const getAddressOptions = async () => {
    // lúc mới vào chưa query option
    // cityOption sẽ là mảng rỗng
    // dẫn tới option của Combobox null
    try {
      const res = await fetch('./address.json');
      const data: AddressRespone[] = await res.json();
      const cityOptions: ComboboxOption[] = [];
      const districtOptions: Record<string, ComboboxOption[]> = {};

      // nếu không dùng map lại thì mỗi lần tìm kiếm sẽ là 1 vòng ỏ qua tất cả dữ liệu
      // khi map lại sẽ tìm thông qua value
      data.forEach((city) => {
        cityOptions.push({ label: city.Name, value: city.Id })
        city.Districts.forEach(district => {
          // nếu district null thì sẽ lấy [] 
          // concat để nối 2 array 
          districtOptions[city.Id] = (districtOptions[city.Id] ?? []).concat([{
            label: district.Name,
            value: district.Id
          }])
        })
      })
      setCityOptions(cityOptions)
      setDistrictOptions(districtOptions)
      console.log({ cityOptions, districtOptions })

    } catch (error) {
      console.log(error)
    }
  }

  const handleAboutShop = (values: AboutShopForm) => {
    // clg viết tắt 
    console.log('about-shop', values)

    // call api bỏ values vào 
  }

  const schema = yup.object().shape({
    // thư viện yup 
    // check rỗng 
    city: yup.string().label('Tỉnh/Thành phố').required(),
    district: yup.string().label('Quận/Huyện').required(),
  })

  const mapCenter = { lat: 37.7749, lng: -122.4194 }; // Thay thế bằng trung tâm mong muốn của bạn
  const mapZoom = 10; // Đặt mức zoom ban đầu

  return (
    <div>
      <div className='h-[4.5rem] w-full'>
        <div className='max-w-screen-xl m-auto h-full px-[2rem] items-center flex gap-[0.4rem] font-thin text-[1.2rem]'>
          <div className='text-gray-500'>Trang chủ</div>
          <div className='text-gray-500'>/</div>
          <div className='text-gray-500'>Giới thiệu về chúng tôi</div>
        </div>
      </div>
      <div className='min-h-[130rem] flex flex-col max-w-screen-xl m-auto'>
        <div className='h-[4.5rem] w-full mb-2'>
          <div className='max-w-screen-xl m-auto h-full px-[2rem] items-center flex justify-center text-center'>
            <div className='uppercase font-[900] text-[2rem] text-[#2d2d2d]'>
              VỀ THƯƠNG HIỆU THỜI TRANG NAM 360®
            </div>
          </div>
        </div>
        <div className='flex items-end justify-center'>
          <Image className="object-contain mr-[1rem]" src={anh1} alt="product" width={990} />
        </div>
        <div className='h-[8rem] w-full'>
          <div className='max-w-screen-lg m-auto h-full pl-[1.2rem] text-left items-center flex justify-start text-[1.2rem]'>
            Ra đời từ 2014, thương hiệu thời trang nam 360 xác định sứ mệnh giúp các chàng trai trở nên đẹp và tự tin hơn vào bản thân mình. Ngày nay nam giới trẻ đang đứng những cơ hội tuyệt vời của xã hội hiện đại, công nghệ thông tin phát triển, cuộc cách mạng của các trang mạng xã hội để khẳng định bản thân. Bên cạnh đó, 360 hiểu rằng người trẻ cũng đang phải đối diện với những áp lực, thử thách thôi thúc bản thân phải thể hiện mình so với những người khác.
          </div>
        </div>
        <div className='flex items-end justify-center'>
          <Image className="object-contain mr-[1rem]" src={anh2} alt="product" width={990} />
        </div>
        <div className='flex flex-col'>
          <div className='h-[6rem] w-full mb-4'>
            <div className='max-w-screen-lg m-auto h-full pl-[1.2rem] text-leftitems-center flex justify-start text-[1.2rem]'>
              Thương hiệu thời trang nam 360 ra đời với mong muốn được đồng hành, truyền cảm hứng và khuyến khích các bạn nam giới trẻ dám bước ra khỏi vùng an toàn để tự do, tự tin thể hiện chính mình theo phong cách phù hợp với bản thân. Chính vì thế hệ thống thời trang nam 360 đầu tư tâm huyết nghiên cứu thiết kế chi tiết từng sản phẩm để có thể mang lại những trải nghiệm mới cho khách hàng, cũng là thông điệp muốn nhắn nhủ đến các bạn trẻ hãy cho bản thân trải nghiệm, dám thay đổi, bứt phá để vươn lên.
            </div>
          </div>
          <div className='h-[4rem] w-full mb-4'>
            <div className='max-w-screen-lg m-auto h-full pl-[1.2rem] text-left items-center flex justify-start text-[1.2rem]'>
              Chúng ta chỉ thực sự thay đổi khi chúng ta hành động. 360 tin rằng dù có thể thành công hay thất bại, nhưng chắc chắn chỉ có những trải nghiệm mới giúp bạn trưởng thành. Trưởng thành là một hành trình với những dấu mốc thanh xuân, để khi nhìn lại tôi và bạn có thể tự tin không phải nuối tiếc “giá như…”
            </div>
          </div>
          <div className='h-[2rem] w-full mb-10'>
            <div className='max-w-screen-lg m-auto h-full pl-[1.2rem] items-center flex justify-start text-[1.2rem]'>
              360 tin rằng mỗi bạn trẻ là một phiên bản độc đáo và duy nhất.
            </div>
          </div>
        </div>
        <div>
          <div className='h-[4.5rem] w-full mb-4'>
            <div className='uppercase font-[900] text-[2rem] text-[#2d2d2d] ml-96'>
              Hệ thống của hàng
            </div>
          </div>
          <Formik
            // giá trị khởi tạo ban đầu
            initialValues={{
              // chú ý cái tên trong initialValues phải giống kiểu và tên với values trong handleAboutShop do trong onSubmit
            }}

            validationSchema={schema}
            //  validateOnBlur= {false}
            //  validateOnChange = {false}
            //  validateOnMount = {false}

            // hàm sẽ được gọi khi submit
            onSubmit={handleAboutShop}

          >
            {
              // children hàm số trả về jsx là 1 component
              // value sẽ là state tổng chứa giá trị của cả form name, email
              // 
              ({ values, touched, errors, setFieldValue, setFieldTouched, setFieldError, handleSubmit, handleBlur, handleChange, isValid }) =>
                <form className="w-full" onSubmit={handleSubmit}>
                  <div className="flex w-full gap-[3.2rem]">
                    {/* dùng grid chia làm 5 cột */}
                    {/* box-sizing là tổng chiều dài của phần tử có tính thêm border, padding hay không */}
                    {/* mã màu bg-[#f7f8fa] */}
                    <div className="bg-white flex-1 p-[3rem] h-fit gap-[2rem]">
                      <div className="grid grid-cols-2 list-input gap-x-[3rem] gap-y-[2rem]">
                        <Combobox
                          label="Tỉnh/Thành phố"
                          options={cityOptions}
                          selected={values.city}
                          onChange={(option) => {
                            if (option && option.value) {
                              setFieldValue('city', option.value);
                            } else {
                              // Xử lý trường hợp khi option không tồn tại hoặc không có thuộc tính 'value'
                              console.error("Invalid option:", option);
                            }
                          }}
                          hasError={touched.city && !isBlank(errors.city)}
                          errorMessage={errors.city}
                        />

                        <Combobox
                          label="Quận/Huyện"
                          // ?? là nếu null thì sẽ truyền cái đường sau thay thế không phải boolean
                          // || sẽ lấy cả null và boolean nghĩa là cái dk1 false thì sẽ lấy cái phía sau
                          // ? : là if else
                          options={districtOptions[values.city ?? ''] ?? []}
                          selected={values.district}
                          onChange={(option) => {
                            if (option && option.value) {
                              setFieldValue('district', option.value)
                            } else {
                              // Xử lý trường hợp khi option không tồn tại hoặc không có thuộc tính 'value'
                              console.error("Invalid option:", option);
                            }
                          }}
                          hasError={touched.district && !isBlank(errors.district)}
                          errorMessage={errors.district}
                        />
                      </div>
                      <button disabled={!isValid} type='submit' className='uppercase font-bold cursor-pointer disabled:opacity-[0.5] text-white py-2 px-4 mt-[1.6rem] bg-[#000000] text-[1.4rem] flex items-center'>Tìm Kiếm</button>
                    </div>
                  </div>
                </form>
            }
          </Formik>
          <div>
            <div>
              {/* <Map center={mapCenter} zoom={mapZoom} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default AboutShop