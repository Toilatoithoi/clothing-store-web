import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { RestError, verifyToken } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { bill_product } from '@prisma/client';
import { ORDER_STATUS, ROLES } from '@/constants';
import { isBlank } from '@/utils';

export const PUT = async (
  req: NextRequest,
  { params }: { params: { billId: string } }
) => {
  const data = await verifyToken(req);
  if (data == null) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 });
  }

  const id = Number(params.billId);
  const url = new URL(req.url);
  const username = url.searchParams.get('username')?.toString();
  // const body = await req.json();
  // validate data: user_id có hợp lệ k? .....

  try {
    const bill = await prisma.bill.findFirst({
      select: {
        bill_product: true,
        id: true,
        status: true,
      },
      where: {
        id,
        ...(data.role !== ROLES.ADMIN && {
          user: {
            username: data.username,
          },
        }),
        ...(data.role === ROLES.ADMIN && {
          user: {
            username: {
              contains: username,
            },
          },
        }),
      },
    });
    // // lây thông tin bill trên db -> nếu mà không có thông tin bill -> thông báo lỗi bill not exist
    if (bill == null) {
      return NextResponse.json(
        {
          code: 'Bill_NOT_EXIST',
          message: 'Bill không tồn tại',
        },
        { status: 403 }
      );
    }

    if (data.role === ROLES.CUSTOMER && bill.status !== ORDER_STATUS.NEW) {
      return NextResponse.json(
        {
          code: 'STATUS_INVALID',
          message: 'Trạng thái không hợp lệ',
        },
        { status: 403 }
      );
    }

    //TODO: nếu status là CANCEL thì tính toán lại stock và sold của product_model tương tự lúc tạo bill
    //TODO: vì hàng hoàn có thế bị hỏng nên xem xét thêm 1 param để có thể ignore việc cộng lại sản phẩm vào stock ( vẫn phải trừ đã sold)
    // update data vào hệ thống

    const body = await req.json();
    const [updateBill] = await prisma.$transaction([
      prisma.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          status: body.status,
          reason: body.reason,
        },
      }),
      // cập nhật lại stock và sold
      // từ các trạng thái sang trạng thái Giao hàng thành công 
      // khi từ trạng thái Chờ xác nhận, Đã xác nhận, Đang vận chuyển -> Giao hàng thành công thì số hàng đã bán sẽ tăng  
      ...((bill.status === ORDER_STATUS.NEW || bill.status === ORDER_STATUS.CONFIRM || bill.status === ORDER_STATUS.TRANSPORTED) && (body.status === ORDER_STATUS.SUCCESS)
        ? [
          ...bill.bill_product.map((item: bill_product) =>
            prisma.product_model.update({
              where: {
                id: item.product_model_id || 0,
              },
              data: {
                sold: {
                  // cộng thêm item.quantity
                  increment: item.quantity,
                },
              },
            })
          ),
        ]
        : []),
      // khi từ trạng thái Đã hủy, Giao hàng thất bại, Từ chối -> Giao hàng thành công thì số hàng đã bán sẽ tăng, số hàng trong kho sẽ giảm
      ...((bill.status === ORDER_STATUS.CANCELED || bill.status === ORDER_STATUS.FAILED || bill.status === ORDER_STATUS.REJECT || body.status === ORDER_STATUS.REQUEST_CANCEL) && (body.status === ORDER_STATUS.SUCCESS)
        ? [
          ...bill.bill_product.map((item: bill_product) =>
            prisma.product_model.update({
              where: {
                id: item.product_model_id || 0,
              },
              data: {
                sold: {
                  // cộng thêm item.quantity
                  increment: item.quantity,
                },
                stock: {
                  // tăng đi item.quantity
                  decrement: item.quantity,
                },
              },
            })
          ),
        ]
        : []),

      // chuyển giữa các trạng thái đặt hàng và thất bại
      // khi từ trạng thái Chờ xác nhận, Đã xác nhận, Đang vận chuyển -> Đã hủy, Giao hàng thất bại, Từ chối thì số hàng trong kho sẽ tăng  
      ...((bill.status === ORDER_STATUS.NEW || bill.status === ORDER_STATUS.CONFIRM || bill.status === ORDER_STATUS.TRANSPORTED) && (body.status === ORDER_STATUS.CANCELED || body.status === ORDER_STATUS.FAILED || body.status === ORDER_STATUS.REJECT || body.status === ORDER_STATUS.REQUEST_CANCEL)
        ? [
          ...bill.bill_product.map((item: bill_product) =>
            prisma.product_model.update({
              where: {
                id: item.product_model_id || 0,
              },
              data: {
                stock: {
                  // tăng đi item.quantity
                  increment: item.quantity,
                },
              },
            })
          ),
        ]
        : []),
      // khi từ trạng thái Đã hủy, Giao hàng thất bại, Từ chối -> Chờ xác nhận, Đã xác nhận, Đang vận chuyển thì số hàng trong kho sẽ giảm  
      ...((bill.status === ORDER_STATUS.CANCELED || bill.status === ORDER_STATUS.FAILED || bill.status === ORDER_STATUS.REJECT || bill.status === ORDER_STATUS.REQUEST_CANCEL) && (body.status === ORDER_STATUS.NEW || body.status === ORDER_STATUS.CONFIRM || body.status === ORDER_STATUS.TRANSPORTED)
        ? [
          ...bill.bill_product.map((item: bill_product) =>
            prisma.product_model.update({
              where: {
                id: item.product_model_id || 0,
              },
              data: {
                stock: {
                  // tăng đi item.quantity
                  decrement: item.quantity,
                },
              },
            })
          ),
        ]
        : []),
      
      // chuyển từ trạng thái thành công sang trạng thái khác
      // khi từ trạng thái Giao hàng thành công -> Chờ xác nhận, Đã xác nhận, Đang vận chuyển thì số hàng đã bán sẽ giảm
      ...((bill.status === ORDER_STATUS.SUCCESS) && (body.status === ORDER_STATUS.NEW || body.status === ORDER_STATUS.CONFIRM || body.status === ORDER_STATUS.TRANSPORTED)
        ? [
          ...bill.bill_product.map((item: bill_product) =>
            prisma.product_model.update({
              where: {
                id: item.product_model_id || 0,
              },
              data: {
                sold: {
                  // giảm thêm item.quantity
                  decrement: item.quantity,
                }
              },
            })
          ),
        ]
        : []), 
      // khi từ trạng thái Giao hàng thành công -> Đã hủy, Giao hàng thất bại, Từ chối thì số hàng đã bán sẽ giảm, số hàng trong kho sẽ tăng
      ...((bill.status === ORDER_STATUS.SUCCESS) && (body.status === ORDER_STATUS.CANCELED || body.status === ORDER_STATUS.FAILED || body.status === ORDER_STATUS.REJECT || body.status === ORDER_STATUS.REQUEST_CANCEL)
        ? [
          ...bill.bill_product.map((item: bill_product) =>
            prisma.product_model.update({
              where: {
                id: item.product_model_id || 0,
              },
              data: {
                sold: {
                  // giảm thêm item.quantity
                  decrement: item.quantity,
                },
                stock: {
                  // tăng đi item.quantity
                  increment: item.quantity,
                },
              },
            })
          ),
        ]
        : []),
    ]);
    return NextResponse.json({ updateBill });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { billId: string } }
) => {
  const data = await verifyToken(req);
  if (data == null) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 });
  }
  const id = Number(params.billId);
  try {
    const bill = await prisma.bill.findFirst({
      where: {
        id,
        ...(data.role !== ROLES.ADMIN) && {
          user: {
            username: data.username,
          },
        }
      },
      select: {
        id: true,
        city: true,
        district: true,
        wards: true,
        address: true,
        note: true,
        phoneNumber:true,
        email: true,
        created_at: true,
        total_price: true,
        user: {
          select: {
            name: true,
            phoneNumber: true,
            dob: true,
            username: true,
          },
        },
        updated_at: true,
        full_name: true,
        bill_product: {
          select: {
            // product_model: {
            //   select: {
            //     product: {
            //       select: {
            //         name: true,
            //       },
            //     },
            //     price: true,
            //     size: true,
            //     color: true,
            //     image: true,
            //   },
            // },
            product_name: true,
            price: true,
            size: true,
            color: true,
            image: true,
            quantity: true,
          },
        },
      },
    });

    // lây thông tin bill trên db -> nếu mà không có thông tin bill -> thông báo lỗi bill not exist
    if (bill == null) {
      return NextResponse.json(
        {
          code: 'Bill_NOT_EXIST',
          message: 'Bill không tồn tại',
        },
        { status: 403 }
      );
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
