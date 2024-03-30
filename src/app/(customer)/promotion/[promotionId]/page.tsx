'use client'
import Promotion from "@/components/Promotion";


interface PromotionPageProps {
  params: {
    promotionId: string;
  }
}
//page detail
const PromotionPage = (props: PromotionPageProps) => {
  return (
    <Promotion promotionId={props.params.promotionId} />
  )
}

export default PromotionPage