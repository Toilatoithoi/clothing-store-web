import Promotion from "@/components/Promotion";

interface PromotionPageProps {
    params: {
      promotionId: string;
    }
  }

  const PromotionPage = (props: PromotionPageProps) => {
    return (
       <Promotion promotionId={props.params.promotionId} />
    )
  }
  
  export default PromotionPage