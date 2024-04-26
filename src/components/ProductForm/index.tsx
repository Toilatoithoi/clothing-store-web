import { isBlank, uuid } from '@/utils';
import React, { useEffect, useRef, useState } from 'react';
import CategoryPicker from '../CategoryPicker';
import { Formik } from 'formik';
import TextInput from '../TextInput';
import Dropdown from '../Dropdown';
import Close from '@/assets/svg/x-circle.svg';
import * as yup from 'yup';
const Editor = dynamic(() => import('../Editor'), {ssr: false});
import FieldContainer from '../FieldContainer';
import './style.scss';
import dynamic from 'next/dynamic';
import ImageUploader from '../ImageUploader';
import { CreateProductReq, ProductModelReq } from '@/interfaces/request';
import { ProductDetail, ProductModel } from '@/interfaces/model';
import { uploadFile } from '@/utils/fetcher';
import { METHOD } from '@/constants';
import { useMutation, useSWRWrapper } from '@/store/custom';
import Loader from '../Loader';

type Props = {
  onClose(): void;
  onRefresh(): void;
  data?: Record<string, unknown>;
};

interface ProductValues {
  name: string;
  categoryId?: string;
  price?: number;
  description?: string;
  // danh sách màu sắc và size hiển thị 
  colors: string[];
  sizes: string[];
  // là các giá trị ban đầu sẽ không thể xoá mà chỉ thêm
  rawSizes: string[];
  rawColors: string[];
  // danh sách màu sắc và size theo product_model ở input thêm
  sizeTmp?: string;
  colorTmp?: string;
  // record vì có nhiều giá nên không thể đặt mỗi giá là một biến được nên đặt là record là 1 object có key là string và value là number
  priceConfig: Record<string, number>;
  quantityConfig: Record<string, number>;
  idModelConfig?: Record<string, number>;
  fileConfig: Record<string, File | string>;
}

const ProductForm = (props: Props) => {
  const componentId = useRef(uuid());
  const isModify = props.data != null;
  const [loading, setLoading] = useState(false);
  const { data: getProduct, isLoading } = useSWRWrapper<ProductDetail>(
    props.data ? `/api/product/${props.data?.id}` : null,
    {
      url: `/api/product/${props.data?.id}`,
    }
  );

  console.log({getProduct})

  const { trigger: createProduct } = useMutation('/api/product', {
    method: METHOD.POST,
    loading: true,
    url: '/api/product',
    notification: {
      title: 'Tạo sản phẩm',
      content: 'Tạo sản phẩm thành công',
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

  const { trigger: updateProduct } = useMutation(
    `/api/product/${props.data?.id}`,
    {
      method: METHOD.PUT,
      loading: true,
      url: `/api/product/${props.data?.id}`,
      notification: {
        title: 'Cập nhật sản phẩm',
        content: 'Cập nhật sản phẩm thành công',
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

  const submit = async (values: ProductValues) => {
    setLoading(true);
    console.log(values)
    const model: ProductModelReq[] = [];
    if (values.colors.length > 0 && values.sizes.length > 0) {
      for (let i = 0; i < values.colors.length; i++) {
        const color = values.colors[i];
        // lấy được file theo key là color
        const file = values.fileConfig[color];
        let image = '';
        // file có thể là string vì lúc sửa chỉ cần load file string lên nếu không thay đổi file thì file vẫn là string thì không cần upload nữa
        if (file && typeof file !== 'string') {
          try {
            // upload file lên cloudinary
            const res = await uploadFile(file);
            // thu về url sau khi upload ảnh
            image = res.url as string;
          } catch (error) { }
        } else if (typeof file === 'string') {
          image = file;
        }
        // for sizes tạo model
        for (let j = 0; j < values.sizes.length; j++) {
          const size = values.sizes[j];
          const key = `${color}-${size}`;

          model.push({
            color,
            size,
            // dự vào key để lấy ra giá và số lượng
            price: Number(values.priceConfig[key] ?? values.price),
            stock: Number(values.quantityConfig[key]),
            image,
            // id dùng cho lúc sửa
            id: values.idModelConfig?.[key],
          });
        }
      }
    } else {
      if (values.colors.length > 0 && values.sizes.length == 0) {
        for (let i = 0; i < values.colors.length; i++) {
          const color = values.colors[i];
          // lấy được file theo key là color
          const file = values.fileConfig[color];
          let image = '';
          // file có thể là string vì lúc sửa chỉ cần load file string lên nếu không thay đổi dile thì file vẫn là string thì không cần upload nữa
          if (file && typeof file !== 'string') {
            try {
              // upload file lên cloudinary
              const res = await uploadFile(file);
              // thu về url sau khi upload ảnh
              image = res.url as string;
            } catch (error) { }
          } else if (typeof file === 'string') {
            image = file;
          }
          // for sizes tạo model
          const key = `${color}`;

          model.push({
            color,
            // dự vào key để lấy ra giá và số lượng
            price: Number(values.priceConfig[key] ?? values.price),
            stock: Number(values.quantityConfig[key]),
            image,
            // id dùng cho lúc sửa
            id: values.idModelConfig?.[key],
          });
        }
      }
    }
    const payload: CreateProductReq = {
      model,
      name: values.name,
      categoryId: Number(values.categoryId),
      description: values.description,
      price: Number(values.price),
    };
    if (props.data) {
      updateProduct({ ...payload });
    } else {
      createProduct({ ...payload });
    }
    console.log({ payload });
  };

  const schema = yup.object().shape({
    name: yup.string().label('Tên').required(),
    price: yup.string().label('Giá').required(),
    categoryId: yup.string().label('Danh mục').required(),
  });

  const getInitialValues = (product?: ProductDetail): ProductValues => {
    if (product) {
      const sizes = [];
      const colors = [];
      const values: ProductValues = {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: String(product.category.id),
        colors: [],
        sizes: [],
        fileConfig: {},
        priceConfig: {},
        quantityConfig: {},
        rawColors: [],
        rawSizes: []
      };
      values.idModelConfig = {};

      // thêm dữ liệu cho colors và sizes
      product.product_model.forEach((model) => {
        let key = `${model.color}-${model.size}`;
        if(!model.size){
          key = model.color
        }

        if (!values.colors.includes(model.color)) {
          values.colors.push(model.color);
        }
        if (!values.sizes.includes(model.size)) {
          values.sizes.push(model.size);
        }
        values.priceConfig[key] = model.price;
        values.quantityConfig[key] = model.stock;
        values.idModelConfig![key] = model.id!;
        values.fileConfig[model.color] = model.image;
      });
      values.sizes = values.sizes.filter(item => item);
      values.rawColors = values.colors;
      values.rawSizes = values.sizes;
      console.log({values})
      return values;
    }

    return {
      name: '',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Trắng', 'Đen'],
      priceConfig: {},
      quantityConfig: {},
      fileConfig: {},
      rawColors:[],
      rawSizes: []
    };
  };

  return (
    <Loader loading={loading} className="w-screen max-w-screen-md product-form">
      <div className="font-bold mb-[2.4rem]"> {props.data ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm'}</div>
      <div className="max-h-[80vh] overflow-y-auto">
        {props.data && isLoading ? (
          <div>Đang tải dữ liệu</div>
        ) : (
          <Formik
            onSubmit={submit}
            // validationSchema={schema}
            initialValues={getInitialValues(getProduct)}
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
              <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <TextInput
                  label="Tên sản phẩm"
                  name="name"
                  className="col-span-2"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors.name}
                  hasError={touched.name && !isBlank(errors.name)}
                />
                <TextInput
                  label="Giá"
                  name="price"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors.price}
                  hasError={touched.price && !isBlank(errors.price)}
                />

                <CategoryPicker
                  label="Danh mục"
                  level="2"
                  errorMessage={errors.categoryId}
                  hasError={touched.categoryId && !isBlank(errors.categoryId)}
                  selected={values.categoryId}
                  onChange={(value) => setFieldValue('categoryId', value)}
                />
                <FieldContainer label="Mô tả" className="col-span-2">
                  <Editor data={values.description} onChange={(data) => setFieldValue('description', data)} />
                </FieldContainer>

                {/* render kích cỡ */}
                {(!isModify || values.sizes.length >0) && <FieldContainer label="Kích cỡ" className="col-span-2">
                  <div>
                    <div className="flex gap-4 py-8">
                      {values.sizes?.map((item) => (
                        <div
                          className="h-16 w-16 hover:opacity-80 relative rounded-md border border-gray-500 text-bold flex items-center justify-center"
                          key={item}
                        >
                          {item}
                         {!values.rawSizes.includes(item) &&  <div
                            // xoá kích cỡ
                            onClick={() => {
                              // dùng filter để tìm ra size cần xoá
                              const sizes = values.sizes.filter(
                                (size) => size !== item
                              );
                              setFieldValue('sizes', sizes);
                            }}
                            className="absolute bg-white cursor-pointer h-6 w-6 top-0 right-0 translate-x-1/2 -translate-y-1/2 "
                          >
                            <Close className="h-6 w-6 " />
                          </div>}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-8">
                      {/* lúc add vào list sizes */}
                      <TextInput
                        name="sizeTmp"
                        value={values.sizeTmp}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn-primary !w-fit px-8"
                        onClick={() => {
                          // lúc nhấn thêm nếu sizeTmp khác null thì add thằng sizeTmp vào bảng sizes đồng thời là clear textInput xoá sizeTmp
                          if (!isBlank(values.sizeTmp) && !values.rawSizes.includes(values.sizeTmp!) && !values.sizes.includes(values.sizeTmp!)) {
                            const sizes = [...values.sizes, values.sizeTmp];
                            setFieldValue('sizes', sizes);
                            setFieldValue('sizeTmp', '');
                          }
                        }}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </FieldContainer>}
                <FieldContainer label="Màu sắc" className="col-span-2">
                  <div>
                    <div className="flex gap-4 py-8">
                      {values.colors?.map((item) => (
                        <div
                          className="h-16 w-fit px-4 hover:opacity-80 relative rounded-md border border-gray-500 text-bold flex items-center justify-center"
                          key={item}
                        >
                          {item}
                         {!values.rawColors.includes(item) &&  <div
                            onClick={() => {
                              const colors = values.colors.filter(
                                (size) => size !== item
                              );
                              setFieldValue('colors', colors);
                            }}
                            className="absolute bg-white cursor-pointer h-6 w-6 top-0 right-0 translate-x-1/2 -translate-y-1/2 "
                          >
                            <Close className="h-6 w-6 " />
                          </div>}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-8">
                      <TextInput
                        name="colorTmp"
                        value={values.colorTmp}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn-primary !w-fit px-8"
                        onClick={() => {
                          if (!isBlank(values.colorTmp) && !values.rawColors.includes(values.colorTmp!) && !values.colors.includes(values.colorTmp!)) {
                            const colors = [...values.colors, values.colorTmp];
                            setFieldValue('colors', colors);
                            setFieldValue('colorTmp', '');
                          }
                        }}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </FieldContainer>
                <FieldContainer label="Model sản phẩm" className="col-span-2">
                  {
                    // có màu sắc và kích cỡ
                    values.colors.length != 0 && values.sizes.length != 0 && <div className="w-full">
                      <table className="w-full border-collapse border border-slate-500">
                        <thead>
                          <tr>
                            <th className="border border-slate-600 text-center">
                              Ảnh
                            </th>
                            <th className="border border-slate-600 text-center">
                              Màu sắc
                            </th>
                            <th className="border border-slate-600 text-center">
                              Kích cỡ
                            </th>
                            <th className="border border-slate-600 text-center">
                              Giá
                            </th>
                            <th className="border border-slate-600 text-center">
                              Số lượng
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* for theo colors */}
                          {values.colors.map((color, idx) => {
                            // for theo sizes mỗi size sẽ một hàng
                            return values.sizes.map((size, sizeIdx) => {
                              // key để định danh đối tượng giá và size của đối tượng nào
                              const key = `${color}-${size}`;
                              return (
                                <tr key={key}>
                                  {sizeIdx === 0 && (
                                    <td
                                      // rowSpan là chiếm bao nhiêu dòng do ảnh chỉ cần 1 dòng cho tất cả các kích cỡ
                                      rowSpan={values.sizes.length}
                                      className="border border-slate-600 text-center w-[15rem]"
                                    >
                                      <div className="w-full flex items-center justify-center p-2 min-w-[10rem] min-h-[20rem] h-full">
                                        {/* do image chỉ liên đến màu sắc nên key chỉ là color */}
                                        <ImageUploader
                                          initImage={
                                            typeof values.fileConfig[color] ===
                                              'string'
                                              ? (values.fileConfig[
                                                color
                                              ] as string)
                                              : null
                                          }
                                          onChange={(file) =>
                                            setFieldValue(
                                              `fileConfig[${color}]`,
                                              file
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                  )}
                                  {sizeIdx === 0 && (
                                    <td
                                      // rowSpan là chiếm bao nhiêu dòng do màu sắc chỉ cần 1 dòng cho tất cả các kích cỡ
                                      rowSpan={values.sizes.length}
                                      className="border border-slate-600 text-center"
                                    >
                                      {color}
                                    </td>
                                  )}
                                  <td className="border border-slate-600 text-center">
                                    {size}
                                  </td>
                                  <td className="border border-slate-600 text-center">
                                    <div className="min-w-[5rem] w-full">
                                      <TextInput
                                        name={`priceConfig[${key}]`}
                                        onChange={handleChange}
                                        value={
                                          // nếu values.priceConfig[key] rỗng thì lấy giá chung ở input giá
                                          values.priceConfig[key] ?? values.price
                                        }
                                        className="w-full"
                                        type="number"
                                      />
                                    </div>
                                  </td>
                                  <td className="border border-slate-600 text-center">
                                    <div className="min-w-[5rem] w-full">
                                      <TextInput
                                        name={`quantityConfig[${key}]`}
                                        onChange={handleChange}
                                        value={values.quantityConfig[key] ?? 0}
                                        className="w-full"
                                        type="number"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          })}
                        </tbody>
                      </table>
                    </div>
                  }
                  {
                    // nếu có màu sắc nhưng không có kích cỡ
                    values.colors.length != 0 && values.sizes.length == 0 && <div className="w-full">
                      <table className="w-full border-collapse border border-slate-500">
                        <thead>
                          <tr>
                            <th className="border border-slate-600 text-center">
                              Ảnh
                            </th>
                            <th className="border border-slate-600 text-center">
                              Màu sắc
                            </th>
                            <th className="border border-slate-600 text-center">
                              Giá
                            </th>
                            <th className="border border-slate-600 text-center">
                              Số lượng
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* for theo colors */}
                          {values.colors.map((color, idx) => {
                            // key để định danh đối tượng giá và size của đối tượng nào
                            const key = `${color}`;
                            return (
                              <tr key={key}>
                                <td
                                  // rowSpan là chiếm bao nhiêu dòng do ảnh chỉ cần 1 dòng cho tất cả các kích cỡ
                                  // rowSpan={values.colors.length}
                                  className="border border-slate-600 text-center w-[15rem]"
                                >
                                  <div className="w-full flex items-center justify-center p-2 min-w-[10rem] min-h-[20rem] h-full">
                                    {/* do image chỉ liên đến màu sắc nên key chỉ là color */}
                                    <ImageUploader
                                      initImage={
                                        typeof values.fileConfig[color] ===
                                          'string'
                                          ? (values.fileConfig[
                                            color
                                          ] as string)
                                          : null
                                      }
                                      onChange={(file) =>
                                        setFieldValue(
                                          `fileConfig[${color}]`,
                                          file
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                                <td
                                  // rowSpan là chiếm bao nhiêu dòng do màu sắc chỉ cần 1 dòng cho tất cả các kích cỡ
                                  // rowSpan={values.colors.length}
                                  className="border border-slate-600 text-center"
                                >
                                  {color}
                                </td>
                                <td className="border border-slate-600 text-center">
                                  <div className="min-w-[5rem] w-full">
                                    <TextInput
                                      name={`priceConfig[${key}]`}
                                      onChange={handleChange}
                                      value={
                                        // nếu values.priceConfig[key] rỗng thì lấy giá chung ở input giá
                                        values.priceConfig[key] ?? values.price
                                      }
                                      className="w-full"
                                      type="number"
                                    />
                                  </div>
                                </td>
                                <td className="border border-slate-600 text-center">
                                  <div className="min-w-[5rem] w-full">
                                    <TextInput
                                      name={`quantityConfig[${key}]`}
                                      onChange={handleChange}
                                      value={values.quantityConfig[key] ?? 0}
                                      className="w-full"
                                      type="number"
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  }
                </FieldContainer>
                <div className="flex gap-2 col-span-2 mt-[5rem]">
                  <button
                    type="button"
                    className="btn flex-1"
                    onClick={props.onClose}
                  >
                    Hủy
                  </button>
                  <button disabled={!isValid}  type="submit" className="btn-primary flex-1">
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

export default ProductForm;
