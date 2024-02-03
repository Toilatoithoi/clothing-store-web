import Header from '@/components/Header'
import { Menu } from "@/components/Menu"
import Image from 'next/image'

export default function Home() {
  return <div>
    <Menu />
  </div>
}
// khi load sẽ load layout trước rồi mới load page



// cách sử dụng comploment
// b1: import Header from '@/components/Header'
// b2: rồi coi như 1 cái thẻ <Header />

// Thư mục app là thư mục chính:
// -	Phải đặt đúng tên thì sẽ ăn :
//            -   default.js
//            -   error.js
//            -   layout.js
//            -   not-found.js
//            -   page.js
//            -   route.js
//            -   Route Segment Config
//            -   template.js
// Khi người dùng truy cập vào route là link localhost:3000/folder thì nó se lấy
// comploment vào trong thư mục đấy rồi trả về cho user
// khi trong tìm được file sẽ trả về not found