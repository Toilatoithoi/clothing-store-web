'use client'
import React from 'react'
import './style.scss'
import Facebook from '@/assets/svg/facebook.svg'
import Instagram from '@/assets/svg/instagram.svg'
import Google from '@/assets/svg/google.svg'
import PhoneCall from '@/assets/svg/phone-call.svg'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-[#ddd] h-[40rem] flex">
      {/* phải sitemap */}
      <div className="h-fit w-[60rem] flex flex-col ml-[9rem] mt-[3rem]">

        {/* dịch vụ */}
        <div className="flex gap-5 justify-between mb-7">
          {/* Thương hiệu */}
          <div className="flex flex-col">
            {/* tiêu đề */}
            <span className="font-bold mb-2 text-[1.2rem]">
              Về thương hiệu
            </span>
            {/*nội dung  */}
            <ul>
              <li className="text-[1rem] text-[#6d6d6d] hover:text-[#BC0517] cursor-pointer"><Link href="/about-shop">Giới thiệu 360</Link></li>
              <li className="text-[1rem] text-[#6d6d6d] hover:text-[#BC0517] cursor-pointer"><Link href="/about-shop">Hệ thống cửa hàng</Link></li>
              <li className="text-[1rem] text-[#6d6d6d] hover:text-[#BC0517] cursor-pointer">Khuyến mãi</li>
              <li className="text-[1rem] text-[#6d6d6d] hover:text-[#BC0517] cursor-pointer"><Link href="/promotion/11">Tuyển dụng</Link></li>
            </ul>
          </div>
          {/* hộ trợ khách hàng */}
          <div className="flex flex-col">
            {/* tiêu để */}
            <span className="font-bold mb-2 text-[1.2rem]">
              Hộ trợ khách hàng
            </span>
            {/* nội dung */}
            <ul>
              <li className="text-[1rem] text-[#6d6d6d] hover:text-[#BC0517] cursor-pointer"><Link href="/promotion/12">Chính sách bảo mật thông tin</Link></li>
              <li className="text-[1rem] text-[#6d6d6d] hover:text-[#BC0517] cursor-pointer"><Link href="/promotion/10">Chính sách đổi trả</Link></li>
              <li className="text-[1rem] text-[#6d6d6d] hover:text-[#BC0517] cursor-pointer">Hướng dẫn đặt hàng</li>
              <li className="text-[1rem] text-[#6d6d6d] hover:text-[#BC0517] cursor-pointer"><Link href="/promotion/9">Chính sách vận chuyển</Link></li>
            </ul>
          </div>
          {/* dịch vụ */}
          <div className="flex flex-col">
            {/* tiêu đề */}
            <span className="font-bold mb-2 text-[1.2rem]">
              Dịch vụ khách hàng
            </span>
            {/* nội dung */}
            <span className="text-[1rem] text-[#6d6d6d] hover:text-[#BC0517] cursor-pointer"><Link href="/about-shop">Liên hệ chúng tôi</Link></span>
          </div>
        </div>

        {/* thông tin */}
        <div className="flex flex-col">
          {/* tiêu đề */}
          <span className="font-bold mb-2 text-[1.2rem]">
            Công ty cổ phần thời trang 360
          </span>
          {/* nội dung */}
          <ul>
            <li className="text-[1rem] text-[#2d2d2d]">VPGD: 60/850 Đường Láng, Láng Thượng, Đống Đa, Hà Nội</li>
            <li className="text-[1rem] text-[#2d2d2d]">Trụ sở KD: Đội 6, Xã Phương Đình, Huyện Đan Phượng, Thành phố Hà nội, Việt Nam</li>
            <li className="text-[1rem] text-[#2d2d2d]">Hotline: 0973 285 886</li>
            <li className="text-[1rem] text-[#2d2d2d]">Email: 360boutique.vn@gmail.com</li>
            <li className="text-[1rem] text-[#2d2d2d]">GPKD: 0107756568</li>
          </ul>
        </div>
      </div>

      {/* social media */}
      <div className=" w-[60rem] flex flex-col ml-[12rem] mt-[3rem]">
        <span className="font-bold mb-2 text-[1.2rem]">
          Kết nối 360 cập nhật những thông tin mới nhất
        </span>
        <ul className="flex ml-2 mb-4 align-middle items-center gap-5">
          {/* <li><Video /></li> */}
          <li><Facebook /></li>
          <li><Instagram /></li>
          <li><Google /></li>
          <li><PhoneCall /></li>     
        </ul>
        {/* <span className="font-bold mb-5 text-[1.2rem]">
          Đăng kí nhận tin từ 360
        </span>
        <div className="flex items-center h-[3.4rem] mb-7">
              <input type="text" className='h-[90%] p-4  outline-none w-[30rem]' placeholder='Nhập SDT của bạn' />
              <div className="h-full flex items-center justify-center bg-[#E6E7E9] p-4 text-center mt-1 border border-[black] hover:text-[white] hover:bg-gray-500">
                <button className="text-[1rem] font-bold uppercase">Đăng ký</button>
              </div>
        </div> */}
        {/* <span className="font-bold text-[1.2rem]">
          Phương thức thanh toán
        </span>
        <div className="flex">
             <img src="https://360.com.vn/wp-content/uploads/2022/06/pay.svg" className="w-[15rem] mr-10"></img>
             <img src="https://360.com.vn/wp-content/uploads/2022/06/bct.svg" className='w-[15rem]'></img>
        </div> */}
      </div>
    </footer>
  )
}

export default Footer